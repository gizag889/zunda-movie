import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const Commit01Mockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();

  const opacity = segment?.id === 10
    ? interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : (segment?.id ?? 0) > 10
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
      border: '8px solid #2196F3'
    }}>
      <h2 style={{ fontSize: 80, lineHeight: 0 }}>Commit</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ opacity, fontSize: 60, fontWeight: 'bold' }}>実際の画面へ反映</div>
      </div>
    </div>
  );
};
