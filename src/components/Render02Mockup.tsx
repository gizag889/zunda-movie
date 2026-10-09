import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const Render02Mockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();

  const opacity = segment?.id === 8
    ? interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : (segment?.id ?? 0) > 8
      ? 1
      : 0;

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
      <h2 style={{ fontSize: 80  , lineHeight: 0 }}>Render</h2>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <div style={{ opacity, fontSize: 60, fontWeight: 'bold' }}>仮想DOM生成</div>
        <div style={{ opacity, fontSize: 60, fontWeight: 'bold' }}>コールバック登録</div>

      </div>
    </div>
  );
};
