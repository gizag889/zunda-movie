import React from 'react';
import { Img, staticFile } from 'remotion';
import { Segment } from './types';

interface MediaFrameProps {
  segment: Segment;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ segment }) => {
  // id1と2の時は一時的に非表示
  if (segment.id === 1 || segment.id === 2) {
    return null;
  }

  const frames = segment.media?.layout === 'split' 
    ? (segment.media.frames || [])
    : [segment.media?.frames?.[0] || "images/tb01.png"];

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: 20,
      width: '100%',
      height: '100%',
      display: 'flex',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 0,
    }}>
      {frames.map((frameSrc: string, index: number) => (
        <div key={index} style={{
          flex: segment.media?.layout === 'split' && segment.media?.splitRatio ? segment.media.splitRatio[index] : 1,
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <Img 
            src={staticFile(frameSrc)} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
      ))}
    </div>
  );
};
