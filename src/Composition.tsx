import { Composition, Sequence, Audio, AbsoluteFill, useVideoConfig, staticFile, Img } from 'remotion';
import { IntroSequence } from './IntroSequence';
import { LipSyncCharacter } from './LipSyncCharacter';
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
        src={staticFile("background.png")} 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6
        }}
      />

      {/* イントロ (最初の5秒 + 5秒) */}
      <Sequence from={0} durationInFrames={fps * 10}>
        <IntroSequence />
      </Sequence>

      {/* 本編セグメント */}
      {timing.segments.map((segment: any) => (
        <Sequence 
          key={segment.id} 
          from={segment.startFrame + fps * 10} 
          durationInFrames={segment.durationInFrames}
        >
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '100px 0 30px 0', marginBottom: 50 }}>
               <LipSyncCharacter character={segment.character} audioFile={segment.audioFile} />
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              color: 'white', 
              padding: '30px 60px', 
              borderRadius: 30, 
              fontSize: Math.max(30, Math.min(50, 50 * (60 / Math.max(60, segment.text.length)))), 
              maxWidth: '85%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              border: '2px solid #555',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}>
              {segment.text}
            </div>
            <Audio src={staticFile(segment.audioFile)} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* エンドロール・静止画面 (最後の5秒) */}
      <Sequence from={timing.totalDurationInFrames - fps * 5} durationInFrames={fps * 5}>
        <AbsoluteFill style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 80, marginBottom: 20 }}>ご視聴ありがとうございました！</h1>
            <p style={{ fontSize: 40 }}>チャンネル登録 ・ 高評価 ・ スキをお待ちしていますなのだ！</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 固定クレジット表記 */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        color: 'white',
        fontSize: 24,
        fontFamily: 'sans-serif',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        VOICEVOX:ずんだもん
      </div>
    </AbsoluteFill>
  );
};

