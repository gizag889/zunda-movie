import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Commit01Mockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = (segment?.mediaStartFrame !== undefined ? segment.mediaStartFrame : segment?.startFrame ?? 0) + fps * 5;
  const localFrame = frame - startFrame;

  // 親から style.opacity が指定されていない場合のフェードインフォールバック
  // id: 10 / 15 / 24 のみフェードインし、引き継ぎの id: 11 等では 1
  const isIntroSegment = segment?.id === 10 || segment?.id === 15 || segment?.id === 24;
  const defaultFadeIn = isIntroSegment
    ? interpolate(localFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const opacity = style?.opacity !== undefined ? style.opacity : defaultFadeIn;

  return (
    <div style={{
      ...style,
      opacity,
      backgroundColor: '#FFFFFF',
      color: '#333333',
      fontFamily: 'Noto Sans JP',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '16px',
      border: `8px solid ${style?.borderColor || '#2196F3'}`,
    }}>
      <h2 style={{ fontSize: 80, lineHeight: 0 }}>Commit</h2>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ fontSize: 60, fontWeight: 'bold' }}>実際の画面へ反映</div>
        {/* <div style={{ fontSize: 60, fontWeight: 'bold' }}>(変更分だけ)</div> */}
      </div>
    </div>
  );
};
