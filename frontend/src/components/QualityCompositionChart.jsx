import React from 'react';

export default function QualityCompositionChart({ healthy = 72, damaged = 12, rotten = 6, sprouted = 5, undersized = 5 }) {
  const items = [
    { label: "Healthy Bulbs", pct: healthy, color: "#059669", bg: "#D1FAE5" },
    { label: "Surface Damaged", pct: damaged, color: "#D97706", bg: "#FEF3C7" },
    { label: "Visible Soft Rot", pct: rotten, color: "#DC2626", bg: "#FEE2E2" },
    { label: "Sprouted Shoots", pct: sprouted, color: "#2563EB", bg: "#DBEAFE" },
    { label: "Visually Undersized", pct: undersized, color: "#7C3AED", bg: "#EDE9FE" }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Horizontal Stacked Bar */}
      <div style={{
        height: '24px',
        width: '100%',
        backgroundColor: '#E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        marginBottom: '20px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
      }}>
        {items.map((item, idx) => (
          item.pct > 0 ? (
            <div
              key={idx}
              style={{
                width: `${item.pct}%`,
                backgroundColor: item.color,
                height: '100%',
                transition: 'width 0.6s ease'
              }}
              title={`${item.label}: ${item.pct}%`}
            />
          ) : null
        ))}
      </div>

      {/* Detailed Breakdown Legend Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            backgroundColor: item.bg,
            border: `1px solid ${item.color}30`,
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: item.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
              {item.pct}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
