import { SceneConfig } from './types';
import { mainTitle, subtitle, textAt, centerText, comp, image, video } from './sceneHelpers';

/**
 * セグメントIDごとの演出定義（media / texts / background / expression）
 * - timing.json を音声再生成で上書きしても、このファイルの設定は消えません。
 * - media / texts / background は次の設定や null が指定されるまで後続セグメントに引き継がれます。
 *
 * 記述例:
 *   3: {
 *     texts: null,
 *     media: [video('images/useEffect/mock2.mp4', { scale: 1.1, objectPosition: '50% 30%' })],
 *   },
 *   7: {
 *     media: [comp('RenderPhaseScene', { fadeIn: 15, fadeInStart: 30 })],
 *     texts: [textAt('① Renderフェーズ', 40, 30, { fontSize: 44, fadeIn: 15 })],
 *   },
 */
export const scenes: Record<number, SceneConfig> = {
  // id: 1 「今回は、useEffectを例に、Reactの副作用の裏側について解説します。」
  1: {
    background: { src: null },
    texts: [
      subtitle('React Hooks②'),
      mainTitle('useEffect()'),
    ],
  },
};

