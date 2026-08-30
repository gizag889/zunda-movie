import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig, Sequence } from 'remotion';
import timingData from './timing.json';

import { Segment, TelopData, TimingData } from './types';

const timing = timingData as TimingData;

export const Telop: React.FC = () => {
  const { fps } = useVideoConfig();

  // 新しい配列形式(telops)を優先しつつ、互換性のため古い形式もサポート
  const telops: TelopData[] = timing.telops || (timing.telopText ? [{ text: timing.telopText, startSegmentId: timing.telopStartSegmentId ?? 0 }] : []);

  if (telops.length === 0) {
    return null;
  }

  return (
    <>
      {telops.map((telop: TelopData, index: number) => {
        const startSegment = timing.segments.find((s: Segment) => s.id === telop.startSegmentId);
        const startFrame = startSegment ? startSegment.startFrame + fps * 5 : fps * 5;
        
        // 次のテロップがあればその開始フレームまで、なければ動画の最後まで表示
        const nextTelop = telops[index + 1];
        const nextSegment = nextTelop ? timing.segments.find((s: Segment) => s.id === nextTelop.startSegmentId) : null;
        const endFrame = nextSegment ? nextSegment.startFrame + fps * 5 : timing.totalDurationInFrames;
        
        const duration = endFrame - startFrame;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <FadeInText text={telop.text} />
          </Sequence>
        );
      })}
    </>
  );
};

const FadeInText: React.FC<{ text: string }> = ({ text }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Sequence内の相対フレーム(0スタート)を使って1秒かけてフェードイン
  const opacity = interpolate(
    frame,
    [0, fps],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '10px 30px',
      borderRadius: 20,
      fontSize: 40,
      fontWeight: '900',
      color: '#333',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      zIndex: 10,
      opacity: opacity,
      // border: '5px solid #4CAF50',
      fontFamily: 'sans-serif'
    }}>
      {text}
    </div>
  );
};
