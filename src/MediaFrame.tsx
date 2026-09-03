import React from 'react';
import { Img, staticFile, Video } from 'remotion';
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
      {frames.map((frameSrc: string, index: number) => {
        const isVideo = frameSrc.match(/\.(mp4|webm|mov)$/i);
        const style = {
          width: '100%', 
          height: '100%', 
          ...(segment.media?.frameStyles?.[index] || {})
        };

        return (
          <div key={index} style={{
            flex: segment.media?.layout === 'split' && segment.media?.splitRatio ? segment.media.splitRatio[index] : 1,
            height: '100%',
            borderRadius: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {isVideo ? (
              <Video src={staticFile(frameSrc)} style={style} loop />
            ) : (
              <Img src={staticFile(frameSrc)} style={style} />
            )}
          </div>
        );
      })}
    </div>
  );
};
