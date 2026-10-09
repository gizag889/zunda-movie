import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Render02Mockup } from './Render02Mockup';
import { Commit01Mockup } from './Commit01Mockup';
import { ArrowRight } from './ArrowRight';
import { CallbackMockup } from './CallbackMockup';

export const CallbackPhaseScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();

  // timing.jsonのanimationプロパティで指定していたアニメーションも、
  // コンポーネント側で自由に制御できます！
  const fadeInOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
      {/* 1. Renderフェーズ */}
      <Render02Mockup
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

      {/* 3. コールバック関数 (フェードイン) */}
      <div style={{ position: 'absolute', top: '150px', left: '1280px', width: '600px', height: '600px', opacity: fadeInOpacity }}>
        <CallbackMockup
          style={{ width: '100%', height: '100%', borderRadius: 0 }}
          segment={segment}
        />
      </div>
    </div>
  );
};
