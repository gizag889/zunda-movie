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
        src={staticFile("images/background.png")} 
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
          <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
            {/* キャラクター配置エリア */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '100%', 
              padding: '0 10px',

              marginBottom: -250, // 字幕に近づけるための調整
              zIndex: 1
            }}>
               <LipSyncCharacter 
                 character="zundamon" 
                 audioFile={segment.character === 'zundamon' ? segment.audioFile : undefined} 
                 style={{ 
                   opacity: segment.character === 'zundamon' ? 1 : 0.6,
                   marginLeft: -50,
                   //拡大するにはここをいじる
                   transform: 'scale(1.3)' 
                 }}
               />
               <LipSyncCharacter 
                 character="metan" 
                 audioFile={segment.character === 'metan' ? segment.audioFile : undefined} 
                 style={{ 
                   opacity: segment.character === 'metan' ? 1 : 0.6,
                   marginRight: -50,
                   transform: 'scale(1.2)' 
                 }}
               />
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
              wordBreak: 'break-word',
              zIndex: 2
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

