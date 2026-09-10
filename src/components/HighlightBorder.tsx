import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const HighlightBorder: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 現在のセグメントの開始フレームを基準にして、ローカルのフレーム（0, 1, 2...）を計算する
  const mediaStartFrameGlobal = (segment?.mediaStartFrame !== undefined ? segment.mediaStartFrame : (segment?.startFrame || 0)) + fps * 5;
  const frame = globalFrame - mediaStartFrameGlobal;

  // 1回の点滅にかかるフレーム数（0.5秒）
  const blinkDuration = fps / 2;
  // 3回点滅するまでの合計フレーム数
  const totalBlinkFrames = blinkDuration * 3;

  let opacity = 1.0;
  if (frame < totalBlinkFrames) {
    // cosを使うことで 1.0(開始) -> 0.3(暗) -> 1.0(明) のサイクルを作る
    const blink = Math.cos((frame / blinkDuration) * Math.PI);
    opacity = 0.3 + (Math.abs(blink) * 0.7);
  }

  return (
    <div style={{
      ...style,
      border: style?.border || '8px solid #FF5722',
      borderRadius: style?.borderRadius || '16px',
      opacity: opacity,
      boxSizing: 'border-box',
      // マウスイベントなどをブロックしないようにする
      pointerEvents: 'none', 
    }} />
  );
};
