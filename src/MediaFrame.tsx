import React from 'react';
import { Img, staticFile, Video, useCurrentFrame, interpolate } from 'remotion';
import { Segment, MediaElement } from './types';

interface MediaFrameProps {
  segment: Segment;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ segment }) => {
  const frame = useCurrentFrame();

  // id1と2の時、またはmediaが明示的にnullの時は非表示
  if (segment.id === 1 || segment.id === 2 || segment.media === null) {
    return null;
  }

  // mediaが未指定の場合はデフォルト画像を表示
  const mediaElements: MediaElement[] = segment.media || [
    { src: "images/tb01.png" }
  ];

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
      {mediaElements.map((mediaElement: MediaElement, index: number) => {
        const isVideo = mediaElement.src.match(/\.(mp4|webm|mov)$/i);
        
        const animation = mediaElement.animation;
        const fadeInStart = animation?.fadeInStart || 0;
        const fadeInDuration = animation?.fadeInDuration || 0;

        const opacity = fadeInDuration > 0
          ? interpolate(
              frame,
              [fadeInStart, fadeInStart + fadeInDuration],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          : 1;

        const customStyle = mediaElement.style || {};
        const isAbsolute = customStyle.position === 'absolute';

        const contentStyle: React.CSSProperties = {
          width: '100%', 
          height: '100%', 
          ...customStyle
        };

        return (
          <div key={index} style={{
            flex: !isAbsolute ? (customStyle.flex !== undefined ? customStyle.flex : 1) : undefined,
            height: '100%',
            borderRadius: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            opacity,
            ...(isAbsolute ? {
              position: 'absolute' as const,
              top: customStyle.top,
              left: customStyle.left,
              right: customStyle.right,
              bottom: customStyle.bottom,
              width: customStyle.width,
              height: customStyle.height,
              zIndex: customStyle.zIndex
            } : {})
          }}>
            {isVideo ? (
              <Video src={staticFile(mediaElement.src)} style={contentStyle} loop />
            ) : (
              <Img src={staticFile(mediaElement.src)} style={contentStyle} />
            )}
          </div>
        );
      })}
    </div>
  );
};
