import React from 'react';

export const Render02Mockup: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{
      ...style,
      backgroundColor: '#1E1E1E',
      color: '#FFFFFF',
      fontFamily: 'sans-serif',
      padding: '40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '8px',
      border: '2px solid #333'
    }}>
      <h2 style={{ marginBottom: '20px' }}>仮想DOM (Virtual DOM)</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#2D2D2D', borderRadius: '8px', textAlign: 'center' }}>
          <h3>更新前</h3>
          <p>count: 0</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>
          →
        </div>
        <div style={{ padding: '20px', backgroundColor: '#2D2D2D', borderRadius: '8px', textAlign: 'center', border: '2px solid #4CAF50' }}>
          <h3>更新後</h3>
          <p>count: 1</p>
        </div>
      </div>
    </div>
  );
};
