import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import timingData from './timing.json';
import { TimingData } from './types';

const timing = timingData as TimingData;

export const Background: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // 現在のセグメントを特定 (イントロの5秒分シフトしていることを考慮)
  const currentSegment = timing.segments.find(
    (s: any) => frame >= s.startFrame + fps * 5 && frame < s.startFrame + fps * 5 + s.durationInFrames
  );

  // デフォルトの設定
  let bgSrc = "images/background.png";
  let bgOpacity = 0.6;
  
  // id が 1 または 2 の場合は背景を変更し、opacityをリセット
  if (currentSegment && (currentSegment.id === 1 || currentSegment.id === 2)) {
    bgSrc = "images/thumb02.png"; // ※設定したい画像ファイル名に変更してください
    bgOpacity = 1;
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
