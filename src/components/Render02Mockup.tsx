import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Render02Mockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const segmentStartFrame = (segment?.startFrame ?? 0) + fps * 5;
  const localFrame = frame - segmentStartFrame;

  // 仮想DOM生成: id: 8 以降常に表示（id: 8 自身の場合はフェードイン）
  const vdomOpacity = (segment?.id ?? 0) === 8
    ? interpolate(localFrame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : (segment?.id ?? 0) > 8
      ? 1
      : 0;

  // コールバック登録: id: 13 でフェードイン、id: 13 より後で常に表示
  const callbackOpacity = (segment?.id ?? 0) === 17
    ? interpolate(localFrame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : (segment?.id ?? 0) > 17
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
      <h2 style={{ fontSize: 80, lineHeight: 0 }}>Render</h2>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <div style={{ opacity: vdomOpacity, fontSize: 60, fontWeight: 'bold',textAlign:'center' }}>仮想DOM生成</div>
        <div style={{ opacity: callbackOpacity, fontSize: 60, fontWeight: 'bold' }}>コールバック登録</div>
      </div>
    </div>
  );
};
