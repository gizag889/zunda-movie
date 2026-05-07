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
        <div style={{ transform: `translateY(${yPos}px)`, width: '100%', height: '100%' }}>
          <Img src={staticFile("images/zunda/zundamon.png")} style={{ position: 'absolute', left: '50%', marginLeft: -300, bottom: 0, width: 600 }} />
          <h1 style={{ color: 'white', textAlign: 'center', marginTop: 300, fontSize: 80, fontFamily: 'sans-serif', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
            PROJECT AG-YUKKURI
          </h1>
        </div>
      </Sequence>
      <Sequence from={fps * 5} durationInFrames={fps * 5}>
        <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001100' }}>
          <div style={{ color: '#00ff00', fontFamily: 'monospace', fontSize: 24, whiteSpace: 'pre-wrap' }}>
            {`> Reconstructing System...\n> Agent Antigravity Online.\n> VOICEVOX Engine Synced.`}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

