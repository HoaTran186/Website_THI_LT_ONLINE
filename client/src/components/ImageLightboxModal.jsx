import React from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageLightboxModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200, cursor: 'zoom-out' }}>
      <div 
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'modal-pop 0.15s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '14px'
          }}
        >
          Đóng (ESC) ✕
        </button>

        <img 
          src={imageUrl} 
          alt="Phóng to hình ảnh sa hình / biển báo"
          style={{
            maxWidth: '100%',
            maxHeight: '86vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            background: '#ffffff',
            padding: '8px'
          }}
        />
        <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '10px' }}>
          Hình ảnh phóng to chi tiết sa hình và biển báo
        </div>
      </div>
    </div>
  );
}
