import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import timingData from '../timing.json';

// クリーンアップ関数のテロップを表示し始めるセグメントID
const CLEANUP_SEGMENT_ID = 29;

export const CleanupAndCallbackMockup: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  // MediaFrame は Sequence 外のため、useCurrentFrame() はグローバルフレームを返す
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // id:29 のセグメント開始時点（グローバルフレーム = startFrame + イントロ5秒）でクリーンアップ関数を表示
  const cleanupSegment = timingData.segments.find((s: any) => s.id === CLEANUP_SEGMENT_ID);
  const cleanupStartGlobal = (cleanupSegment ? cleanupSegment.startFrame : 0) + fps * 5;

  const cleanupOpacity = interpolate(frame - cleanupStartGlobal, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // その後、コールバック関数がフェードイン
  const callbackOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      ...style,
      backgroundColor: '#FFFFFF',
      fontFamily: 'Noto Sans JP',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '16px',
      border: '8px solid #4CAF50'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', marginTop: '30px', alignItems: 'center' }}>
        
        {/* クリーンアップ */}
        <div style={{ opacity: cleanupOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#E91E63' }}>
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>Cleanup関数実行</div>
        </div>

        {/* 下向き矢印 (id:29 のタイミングでクリーンアップと同時に表示) */}
        <div style={{ opacity: cleanupOpacity, fontSize: 60, color: '#666' }}>⬇</div>
        
        {/* コールバック */}
        <div style={{ opacity: callbackOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4CAF50' }}>
          <div style={{ fontSize: 60, fontWeight: 'bold' }}>Callback関数実行</div>
        </div>
      </div>
    </div>
  );
};
