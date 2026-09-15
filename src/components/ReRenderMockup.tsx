import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import timingData from '../timing.json';

export const ReRenderMockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  const globalFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 対象セグメントからのローカルフレームを計算する
  const mediaStartFrameGlobal = (segment?.mediaStartFrame !== undefined ? segment.mediaStartFrame : (segment?.startFrame || 0)) + fps * 5;
  const localFrame = globalFrame - mediaStartFrameGlobal;

  const segment29 = timingData.segments.find((s: any) => s.id === 29);
  const frame29 = (segment29 ? segment29.startFrame : 0) + fps * 5;

  const segment22 = timingData.segments.find((s: any) => s.id === 22);
  const frame22 = (segment22 ? segment22.startFrame : 0) + fps * 5;

  // テキストのフェードインアニメーション（id:22基準で固定）
  const opacity = interpolate(globalFrame - frame22, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity2 = interpolate(globalFrame - frame29, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const segment30 = timingData.segments.find((s: any) => s.id === 30);
  const frame30 = (segment30 ? segment30.startFrame : 0) + fps * 5;
  
  const opacity3 = interpolate(globalFrame - frame30, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      ...style,
      backgroundColor: '#FFFFFF',
      color: '#333333',
      fontFamily: 'Noto Sans JP',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '16px',
      border: `8px solid ${style?.borderColor || '#FF9800'}` // 再レンダリングとわかるように少し色を変える例
    }}>
      <h2 style={{ fontSize: 80  , lineHeight: 0 }}>Render</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ opacity, fontSize: 60, fontWeight: 'bold' }}>差分判定</div>
        <div style={{ opacity: opacity2, fontSize: 60, fontWeight: 'bold' }}>コンポーネント更新</div>
        <div style={{ opacity: opacity3, fontSize: 60, fontWeight: 'bold' }}>仮想DOM生成</div>

      </div>
    </div>
  );
};
