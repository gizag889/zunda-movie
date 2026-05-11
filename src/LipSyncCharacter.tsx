import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { useAudioData, getWaveformPortion } from '@remotion/media-utils';

interface LipSyncCharacterProps {
  character: string;
  audioFile?: string;
  expression?: string;
  style?: React.CSSProperties;
}

export const LipSyncCharacter: React.FC<LipSyncCharacterProps> = ({ character, audioFile, expression, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 1. useAudioData で音声ファイルをデコード
  // audioFile が提供されている場合のみデータを取得（フックのルールに従い、パス自体は常に文字列にする）
  const audioData = useAudioData(staticFile(audioFile || "voices/voice_1.wav"));
  const isSpeaking = !!audioFile;
  
  // 現在のフレームの秒数を計算
  const currentTimeInSeconds = frame / fps;
  
  // --- まばたきの判定ロジック ---
  // 約150フレーム（約5秒）の周期を設定
  const blinkPeriod = 150;
  const periodIndex = Math.floor(frame / blinkPeriod);
  
  // シード値の計算（セグメントごとに同じタイミングにならないよう、audioFile を活用）
  const seedBase = String(periodIndex) + (audioFile || character);
  
  // 周期의 インデックスと固有文字列をシードにしてランダムな値を生成
  const randomValue = random(seedBase);
  
  // まばたきの長さ（3〜5フレーム）
  const blinkDuration = Math.floor(random(seedBase + "duration") * 3) + 3;
  
  // 周期内でのまばたき開始フレームを決定（周期の境界をまたがないように）
  const blinkStartInPeriod = Math.floor(randomValue * (blinkPeriod - blinkDuration));
  const currentBlinkStart = periodIndex * blinkPeriod + blinkStartInPeriod;
  
  // 現在のフレームがまばたき中かどうか
  const isBlinking = frame >= currentBlinkStart && frame < currentBlinkStart + blinkDuration;
  // -----------------------------------

  // デフォルト画像（口閉じ）と開口画像の設定
  // ユーザーの指示に合わせてずんだもんの画像をマッピング、それ以外も一応設定
  const isZundamon = character.toLowerCase() === 'zundamon';
  const folder = isZundamon ? 'zunda' : 'metan';
  let closedImg = isZundamon ? `images/${folder}/zundamon.png` : `images/${folder}/${character}.png`;
  let openImg = isZundamon ? `images/${folder}/zunda_mouse_open.png` : `images/${folder}/${character}_mouse_open.png`;
  let closedEyeImg = isZundamon ? `images/${folder}/zunda_eyes_closed.png` : `images/${folder}/${character}_eyes_closed.png`;

  // サポートされていない表情が指定された場合のフォールバック処理
  let safeExpression = expression;
  if (isZundamon) {
    const validZundaEx = ['angry', 'anxiety', 'happy', 'thinking'];
    if (expression === 'surprised' || expression === 'sad') {
      safeExpression = 'anxiety'; // 驚きや悲しみは「焦り(anxiety)」で代用
    } else if (expression && !validZundaEx.includes(expression)) {
      safeExpression = 'normal';
    }
  } else {
    // metan は現在 thinking のみ
    if (expression && expression !== 'thinking') {
      safeExpression = 'normal';
    }
  }

  // 表情が指定されている場合（normal以外）は表情専用の画像をすべての状態に適用する
  // ※表情差分は口パクやまばたきの差分がないため、固定の画像を使用します
  if (safeExpression && safeExpression !== 'normal') {
    const exprImg = isZundamon ? `images/${folder}/zunda_ex_${safeExpression}.png` : `images/${folder}/${character}_ex_${safeExpression}.png`;
    closedImg = exprImg;
    openImg = exprImg;
    closedEyeImg = exprImg;
  }
  
  // オーディオデータが無い、または発話中でない場合は静止画像を表示（まばたきは継続）
  if (!audioData || !isSpeaking) {
    let currentImgSrc = closedImg;
    if (isBlinking) {
      currentImgSrc = closedEyeImg;
    }

    return (
      <Img 
        src={staticFile(currentImgSrc)} 
        style={{ 
          width: 500, 
          opacity: 1,
          transform: 'scale(1.1)',
          transition: 'all 0.1s ease',
          ...style
        }} 
      />
    );
  }


  
  // 現在のフレーム周辺（約1.5フレーム分）の音量を取得してちらつきを抑える
  const waveform = getWaveformPortion({
    audioData,
    startTimeInSeconds: currentTimeInSeconds,
    durationInSeconds: 0.05, 
    numberOfSamples: 1,
  });
  
  // 振幅（0〜1）を取得
  const volume = waveform[0]?.amplitude || 0;
  
  // 2. 音量が一定以上（喋っている状態）の時に口をパクパクさせるアニメーションを実装
  // VOICEVOXの音声波形は持続的であるため、音量だけで判定すると口が開きっぱなしになりがちです。
  // そのため、喋っている間は一定のフレーム間隔で強制的に口を開閉させます。
  const isLoudEnough = volume > 0.05; // 喋っているかどうかのしきい値
  
  // 12フレーム周期（6フレーム開、6フレーム閉）でパクパクさせる
  const flapCycle = 12; 
  const isMouthOpenInCycle = (frame % flapCycle) < (flapCycle / 2);
  
  // 3. 喋っていて、かつサイクル的に「開」のタイミングなら口を開く
  const stage = (isLoudEnough && isMouthOpenInCycle) ? 1 : 0;
  
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
        ...style
      }} 
    />
  );
};
