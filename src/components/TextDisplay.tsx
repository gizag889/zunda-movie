import React from 'react';

export const TextDisplay: React.FC<{ style?: React.CSSProperties, segment?: any, mediaElement?: any }> = ({ style, segment, mediaElement }) => {
  return (
    <div style={{
      ...style,
      display: 'flex',
      justifyContent: 'start',
      padding: '40px',
      borderRadius: '20px',
      fontSize: '64px',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center'
    }}>
      {mediaElement?.text || "テキストが設定されていません"}
    </div>
  );
};
