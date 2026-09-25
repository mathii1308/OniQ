import React, { useState } from 'react';
import { Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

export default function VisualOverlay({ imageUrl, boundingBoxes = [] }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Helper to format image URL properly (handling backend uploads vs frontend previews)
  const getFormattedUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `http://localhost:8000${url}`;
    }
    return `http://localhost:8000/${url}`;
  };

  const finalUrl = getFormattedUrl(imageUrl);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      backgroundColor: '#0F172A',
      minHeight: '340px'
    }}>
      {/* Action Header */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }} onClick={() => setShowOverlay(!showOverlay)}>
        {showOverlay ? <Eye size={14} /> : <EyeOff size={14} />}
        <span>{showOverlay ? 'Hide Visual Evidence Boxes' : 'Show Visual Evidence Boxes'}</span>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '340px',
        maxHeight: '480px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 0'
      }}>
        {!imgError && finalUrl ? (
          <img
            src={finalUrl}
            alt="Assessed Onion Batch"
            onError={() => setImgError(true)}
            style={{
              maxWidth: '100%',
              maxHeight: '460px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '4px',
              display: 'block'
            }}
          />
        ) : (
          <div style={{
            color: '#94A3B8',
            textAlign: 'center',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ImageIcon size={40} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Sample Batch Preview Image</span>
          </div>
        )}

        {/* Visual Overlay Bounding Boxes */}
        {showOverlay && !imgError && boundingBoxes && boundingBoxes.map((box) => (
          <div
            key={box.id}
            style={{
              position: 'absolute',
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
              border: `2px solid ${box.color || '#059669'}`,
              backgroundColor: `${box.color || '#059669'}25`,
              borderRadius: '4px',
              pointerEvents: 'none',
              boxShadow: '0 0 8px rgba(0,0,0,0.5)',
              zIndex: 5
            }}
          >
            <span style={{
              position: 'absolute',
              top: '-22px',
              left: '0',
              backgroundColor: box.color || '#059669',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {box.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

