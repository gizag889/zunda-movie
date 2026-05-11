import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Img, staticFile } from 'remotion';
import React from 'react';

export const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = interpolate(frame, [0, 5, 10, 15, 20], [0, 10, -10, 10, 0], { extrapolateRight: 'clamp' });
  const dropProgress = spring({ frame, fps, config: { damping: 12 }, delay: 30 });
  const yPos = interpolate(dropProgress, [0, 1], [-1000, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', transform: `translate(${shake}px, ${shake}px)` }}>
      <Sequence from={0} durationInFrames={fps * 5}>
        <AbsoluteFill style={{ transform: `translateY(${yPos}px)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Img 
            src={staticFile("images/tb01.png")} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};

