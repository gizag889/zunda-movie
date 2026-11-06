import { Composition, Sequence, Audio, AbsoluteFill, useVideoConfig, staticFile } from 'remotion';
import { IntroSequence } from './IntroSequence';
import { CharacterArea } from './CharacterArea';
import { TextArea } from './TextArea';
import { Background } from './Background';
import { MediaFrame } from './MediaFrame';
import { scenes } from './scenes';
import timingData from './timing.json';
import React from 'react';

import { TimingData, Segment, TextElement } from './types';

const timing = timingData as unknown as TimingData;

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={MainComposition}
        durationInFrames={timing.totalDurationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

const MainComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  const processedSegments = React.useMemo(() => {
    let lastMedia: any = undefined;
    let lastMediaStartFrame: number | undefined = undefined;
    let lastBackground: any = undefined;
    let lastTexts: TextElement[] | null | undefined = undefined;
    let lastTextsStartFrame: number | undefined = undefined;
    return timing.segments.map((rawSegment: Segment) => {
      const sceneOverride = scenes[rawSegment.id];
      const segment: Segment = sceneOverride
        ? { ...rawSegment, ...sceneOverride }
        : rawSegment;

      // mediaが明示的に指定されている場合（nullを含む）は更新する
      if (segment.media !== undefined) {
        lastMedia = segment.media;
        lastMediaStartFrame = segment.startFrame;
      } else if (segment.background !== undefined) {
        // backgroundが切り替わり、mediaが指定されていない場合は古いmediaをクリアする
        lastMedia = undefined;
        lastMediaStartFrame = undefined;
      }
      // backgroundも同様に指定されていれば更新する
      if (segment.background !== undefined) {
        lastBackground = segment.background;
      }
      // textsが明示的に指定されている場合（nullを含む）は更新する
      if (segment.texts !== undefined) {
        if (Array.isArray(segment.texts)) {
          const prevTexts = Array.isArray(lastTexts) ? lastTexts : [];
          lastTexts = segment.texts.map((item: TextElement) => {
            const matchedPrev = prevTexts.find((prev) => {
              if (item.id !== undefined || prev.id !== undefined) {
                return item.id === prev.id;
              }
              const itemTop = item.top ?? item.y ?? item.style?.top;
              const prevTop = prev.top ?? prev.y ?? prev.style?.top;
              const itemLeft = item.left ?? item.x ?? item.style?.left;
              const prevLeft = prev.left ?? prev.x ?? prev.style?.left;
              const itemRight = item.right ?? item.style?.right;
              const prevRight = prev.right ?? prev.style?.right;
              const itemBottom = item.bottom ?? item.style?.bottom;
              const prevBottom = prev.bottom ?? prev.style?.bottom;
              return (
                item.text === prev.text &&
                itemTop === prevTop &&
                itemLeft === prevLeft &&
                itemRight === prevRight &&
                itemBottom === prevBottom
              );
            });
            return {
              ...item,
              startFrame:
                item.startFrame !== undefined
                  ? item.startFrame
                  : matchedPrev?.startFrame !== undefined
                    ? matchedPrev.startFrame
                    : segment.startFrame,
            };
          });
        } else {
          lastTexts = segment.texts;
        }
        lastTextsStartFrame = segment.startFrame;
      }
      return {
        ...segment,
        media: lastMedia,
        mediaStartFrame: lastMediaStartFrame,
        background: lastBackground,
        texts: lastTexts,
        textsStartFrame: lastTextsStartFrame,
      };
    });
  }, [scenes, timing]);

  return (
    <AbsoluteFill
style={{
  backgroundColor: 'black'
}}
 >
      {/* 背景画像 */}
      <Background segments={processedSegments} />

      {/* BGM: loopプロパティで音源の正確な長さに合わせて自動ループ再生 */}
      <Audio src={staticFile("Woozy 1.mp3")} loop volume={0.1} />

      {/* イントロ (最初の5秒) */}
      <Sequence from={0} durationInFrames={fps * 5}>
        <IntroSequence />
      </Sequence>

      {/* グローバルなメディアフレーム */}
      <MediaFrame segments={processedSegments} />
      
      {/* 本編セグメント */}
      {processedSegments.map((segment: any) => (
        <Sequence 
          key={segment.id} 
          from={segment.startFrame + fps * 5} 
          durationInFrames={segment.durationInFrames}
        >
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
            {/* キャラクター配置エリア */}
            <CharacterArea segment={segment} />
            {/* テキストエリア */}
            <TextArea character={segment.character} text={segment.text} />
            <Audio src={staticFile(segment.audioFile)} />
          </AbsoluteFill>
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};
