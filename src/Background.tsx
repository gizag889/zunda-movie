import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Segment } from './types';

interface BackgroundProps {
  segments: Segment[];
}

export const Background: React.FC<BackgroundProps> = ({ segments }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // 現在のセグメントを特定 (イントロの5秒分シフトしていることを考慮)
  const currentSegment = segments.find(
    (s: any) => frame >= s.startFrame + fps * 5 && frame < s.startFrame + fps * 5 + s.durationInFrames
  );

  // デフォルトの設定
  let bgSrc = "images/background.png";
  let bgOpacity = 1.0;
  
  if (currentSegment) {
    // 従来の id: 1, 2 の場合のハードコードされた背景設定 (後方互換性)
    if (currentSegment.id === 1 || currentSegment.id === 2) {
      bgSrc = "images/useState/thumb02.png";
      bgOpacity = 1;
    }

    // 継承された background 設定があれば反映する (明示的に null の場合はデフォルトに戻すなどの処理も可能)
    if (currentSegment.background && currentSegment.background !== null) {
      if (currentSegment.background.src) {
        bgSrc = currentSegment.background.src;
      }
      if (currentSegment.background.opacity !== undefined) {
        bgOpacity = currentSegment.background.opacity;
      }
    }
  }

  return (
    <Img 
      src={staticFile(bgSrc)} 
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: bgOpacity
      }}
    />
  );
};
