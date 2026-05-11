import { Composition, Sequence, Audio, AbsoluteFill, useVideoConfig, staticFile, Img, Loop } from 'remotion';
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

      {/* BGM: リピートさせるためにLoopコンポーネントを使用 */}
      {/* durationInFramesには音源の正確なフレーム数（秒数 × fps）を指定してください。以下は仮で120秒(2分)としています */}
      <Loop durationInFrames={fps * 215}>
        <Audio src={staticFile("Woozy 1.mp3")} volume={0.005} />
      </Loop>

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
            {/* 画像・動画埋め込み用フレーム */}
            <div style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1024,
              height: 576,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              // border: '6px dashed rgba(255, 255, 255, 0.6)',
              borderRadius: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 0,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              <Img 
                src={staticFile("images/Frame 1.png")} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>

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
                 expression={segment.character === 'zundamon' ? segment.expression : undefined}
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
                 expression={segment.character === 'metan' ? segment.expression : undefined}
                 style={{ 
                   opacity: segment.character === 'metan' ? 1 : 0.6,
                   marginRight: -50,
                   transform: 'scale(1.2)' 
                 }}
               />
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              color: '#333', 
              padding: '30px 60px', 
              borderRadius: 30, 
              fontSize: Math.max(30, Math.min(50, 50 * (60 / Math.max(60, segment.text.length)))), 
              fontWeight: 'bold',
              maxWidth: '85%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: `8px solid ${segment.character === 'zundamon' ? '#4CAF50' : segment.character === 'metan' ? '#FF69B4' : '#555'}`,
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
            {/* <p style={{ fontSize: 40 }}>チャンネル登録お願いします！</p> */}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 左上固定ロゴ */}
      <Img 
        src={staticFile("images/logo.png")} 
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          maxWidth: 350,  // 中央の枠（X:448から開始）に被らないように制限
          maxHeight: 150,
          objectFit: 'contain',
          zIndex: 10
        }}
      />
    </AbsoluteFill>
  );
};

