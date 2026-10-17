import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import timingData from '../timing.json';

// ===== スライドの内容 =====
const TITLE = '今回のポイント';

type SummaryItem = {
  text: string;
  // このIDのセグメント開始時に表示する（省略時は最初から表示）
  segmentId?: number;
};

const ITEMS: SummaryItem[] = [
  { text: 'Renderフェーズでコールバック関数を登録', segmentId: 40 },
  { text: '再レンダリング時は依存配列の差分で登録の可否を判断', segmentId: 41 },
  { text: 'callback関数実行はCommitフェーズ完了・画面更新の後', segmentId: 42 },
  { text: 'クリーンアップ関数は次回Effect直前・アンマウント時に実行', segmentId: 43 },
];

// 各項目のフェードインにかけるフレーム数
const FADE_IN_FRAMES = 15;

/**
 * まとめスライド
 * 白背景のスライド上部にタイトルを表示し、その下に箇条書きを
 * 対応するセグメントの開始タイミングで順番にフェードイン表示する
 */
export const SummaryScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style }) => {
  // MediaFrame は Sequence 外のため、useCurrentFrame() はグローバルフレームを返す
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 項目ごとの表示進捗 (0 → 1)
  const getProgress = (item: SummaryItem) => {
    if (item.segmentId === undefined) return 1;
    const target = timingData.segments.find((s: any) => s.id === item.segmentId);
    if (!target) return 1;
    const startGlobal = target.startFrame + fps * 5; // イントロ5秒分を加算
    return interpolate(frame - startGlobal, [0, FADE_IN_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  return (
    <div style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
      {/* スライド本体 */}
      <div style={{
        position: 'absolute',
        top: '0px',
        left: '240px',
        width: '1400px',
        height: '700px',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Noto Sans JP',
        padding: '0px 60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* タイトル */}
        <div style={{
          fontSize: 80,
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}>
          {TITLE}
        </div>

        {/* 箇条書き */}
        <div style={{
          width: '100%',
          marginTop: 30,
          padding: '0 20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}>
          {ITEMS.map((item, index) => {
            const progress = getProgress(item);
            return (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                opacity: progress,
                transform: `translateX(${(1 - progress) * -30}px)`,
              }}>
                <span style={{
                  flexShrink: 0,
                  width: 15,
                  height: 15,
                  marginTop: 30,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                }} />
                <span style={{ fontSize: 55, fontWeight: 'bold', lineHeight: 1.4, color: '#333' }}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
