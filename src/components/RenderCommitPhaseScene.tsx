import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Render02Mockup } from './Render02Mockup';
import { Commit01Mockup } from './Commit01Mockup';
import { ArrowRight } from './ArrowRight';

export const RenderCommitPhaseScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();

  const fadeInOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
      <Render02Mockup
        style={{ position: 'absolute', top: '150px', left: '300px', width: '600px', height: '600px', borderRadius: 0 }}
        segment={segment}
      />
      <ArrowRight
        style={{ position: 'absolute', top: '400px', left: '910px', width: '80px', height: '100px', opacity: fadeInOpacity }}
      />
      <Commit01Mockup
        style={{ position: 'absolute', top: '150px', left: '1000px', width: '600px', height: '600px', borderRadius: 0, opacity: fadeInOpacity }}
        segment={segment}
      />
    </div>
  );
};
