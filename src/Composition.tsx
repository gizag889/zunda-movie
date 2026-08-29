import { Composition, Sequence, Audio, AbsoluteFill, useVideoConfig, staticFile, Img, Loop, useCurrentFrame, interpolate } from 'remotion';
import { IntroSequence } from './IntroSequence';
import { LipSyncCharacter } from './LipSyncCharacter';
import { Telop } from './Telop';
import { TextArea } from './TextArea';
import { EndRoll } from './EndRoll';
import timingData from './timing.json';
import React from 'react';

interface Segment {
  id: number;
  character: string;
  text: string;
  audioFile: string;
  startFrame: number;
  durationInFrames: number;
}

const timing = timingData as any;

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
      <Img 
        src={staticFile("images/background.png")} 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6
        }}
      />

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
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
            {/* 画像・動画埋め込み用フレーム (動的レイアウト) */}
            <div style={{
              position: 'absolute',
              top: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1800,
              height: 700,
              display: 'flex',
              gap: 40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 0,
            }}>
              {(segment.media?.layout === 'split' ? segment.media.frames : [segment.media?.frames?.[0] || "images/tb01.png"]).map((frameSrc: string, index: number) => (
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

            {/* キャラクター配置エリア */}
            <div style={{ 
              position: 'absolute',
              left: -120,
              bottom: -430, // テキストの高さに影響されないように絶対位置で固定
              zIndex: 1
            }}>
               <LipSyncCharacter 
                 character="zundamon" 
                 audioFile={segment.character === 'zundamon' ? segment.audioFile : undefined} 
                 expression={segment.character === 'zundamon' ? segment.expression : undefined}
                 
               />
            </div>
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

