import { Config } from '@remotion/cli/config';

// 画面焼け（色落ち）を防ぐためのカラースペース・ピクセルフォーマットの設定
Config.setColorSpace('bt709');
Config.setPixelFormat('yuv444p');
