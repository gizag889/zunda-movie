import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import timingData from './timing.json';

const timing = timingData as any;

export const Telop: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  if (!timing.telopText) {
    return null;
  }

  const telopStartSegment = timing.segments.find((s: any) => s.id === timing.telopStartSegmentId);
  const telopStartFrame = telopStartSegment ? telopStartSegment.startFrame + fps * 5 : fps * 5;
  const telopOpacity = interpolate(
    frame,
    [telopStartFrame, telopStartFrame + fps],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div style={{
      position: 'absolute',
      top: 40,
      left: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px 40px',
      borderRadius: 20,
      fontSize: 45,
      fontWeight: '900',
      color: '#333',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      zIndex: 10,
      opacity: telopOpacity,
      border: '5px solid #4CAF50',
      fontFamily: 'sans-serif'
    }}>
      {timing.telopText}
    </div>
  );
};
