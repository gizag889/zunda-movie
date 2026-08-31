import { Composition, Sequence, Audio, AbsoluteFill, useVideoConfig, staticFile, Img, Loop, useCurrentFrame, interpolate } from 'remotion';
import { IntroSequence } from './IntroSequence';
import { CharacterArea } from './CharacterArea';
import { Telop } from './Telop';
import { TextArea } from './TextArea';
import { EndRoll } from './EndRoll';
import { Background } from './Background';
import { MediaFrame } from './MediaFrame';
import timingData from './timing.json';
import React from 'react';

import { TimingData, Segment } from './types';

const timing = timingData as TimingData;

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

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 背景画像 */}
      <Background />

      {/* BGM: リピートさせるためにLoopコンポーネントを使用 */}
      {/* durationInFramesには音源の正確なフレーム数（秒数 × fps）を指定してください。以下は仮で120秒(2分)としています */}
      <Loop durationInFrames={fps * 215}>
        <Audio src={staticFile("Woozy 1.mp3")} volume={0.005} />
      </Loop>

      {/* イントロ (最初の5秒) */}
      <Sequence from={0} durationInFrames={fps * 5}>
        <IntroSequence />
      </Sequence>

      {/* 本編セグメント */}
      {timing.segments.map((segment: any) => (
        <Sequence 
          key={segment.id} 
          from={segment.startFrame + fps * 5} 
          durationInFrames={segment.durationInFrames}
        >
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
            {/* 画像・動画埋め込み用フレーム (動的レイアウト) */}
            <MediaFrame segment={segment} />

            {/* キャラクター配置エリア */}
            <CharacterArea segment={segment} />
            {/* テキストエリア */}
            <TextArea character={segment.character} text={segment.text} />
            <Audio src={staticFile(segment.audioFile)} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* テロップ (左上最上部) */}
      <Telop />

      {/* エンドロール・静止画面 (最後の5秒) */}
      <Sequence from={timing.totalDurationInFrames - fps * 5} durationInFrames={fps * 5}>
        <EndRoll />
      </Sequence>
    </AbsoluteFill>
  );
};

