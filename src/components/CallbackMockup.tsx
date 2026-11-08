import React from 'react';

export const CallbackMockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  return (
    <div style={{
      ...style,
      backgroundColor: '#FFFFFF',
      color: '#333333',
      fontFamily: 'Noto Sans JP',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '16px',
      border: '8px solid #4CAF50'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', marginTop: '20px', color: '#4CAF50' }}>
        <div style={{ fontSize: 90, fontWeight: 'bold' }}>Callback</div>
        <div style={{ fontSize: 80, fontWeight: 'bold' }}>関数実行</div>
      </div>
    </div>
  );
};
