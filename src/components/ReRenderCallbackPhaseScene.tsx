import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Render03Mockup } from './Render03Mockup';
import { Commit01Mockup } from './Commit01Mockup';
import { ArrowRight } from './ArrowRight';
import { CleanupAndCallbackMockup } from './CleanupAndCallbackMockup';

export const ReRenderCallbackPhaseScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();

  const fadeInOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
      {/* 1. Renderフェーズ (再レンダリング用) */}
      <Render03Mockup
        style={{ position: 'absolute', top: '150px', left: '0px', width: '600px', height: '600px', borderRadius: 0 }}
        segment={segment}
      />

      {/* 2. Commitフェーズ */}
      <Commit01Mockup
        style={{ position: 'absolute', top: '150px', left: '600px', width: '600px', height: '600px', borderRadius: 0 }}
        segment={segment}
      />

      {/* 矢印 */}
      <ArrowRight
        style={{ position: 'absolute', top: '400px', left: '1200px', width: '80px', height: '100px' }}
      />

      {/* 3. クリーンアップ＆コールバック関数 (フェードイン) */}
      <div style={{ position: 'absolute', top: '150px', left: '1280px', width: '600px', height: '600px', opacity: fadeInOpacity }}>
        <CleanupAndCallbackMockup
          style={{ width: '100%', height: '100%', borderRadius: 0 }}
          segment={segment}
        />
      </div>
    </div>
  );
};
