import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'var(--primary-navy)' }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
          {title}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
