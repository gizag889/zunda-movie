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
    ],
  },

  // id: 3 「今回はこのコードを例に、useEffectの仕組みをみていきます。」
  3: {
    media: [
      image('images/useEffect/carbon.png',{
        top: -100,
        width: 1350,
      }),
      comp('HighlightBorder', {
        top: '250px',
        left: '410px',
        width: '770px',
        height: '100px',
        borderRadius: '16px',
        zIndex: 10,
        style: { border: '8px solid #FF5722' },
      }),
    ],
  },
  4: {
    media: [
      image('images/useEffect/carbon.png',{
        top: -100,
        width: 1350,
      }),
      comp('HighlightBorder', {
        top: '430px',
        left: '430px',
        width: '1100px',
        height: '200px',
        borderRadius: '16px',
        zIndex: 10,
        style: { border: '8px solid #FF5722' },
      }),
    ]
  },

 
  6: {
    media: [
      image('images/useEffect/carbon.png',{
        top: -100,
        width: 1350,
      }),
      comp('HighlightBorder', {
        top: '630px',
        left: '410px',
        width: '1150px',
        height: '200px',
        borderRadius: '16px',
        zIndex: 10,
        style: { border: '8px solid #FF5722' },
      }),]
  },
   8: {
    texts: [
      centerText('React : CSR', { top: 70, fontSize: 90 }),
    ],

    
  },
  10: {
     media: [comp('RenderPhaseScene', { fadeInStart: 30, fadeIn: 15 })],

  },

    13: {
        media: [comp('RenderCommitPhaseScene')],

  },

  
  16: {
     texts: [
      centerText('useEffect 初回レンダリング', { top: 70, fontSize: 75 }),
    ],
  },
  17: {
    media: [
      comp('Render02Mockup', {
        top: '150px',
        left: '300px',
        width: '600px',
        height: '600px',
        borderRadius: 0,
      }),
    ],
  },
  19: {
    media: [comp('RenderCommitPhaseScene')]
  },

  // id: 20 「続いてCommitフェーズです。新しい画面をユーザーに表示し終わると、」
  20: {
    media: [comp('CallbackPhaseScene')],
  },
  22: {
    media: [],
    texts: [
      centerText('useEffect 再レンダリング', { top: 70, fontSize: 75 }),
    ],
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

