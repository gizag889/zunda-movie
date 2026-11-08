import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Render02Mockup } from './Render02Mockup';
import { Commit01Mockup } from './Commit01Mockup';
import { ArrowRight } from './ArrowRight';

export const RenderCommitPhaseScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // mediaStartFrameがあればそれを優先し、無ければsegment.startFrameを使う
  const startFrame = (segment?.mediaStartFrame !== undefined ? segment.mediaStartFrame : segment?.startFrame ?? 0) + fps * 5;
  const localFrame = frame - startFrame;

  // id: 10（初回登場時）や id: 15, 24 の登場セグメントのみフェードイン。id: 11 などの引き継ぎセグメントでは最初から完全表示（1）
  const isIntroSegment = segment?.id === 10 || segment?.id === 15 || segment?.id === 24;

  const fadeInOpacity = isIntroSegment
    ? interpolate(localFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

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
