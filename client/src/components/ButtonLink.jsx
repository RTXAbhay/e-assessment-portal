// File: src/components/ButtonLink.jsx
import React from 'react';

export default function ButtonLink({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        backgroundColor: '#1D4ED8',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color .2s',
      }}
      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
    >
      {label}
    </button>
  );
}