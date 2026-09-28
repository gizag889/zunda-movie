import { Config } from '@remotion/cli/config';


// 画面焼け（色落ち）を防ぐためのカラースペース・ピクセルフォーマットの設定
Config.setColorSpace('bt709');
Config.setPixelFormat('yuv420p'); // 一般的なプレーヤーや動画サイトでの互換性と画質低下を防ぐため yuv420p を推奨

// レンダリング時の画質（解像度感）を高く保つための設定
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(100); // JPEGの圧縮による劣化を防ぐ（最高画質）
Config.setCrf(16); // デフォルトより数値を下げて高品質にする (通常18〜20)


// フル機能ブラウザの指定
Config.setChromeMode('chrome-for-testing');

// 描画バックエンドの指定（Windows向け）
Config.setChromiumOpenGlRenderer('angle');

// Remotion v4では、remotion.config.tsから任意のChromiumオプション（--enable-gpu等）を
// 直接渡すことはできなくなりました。代わりにCLI実行時に以下のようにハードウェアアクセラレーションを有効にできます。
// npx remotion render --hardware-acceleration=if-possible