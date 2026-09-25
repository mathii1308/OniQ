import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export function ConfidenceBadge({ confidence, level }) {
  let color = '#059669';
  let bg = '#D1FAE5';
  let Icon = ShieldCheck;
  let text = `HIGH CONFIDENCE (${confidence}%)`;

  if (confidence < 60 || level === 'LOW') {
    color = '#DC2626';
    bg = '#FEE2E2';
    Icon = ShieldAlert;
    text = `LOW CONFIDENCE (${confidence}%)`;
  } else if (confidence < 80 || level === 'MODERATE') {
    color = '#D97706';
    bg = '#FEF3C7';
    Icon = AlertTriangle;
    text = `MODERATE CONFIDENCE (${confidence}%)`;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      color: color,
      backgroundColor: bg,
      border: `1px solid ${color}30`
    }}>
      <Icon size={14} />
      {text}
    </span>
  );
}

export function GradingBadge({ grade }) {
  let color = '#059669';
  let bg = '#D1FAE5';

  if (grade?.includes('B')) {
    color = '#2563EB';
    bg = '#DBEAFE';
  } else if (grade?.includes('C')) {
    color = '#D97706';
    bg = '#FEF3C7';
  } else if (grade?.includes('MANUAL') || grade?.includes('REJECT')) {
    color = '#DC2626';
    bg = '#FEE2E2';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '800',
      color: color,
      backgroundColor: bg,
      letterSpacing: '0.5px'
    }}>
      {grade}
    </span>
  );
}
