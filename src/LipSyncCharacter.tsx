import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { useAudioData, getWaveformPortion } from '@remotion/media-utils';

interface LipSyncCharacterProps {
  character: string;
  audioFile: string;
}

export const LipSyncCharacter: React.FC<LipSyncCharacterProps> = ({ character, audioFile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 1. useAudioData で音声ファイルをデコード
  const audioData = useAudioData(staticFile(audioFile));
  
  // デフォルト画像（口閉じ）と開口画像の設定
  // ユーザーの指示に合わせてずんだもんの画像をマッピング、それ以外も一応設定
  const isZundamon = character.toLowerCase() === 'zundamon';
  const closedImg = isZundamon ? 'zundamon.png' : `${character}.png`;
  const openImg = isZundamon ? 'zunda_mouse_open.png' : `${character}_mouse_open.png`;
  const closedEyeImg = isZundamon ? 'zunda_eyes_closed.png' : `${character}_eyes_closed.png`;
  
  // オーディオデータがまだロードされていない場合は閉じた口の画像を表示
  if (!audioData) {
    return (
      <Img 
        src={staticFile(closedImg)} 
        style={{ 
          width: 500, 
          opacity: 1,
          transform: 'scale(1.1)',
          transition: 'all 0.1s ease'
        }} 
      />
    );
  }

  // 現在のフレームの秒数を計算
  const currentTimeInSeconds = frame / fps;
  
  // --- まばたきの判定ロジック ---
  // 約150フレーム（約5秒）の周期を設定
  const blinkPeriod = 150;
  const periodIndex = Math.floor(frame / blinkPeriod);
  
  // シード値の計算（セグメントごとに同じタイミングにならないよう、audioFile を活用）
  const seedBase = String(periodIndex) + audioFile;
  
  // 周期のインデックスと固有文字列をシードにしてランダムな値を生成
  const randomValue = random(seedBase);
  
  // まばたきの長さ（3〜5フレーム）
  const blinkDuration = Math.floor(random(seedBase + "duration") * 3) + 3;
  
  // 周期内でのまばたき開始フレームを決定（周期の境界をまたがないように）
  const blinkStartInPeriod = Math.floor(randomValue * (blinkPeriod - blinkDuration));
  const currentBlinkStart = periodIndex * blinkPeriod + blinkStartInPeriod;
  
  // 現在のフレームがまばたき中かどうか
  const isBlinking = frame >= currentBlinkStart && frame < currentBlinkStart + blinkDuration;
  // -----------------------------------
  
  // 現在のフレーム周辺（約1.5フレーム分）の音量を取得してちらつきを抑える
  const waveform = getWaveformPortion({
    audioData,
    startTimeInSeconds: currentTimeInSeconds,
    durationInSeconds: 0.05, 
    numberOfSamples: 1,
  });
  
  // 振幅（0〜1）を取得
  const volume = waveform[0]?.amplitude || 0;
  
  // 2. interpolate 関数を使って、音量を「口の開き具合（3段階）」に変換
  // VOICEVOXはダイナミックレンジが広いため、しきい値を設定
  const openLevel = interpolate(volume, [0, 0.05, 0.15], [0, 1, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // 3. その値に応じて、「口を閉じた画像」と「口を開いた画像」を出し分ける
  // stage が 0 なら閉じる、1以上なら開く（もし将来的に中間画像が追加されたら stage === 1 で分岐可能）
  const stage = Math.round(openLevel);
  
  // まばたきを優先する。口開け中の閉じ目画像がないため、まばたき中は一時的に口が閉じますが、
  // 3〜5フレームの一瞬なので違和感は少ないです。
  let currentImgSrc = closedImg;
  if (isBlinking) {
    currentImgSrc = closedEyeImg;
  } else if (stage > 0) {
    currentImgSrc = openImg;
  }

  return (
    <Img 
      src={staticFile(currentImgSrc)} 
      style={{ 
        width: 500, 
        opacity: 1,
        transform: 'scale(1.1)',
        // 音声に合わせた切り替えのため、画像のフェード等のtransitionは短くするか消す
        // 口のパクパクが自然に見えるよう transition を最適化
      }} 
    />
  );
};
