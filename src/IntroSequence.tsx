import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Img, staticFile } from 'remotion';
import React from 'react';

export const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();


  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Sequence from={0} durationInFrames={fps * 5}>
        <AbsoluteFill style={{ opacity, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Img 
            src={staticFile("images/useState/thumb.png")} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};

