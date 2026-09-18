import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import timingData from '../timing.json';

export const DiffCheckMockup: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const segment22 = timingData.segments.find((s: any) => s.id === 22);
  const frame22 = (segment22 ? segment22.startFrame : 0) + fps * 5;

  const opacity = interpolate(globalFrame - frame22, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      ...style,
      backgroundColor: '#FFFFFF',
      color: '#333333',
      fontFamily: 'Noto Sans JP',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '16px',
      border: `8px solid ${style?.borderColor || '#ff0066'}`,
      opacity
    }}>
      <div style={{ fontSize: 60, fontWeight: 'bold' }}>差分判定</div>
    </div>
  );
};
