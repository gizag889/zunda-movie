import React from 'react';
import { Img, staticFile, Video, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Segment, MediaElement, TextElement, ElementAnimation } from './types';
import { Render01Mockup } from './components/Render01Mockup';
import { Render02Mockup } from './components/Render02Mockup';
import { Commit01Mockup } from './components/Commit01Mockup';
import { ArrowRight } from './components/ArrowRight';
import { HighlightBorder } from './components/HighlightBorder';
import { ReRenderMockup } from './components/ReRenderMockup';
import { DiffCheckMockup } from './components/DiffCheckMockup';
import { TextDisplay } from './components/TextDisplay';
import { CallbackMockup } from './components/CallbackMockup';
import { CallbackPhaseScene } from './components/CallbackPhaseScene';
import { RenderPhaseScene } from './components/RenderPhaseScene';
import { RenderCommitPhaseScene } from './components/RenderCommitPhaseScene';
import { Render03Mockup } from './components/Render03Mockup';
import { ReRenderPhaseScene } from './components/ReRenderPhaseScene';
import { CleanupAndCallbackMockup } from './components/CleanupAndCallbackMockup';
import { ReRenderCallbackPhaseScene } from './components/ReRenderCallbackPhaseScene';
import { SummaryScene } from './components/SummaryScene';

const ComponentRegistry: Record<string, React.FC<any>> = {
  "Render01Mockup": Render01Mockup,
  "Render02Mockup": Render02Mockup,
  "Commit01Mockup": Commit01Mockup,
  "ArrowRight": ArrowRight,
  "HighlightBorder": HighlightBorder,
  "ReRenderMockup": ReRenderMockup,
  "DiffCheckMockup": DiffCheckMockup,
  "TextDisplay": TextDisplay,
  "CallbackMockup": CallbackMockup,
  "CallbackPhaseScene": CallbackPhaseScene,
  "RenderPhaseScene": RenderPhaseScene,
  "RenderCommitPhaseScene": RenderCommitPhaseScene,
  "Render03Mockup": Render03Mockup,
  "ReRenderPhaseScene": ReRenderPhaseScene,
  "CleanupAndCallbackMockup": CleanupAndCallbackMockup,
  "ReRenderCallbackPhaseScene": ReRenderCallbackPhaseScene,
  "SummaryScene": SummaryScene,
};

interface MediaFrameProps {
  segments: Segment[];
}

const computeAnimation = (animation: ElementAnimation | undefined, frame: number) => {
  const fadeInStart = animation?.fadeInStart ?? 0;
  const fadeInDuration = animation?.fadeInDuration ?? 0;
  const fadeOutStart = animation?.fadeOutStart;
  const fadeOutDuration = animation?.fadeOutDuration ?? 0;

  const slideDownStart = animation?.slideDownStart ?? 0;
  const slideDownDuration = animation?.slideDownDuration ?? 0;
  const slideDownDistance = animation?.slideDownDistance ?? 500;

  const slideInStart = animation?.slideInStart ?? 0;
  const slideInDuration = animation?.slideInDuration ?? 0;
  const slideInX = animation?.slideInX ?? 0;
  const slideInY = animation?.slideInY ?? 0;

  let opacity = fadeInDuration > 0
    ? interpolate(
        frame,
        [fadeInStart, fadeInStart + fadeInDuration],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  if (fadeOutStart !== undefined && fadeOutDuration > 0) {
    const fadeOutFactor = interpolate(
      frame,
      [fadeOutStart, fadeOutStart + fadeOutDuration],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    opacity *= fadeOutFactor;
  }

  const slideDownY = slideDownDuration > 0
    ? interpolate(
        frame,
        [slideDownStart, slideDownStart + slideDownDuration],
        [0, slideDownDistance],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const inX = slideInDuration > 0 && slideInX !== 0
    ? interpolate(
        frame,
        [slideInStart, slideInStart + slideInDuration],
        [slideInX, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const inY = slideInDuration > 0 && slideInY !== 0
    ? interpolate(
        frame,
        [slideInStart, slideInStart + slideInDuration],
        [slideInY, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  return {
    opacity,
    translateX: inX,
    translateY: slideDownY + inY,
  };
};

export const MediaFrame: React.FC<MediaFrameProps> = ({ segments }) => {
  const { fps } = useVideoConfig();
  const globalFrame = useCurrentFrame();

  const currentSegment = segments.find(
    (s: Segment) => globalFrame >= s.startFrame + fps * 5 && globalFrame < s.startFrame + fps * 5 + s.durationInFrames
  );

  if (!currentSegment) {
    return null;
  }

  const mediaElements: MediaElement[] = Array.isArray(currentSegment.media) ? currentSegment.media : [];
  const textElements: TextElement[] = Array.isArray(currentSegment.texts) ? currentSegment.texts : [];

  if (mediaElements.length === 0 && textElements.length === 0) {
    return null;
  }

  const mediaStartFrameGlobal = (currentSegment.mediaStartFrame !== undefined ? currentSegment.mediaStartFrame : currentSegment.startFrame) + fps * 5;
  const mediaFrame = globalFrame - mediaStartFrameGlobal;

  return (
    <>
      {mediaElements.length > 0 && (
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
            const { opacity, translateX, translateY } = computeAnimation(mediaElement.animation, mediaFrame);

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
                transform: translateX !== 0 ? `translate(${translateX}px, ${translateY}px)` : `translateY(${translateY}px)`,
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
      )}

      {textElements.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          {textElements.map((textElement: TextElement, index: number) => {
            const itemStartFrame =
              textElement.startFrame ??
              currentSegment.textsStartFrame ??
              currentSegment.startFrame;
            const textFrame = globalFrame - (itemStartFrame + fps * 5);
            const { opacity, translateX, translateY } = computeAnimation(textElement.animation, textFrame);

            const customStyle = textElement.style || {};
            const {
              position: _position,
              top: styleTop,
              left: styleLeft,
              right: styleRight,
              bottom: styleBottom,
              zIndex: styleZIndex,
              transform: styleTransform,
              ...restStyle
            } = customStyle;

            const resolvedTop = textElement.top ?? textElement.y ?? styleTop;
            const resolvedLeft = textElement.left ?? textElement.x ?? styleLeft;
            const resolvedRight = textElement.right ?? styleRight;
            const resolvedBottom = textElement.bottom ?? styleBottom;
            const resolvedZIndex = styleZIndex ?? 1;

            const animTransform = (translateX !== 0 || translateY !== 0)
              ? `translate(${translateX}px, ${translateY}px)`
              : undefined;
            const combinedTransform = [styleTransform, animTransform].filter(Boolean).join(' ') || undefined;

            return (
              <div
                key={textElement.id ?? index}
                style={{
                  position: 'absolute',
                  top: resolvedTop,
                  left: resolvedLeft,
                  right: resolvedRight,
                  bottom: resolvedBottom,
                  zIndex: resolvedZIndex,
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#333333',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif',
                  ...restStyle,
                  opacity: restStyle.opacity !== undefined ? Number(restStyle.opacity) * opacity : opacity,
                  transform: combinedTransform,
                }}
              >
                {textElement.text}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
