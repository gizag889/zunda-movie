import React from 'react';
import { Img, staticFile, Video, useCurrentFrame, interpolate } from 'remotion';
import { Segment, MediaElement } from './types';
import { Render02Mockup } from './components/Render02Mockup';

const ComponentRegistry: Record<string, React.FC<any>> = {
  "Render02Mockup": Render02Mockup,
};

interface MediaFrameProps {
  segment: Segment;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ segment }) => {
  const frame = useCurrentFrame();

  // mediaが明示的にnullの時は非表示
  if (segment.media === null) {
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
        const isVideo = mediaElement.src?.match(/\.(mp4|webm|mov)$/i);
        
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
        const {
          position, top, left, right, bottom, width, height, zIndex, flex, borderRadius,
          ...innerStyleProps
        } = customStyle as React.CSSProperties;
        const isAbsolute = position === 'absolute';

        const contentStyle: React.CSSProperties = {
          width: '100%', 
          height: '100%', 
          ...innerStyleProps
        };

        return (
          <div key={index} style={{
            flex: !isAbsolute ? (flex !== undefined ? flex : 1) : undefined,
            height: '100%',
            borderRadius: borderRadius !== undefined ? borderRadius : 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
       
            overflow: 'hidden',
            opacity,
            ...(isAbsolute ? {
              position: 'absolute' as const,
              top,
              left,
              right,
              bottom,
              width,
              height,
              zIndex
            } : {})
          }}>
            {mediaElement.component && ComponentRegistry[mediaElement.component] ? (
              (() => {
                const Component = ComponentRegistry[mediaElement.component];
                return <Component style={contentStyle} />;
              })()
            ) : isVideo && mediaElement.src ? (
              <Video src={staticFile(mediaElement.src)} style={contentStyle} loop />
            ) : mediaElement.src ? (
              <Img src={staticFile(mediaElement.src)} style={contentStyle} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
