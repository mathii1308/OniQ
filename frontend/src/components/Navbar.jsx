import React from 'react';
import { ShieldCheck, PlusCircle, LayoutDashboard, History, CheckCircle2, Cpu, Building2, LogOut } from 'lucide-react';

export default function Navbar({ currentScreen, setScreen, systemMode, currentUser, onLogout }) {
  const isDemo = systemMode?.mode?.includes("Demo");

  return (
    <header style={{
      backgroundColor: 'var(--primary-navy)',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }} className="no-print">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div 
          onClick={() => currentUser ? setScreen('dashboard') : setScreen('auth')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '20px',
            letterSpacing: '-0.5px'
          }}>
            Q
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
              OniQ
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>
              Intelligent Onion Quality Assessment
            </div>
          </div>
        </div>

        {/* Center Indicator Badge & Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Building2 size={14} color="var(--accent-green)" />
              <span>{currentUser.center_name || 'Procurement Center'}</span>
              <span style={{ opacity: 0.6, fontSize: '11px' }}>({currentUser.center_code})</span>
            </div>
          )}

          <div style={{
            display: 'none', // hidden on small mobile
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isDemo ? 'rgba(217, 119, 6, 0.2)' : 'rgba(5, 150, 105, 0.2)',
            color: isDemo ? '#FBBF24' : '#34D399',
            border: `1px solid ${isDemo ? 'rgba(245, 158, 11, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
          }} className="md-flex">
            <Cpu size={14} />
            <span>{systemMode?.mode || 'Demo Analysis Mode'}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentUser ? (
            <>
              <button
                onClick={() => setScreen('dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentScreen === 'dashboard' ? '#ffffff' : '#94A3B8',
                  backgroundColor: currentScreen === 'dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setScreen('new_assessment')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentScreen === 'new_assessment' ? '#ffffff' : '#94A3B8',
                  backgroundColor: currentScreen === 'new_assessment' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >
                <PlusCircle size={16} />
                <span>New Assessment</span>
              </button>

              <button
                onClick={() => setScreen('history')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentScreen === 'history' ? '#ffffff' : '#94A3B8',
                  backgroundColor: currentScreen === 'history' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >
                <History size={16} />
                <span>History</span>
              </button>

              <button
                onClick={() => setScreen('verify')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentScreen === 'verify' ? '#ffffff' : '#94A3B8',
                  backgroundColor: currentScreen === 'verify' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Verify</span>
              </button>

              <button
                onClick={onLogout}
                title="Switch procurement center or sign out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#F87171',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  transition: 'all 0.15s',
                  marginLeft: '6px'
                }}
              >
                <LogOut size={15} />
                <span>Switch / Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setScreen('auth')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: 'var(--accent-green)'
              }}
            >
              <span>Centre Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

