import React from 'react';
import { Img, staticFile, Video, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Segment, MediaElement } from './types';
import { Render02Mockup } from './components/Render02Mockup';
import { Commit01Mockup } from './components/Commit01Mockup';
import { ArrowRight } from './components/ArrowRight';
import { HighlightBorder } from './components/HighlightBorder';
import { ReRenderMockup } from './components/ReRenderMockup';
import { DiffCheckMockup } from './components/DiffCheckMockup';
import { TextDisplay } from './components/TextDisplay';

const ComponentRegistry: Record<string, React.FC<any>> = {
  "Render02Mockup": Render02Mockup,
  "Commit01Mockup": Commit01Mockup,
  "ArrowRight": ArrowRight,
  "HighlightBorder": HighlightBorder,
  "ReRenderMockup": ReRenderMockup,
  "DiffCheckMockup": DiffCheckMockup,
  "TextDisplay": TextDisplay,
};

interface MediaFrameProps {
  segments: Segment[];
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ segments }) => {
  const { fps } = useVideoConfig();
  const globalFrame = useCurrentFrame();

  const currentSegment = segments.find(
    (s: any) => globalFrame >= s.startFrame + fps * 5 && globalFrame < s.startFrame + fps * 5 + s.durationInFrames
  );

  if (!currentSegment || currentSegment.media === null) {
    return null;
  }

  const mediaElements: MediaElement[] = currentSegment.media || [
    { src: "images/tb01.png" }
  ];

  const mediaStartFrameGlobal = (currentSegment.mediaStartFrame !== undefined ? currentSegment.mediaStartFrame : currentSegment.startFrame) + fps * 5;
  const frame = globalFrame - mediaStartFrameGlobal;

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
        
        const slideDownStart = animation?.slideDownStart || 0;
        const slideDownDuration = animation?.slideDownDuration || 0;
        const slideDownDistance = animation?.slideDownDistance || 500;

        const opacity = fadeInDuration > 0
          ? interpolate(
              frame,
              [fadeInStart, fadeInStart + fadeInDuration],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          : 1;

        const translateY = slideDownDuration > 0
          ? interpolate(
              frame,
              [slideDownStart, slideDownStart + slideDownDuration],
              [0, slideDownDistance],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          : 0;

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
            flex: !isAbsolute ? (flex !== undefined ? flex : (width !== undefined ? undefined : 1)) : undefined,
            width,
            height: height !== undefined ? height : '100%',
            borderRadius: borderRadius !== undefined ? borderRadius : 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
       
            overflow: 'hidden',
            opacity,
            transform: `translateY(${translateY}px)`,
            ...(isAbsolute ? {
              position: 'absolute' as const,
              top,
              left,
              right,
              bottom,
              zIndex
            } : {})
          }}>
            {mediaElement.component && ComponentRegistry[mediaElement.component] ? (
              (() => {
                const Component = ComponentRegistry[mediaElement.component];
                return <Component style={contentStyle} segment={currentSegment} mediaElement={mediaElement} />;
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
