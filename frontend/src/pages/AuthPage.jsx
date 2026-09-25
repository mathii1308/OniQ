import React, { useState } from 'react';
import { Building2, UserCheck, Lock, Mail, MapPin, ShieldAlert, ArrowRight, UserPlus, LogIn, CheckCircle2, Award } from 'lucide-react';
import { loginProcurementCenter, registerProcurementCenter } from '../services/api';

export default function AuthPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginEmailOrCode, setLoginEmailOrCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regCenterName, setRegCenterName] = useState('');
  const [regCenterCode, setRegCenterCode] = useState('');
  const [regAgency, setRegAgency] = useState('NAFED');
  const [regLocation, setRegLocation] = useState('');
  const [regInspectorName, setRegInspectorName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Quick preset center selector for easy testing
  const presetCenters = [
    {
      name: "Nashik Main Mandi (NAFED)",
      code: "PC-MH-NSK-01",
      email: "nashik.nafed@oniq.gov.in",
      location: "Nashik, Maharashtra",
      inspector: "R. K. Sharma"
    },
    {
      name: "Mahuva APMC Hub",
      code: "PC-GJ-MHV-02",
      email: "mahuva.apmc@oniq.gov.in",
      location: "Mahuva, Gujarat",
      inspector: "Priya Patel"
    },
    {
      name: "Indore Central Procurement",
      code: "PC-MP-IND-03",
      email: "indore.procurement@oniq.gov.in",
      location: "Indore, Madhya Pradesh",
      inspector: "Amit Verma"
    }
  ];

  const handleQuickLogin = async (preset) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await loginProcurementCenter({
        email_or_code: preset.email,
        password: 'password123'
      });
      onLoginSuccess(user);
    } catch (err) {
      // Fallback object if backend isn't returning
      onLoginSuccess({
        center_name: preset.name,
        center_code: preset.code,
        agency: "NAFED",
        location: preset.location,
        inspector_name: preset.inspector,
        email: preset.email
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmailOrCode || !loginPassword) {
      setErrorMsg('Please enter your Center Code / Email and Password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await loginProcurementCenter({
        email_or_code: loginEmailOrCode,
        password: loginPassword
      });
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regCenterName || !regCenterCode || !regInspectorName || !regEmail || !regPassword) {
      setErrorMsg('Please complete all required fields to register your Procurement Centre.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const newCenter = await registerProcurementCenter({
        center_name: regCenterName,
        center_code: regCenterCode.toUpperCase(),
        agency: regAgency,
        location: regLocation || 'India Central',
        inspector_name: regInspectorName,
        email: regEmail,
        password: regPassword
      });

      // Directly log in with newly registered procurement center
      onLoginSuccess(newCenter);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 10px',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>

        {/* Left Side: Information & Branding */}
        <div style={{
          backgroundColor: 'var(--primary-navy)',
          color: '#FFFFFF',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '24px',
                color: '#FFF'
              }}>
                Q
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, lineHeight: 1.1 }}>OniQ</h1>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontWeight: '500' }}>
                  Procurement Center Quality Portal
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.3', marginBottom: '16px' }}>
              Standardized Onion Batch Grading & Verification
            </h2>

            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '28px' }}>
              Log in with your official Procurement Centre credentials or register a new procurement node to execute AI vision quality inspections, generate tamper-proof reports, and maintain traceable batch records.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--accent-green)" />
                <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500' }}>
                  Isolated assessment dashboard per procurement center
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--accent-green)" />
                <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500' }}>
                  Fresh, zero-record dashboard on first login
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--accent-green)" />
                <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: '500' }}>
                  Real-time vision metrics & digital quality reports
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#64748B' }}>
            SIH 2026 Prototype • NAFED / NCCF Standard Compliance
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{ padding: '36px 32px' }}>

          {/* Tab Controls */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'login' ? 'var(--primary-navy)' : 'var(--text-muted)',
                boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={16} />
              <span>Procurement Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'register' ? 'var(--primary-navy)' : 'var(--text-muted)',
                boxShadow: activeTab === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={16} />
              <span>Register New Centre</span>
            </button>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Procurement Center Code / Official Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. PC-MH-NSK-01 or nashik.nafed@oniq.gov.in"
                    value={loginEmailOrCode}
                    onChange={(e) => setLoginEmailOrCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-green)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)'
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Quick Demo Login Preset Buttons */}
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                  ⚡ Quick Demo Login (Select preset center):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {presetCenters.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickLogin(p)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#F8FAFC',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-navy)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.code} • Officer: {p.inspector}
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-green)' }}>Select →</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER NEW PROCUREMENT CENTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Procurement Center Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lasalgaon Sub-Market / Solapur APMC Hub"
                  value={regCenterName}
                  onChange={(e) => {
                    setRegCenterName(e.target.value);
                    if (!regCenterCode) {
                      const slug = e.target.value.substring(0, 3).toUpperCase();
                      setRegCenterCode(`PC-MH-${slug || 'NEW'}-0${Math.floor(Math.random() * 9 + 1)}`);
                    }
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    Center Code / ID *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PC-MH-LSG-04"
                    value={regCenterCode}
                    onChange={(e) => setRegCenterCode(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    Nodal Agency *
                  </label>
                  <select
                    value={regAgency}
                    onChange={(e) => setRegAgency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      backgroundColor: '#FFF'
                    }}
                  >
                    <option value="NAFED">NAFED</option>
                    <option value="NCCF">NCCF</option>
                    <option value="APMC Mandi Board">APMC Mandi Board</option>
                    <option value="State Dept of Agriculture">State Dept of Agriculture</option>
                    <option value="Farmer Producer Org (FPO)">Farmer Producer Org (FPO)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    Location / Mandi Hub *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lasalgaon, Nashik"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    In-Charge / Officer *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S. V. Kulkarni"
                    value={regInspectorName}
                    onChange={(e) => setRegInspectorName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Official Email / Username *
                </label>
                <input
                  type="email"
                  placeholder="e.g. lasalgaon.mandi@oniq.gov.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Set account password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary-navy)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <UserPlus size={16} />
                <span>{loading ? 'Registering Centre...' : 'Register Centre & Log In'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
