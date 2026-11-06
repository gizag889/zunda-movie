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
 *     media: [video('images/useEffect/mock2.mp4', { scale: 1.1, objectPosition: '0% 50%' })],
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

  // id: 2 「こちらは、画面をスクロールして作品カードが視界に入ると、ふわっと表示されるギャラリーのコンポーネントです。」
  2: {
    texts: null,
    media: [
      video('images/useEffect/mock.mp4'),
      image('images/useEffect/carbon.png'),
    ],
  },

  // id: 5 「Reactのレンダリングプロセスの流れをざっとおさらいします。」
  5: {
    texts: [
      centerText('React : CSR', { top: 70, fontSize: 90 }),
    ],
  },

  // id: 7 「1つ目は「Renderフェーズ」。これはページを構成する設計図を作るフェーズです。」
  7: {
    media: [comp('RenderPhaseScene', { fadeInStart: 30, fadeIn: 15 })],
  },

  // id: 10 「次に「Commitフェーズ」に移ります。ここでは出来上がった設計図をもとに、実際のDOMを画面に描画する作業を担います。」
  10: {
    media: [comp('RenderCommitPhaseScene')],
  },

  // id: 12 「まずは「初回レンダリング」、つまり画面を初めて開く際の動きから見ていきましょう。」
  12: {
    texts: null,
    background: { src: 'images/useEffect/firstrender.png' },
    media: [image('images/useEffect/first.png', { top: 120, width: '1400px', height: 'auto' })],
  },

  // id: 13 「初回レンダリング時のRenderフェーズでは、仮想DOMの生成とともに、あとで実行するコールバック関数の登録を行います。」
  13: {
    media: [
      comp('Render02Mockup', {
        top: '150px',
        left: '300px',
        width: '600px',
        height: '600px',
        borderRadius: 0,
        fadeInStart: 30,
        fadeIn: 15,
      }),
    ],
  },

  // id: 15 「続いてCommitフェーズです。新しい画面をユーザーに表示し終わると、」
  15: {
    media: [comp('RenderCommitPhaseScene')],
  },

  // id: 16 「先ほどメモしておいたコールバック関数が実行されます。」
  16: {
    media: [comp('CallbackPhaseScene')],
  },

  // id: 18 「次に、Stateが更新されたときの「再レンダリング」時の動きを見ていきましょう。」
  18: {
    background: { src: 'images/useEffect/rerender.png' },
    media: [comp('ReRenderPhaseScene')],
  },

  // id: 24 「次にCommitフェーズです。」
  24: {
    media: [comp('RenderCommitPhaseScene')],
  },

  // id: 26 「実際に処理を行うのは「画面の更新（Commitフェーズ）がすべて終わった後」です。」
  26: {
    media: [comp('ReRenderCallbackPhaseScene')],
  },
};

