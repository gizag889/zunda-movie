import React from 'react';

export const Render03Mockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
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
      border: `8px solid ${style?.borderColor || '#FF9800'}`
    }}>
      <h2 style={{ fontSize: 80, lineHeight: 0 }}>Render</h2>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <div style={{ fontSize: 60, fontWeight: 'bold' }}>仮想DOM生成</div>
        <div style={{ fontSize: 60, fontWeight: 'bold' }}>コールバック登録判定</div>
      </div>
    </div>
  );
};
