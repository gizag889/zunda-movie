import React from 'react';
import { ElementAnimation, MediaElement, TextElement } from './types';
import type { RegisteredComponentName } from './MediaFrame';

export interface AnimationShorthand {
  /** フェードインにかけるフレーム数（例: 15 = 0.5秒） */
  fadeIn?: number;
  fadeInStart?: number;
  /** 横方向のスライドイン開始オフセット（px） */
  slideInX?: number;
  /** 縦方向のスライドイン開始オフセット（px） */
  slideInY?: number;
  animation?: ElementAnimation;
}

export interface TextHelperOptions extends AnimationShorthand {
  id?: string;
  fontSize?: number | string;
  color?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  fontFamily?: string;
  style?: React.CSSProperties;
}

export interface PositionedTextOptions extends TextHelperOptions {
  top?: number | string;
  left?: number | string;
}

export interface MediaHelperOptions extends AnimationShorthand {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  zIndex?: number;
  style?: React.CSSProperties;
}

const buildAnimation = (options?: AnimationShorthand): ElementAnimation | undefined => {
  if (!options) return undefined;
  const { fadeIn, fadeInStart, slideInX, slideInY, animation } = options;
  if (
    fadeIn === undefined &&
    fadeInStart === undefined &&
    slideInX === undefined &&
    slideInY === undefined &&
    !animation
  ) {
    return undefined;
  }
  const hasSlideIn = slideInX !== undefined || slideInY !== undefined;
  return {
    ...(fadeIn !== undefined ? { fadeInDuration: fadeIn } : {}),
    ...(fadeInStart !== undefined ? { fadeInStart } : {}),
    ...(hasSlideIn
      ? {
          slideInDuration: animation?.slideInDuration ?? fadeIn ?? 15,
          ...(slideInX !== undefined ? { slideInX } : {}),
          ...(slideInY !== undefined ? { slideInY } : {}),
        }
      : {}),
    ...animation,
  };
};

/** 基準点を中心に揃えてテキストを配置する */
export const centerText = (text: string, options?: PositionedTextOptions): TextElement => {
  const anim = buildAnimation(options);
  return {
    ...(options?.id !== undefined ? { id: options.id } : {}),
    text,
    top: options?.top ?? '50%',
    left: options?.left ?? '50%',
    style: {
      transform: 'translate(-50%, -50%)',
      fontFamily: options?.fontFamily ?? 'Noto Sans JP',
      fontWeight: options?.fontWeight ?? 'bold',
      ...(options?.fontSize !== undefined ? { fontSize: options.fontSize } : {}),
      ...(options?.color !== undefined ? { color: options.color } : {}),
      ...options?.style,
    },
    ...(anim ? { animation: anim } : {}),
  };
};

/** 画面中央のメインタイトル（デフォルト: 180px 太字） */
export const mainTitle = (text: string, options?: PositionedTextOptions): TextElement =>
  centerText(text, {
    top: '50%',
    fontSize: 180,
    color: '#111111',
    ...options,
  });

/** 上部のサブタイトル（デフォルト: top 28%, 72px 太字） */
export const subtitle = (text: string, options?: PositionedTextOptions): TextElement =>
  centerText(text, {
    top: '28%',
    fontSize: 72,
    color: '#111111',
    ...options,
  });

/** 指定座標 (left, top) にテキストを配置する */
export const textAt = (
  text: string,
  left: number | string,
  top: number | string,
  options?: TextHelperOptions
): TextElement => {
  const anim = buildAnimation(options);
  return {
    ...(options?.id !== undefined ? { id: options.id } : {}),
    text,
    left,
    top,
    style: {
      fontFamily: options?.fontFamily ?? 'Noto Sans JP',
      fontWeight: options?.fontWeight ?? 'bold',
      ...(options?.fontSize !== undefined ? { fontSize: options.fontSize } : {}),
      ...(options?.color !== undefined ? { color: options.color } : {}),
      ...options?.style,
    },
    ...(anim ? { animation: anim } : {}),
  };
};

const buildPositionedStyle = (options?: MediaHelperOptions): React.CSSProperties | undefined => {
  if (!options) return undefined;
  const { top, left, right, bottom, width, height, borderRadius, zIndex, style } = options;
  const hasPos = top !== undefined || left !== undefined || right !== undefined || bottom !== undefined;
  if (
    !hasPos &&
    width === undefined &&
    height === undefined &&
    borderRadius === undefined &&
    zIndex === undefined &&
    !style
  ) {
    return undefined;
  }
  return {
    ...(hasPos ? { position: 'absolute', borderRadius: 0 } : {}),
    ...(top !== undefined ? { top } : {}),
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
    ...(zIndex !== undefined ? { zIndex } : {}),
    ...style,
  };
};

/** ComponentRegistry に登録されたコンポーネントを配置する */
export const comp = (
  component: RegisteredComponentName | (string & {}),
  options?: MediaHelperOptions
): MediaElement => {
  const style = buildPositionedStyle(options);
  const anim = buildAnimation(options);
  return {
    component,
    ...(style ? { style } : {}),
    ...(anim ? { animation: anim } : {}),
  };
};

/** 画像を配置する（デフォルトで objectFit: 'contain'） */
export const image = (
  src: string,
  options?: MediaHelperOptions & {
    scale?: number;
    objectPosition?: string;
    objectFit?: React.CSSProperties['objectFit'];
  }
): MediaElement => {
  const posStyle = buildPositionedStyle(options);
  const anim = buildAnimation(options);
  return {
    src,
    style: {
      flex: 1,
      objectFit: options?.objectFit ?? 'contain',
      ...(options?.scale !== undefined ? { transform: `scale(${options.scale})` } : {}),
      ...(options?.objectPosition !== undefined ? { objectPosition: options.objectPosition } : {}),
      ...posStyle,
    },
    ...(anim ? { animation: anim } : {}),
  };
};

/** 動画を配置する（デフォルトで objectFit: 'contain'） */
export const video = (
  src: string,
  options?: MediaHelperOptions & {
    scale?: number;
    objectPosition?: string;
    objectFit?: React.CSSProperties['objectFit'];
  }
): MediaElement => {
  const posStyle = buildPositionedStyle(options);
  const anim = buildAnimation(options);
  return {
    src,
    style: {
      flex: 1,
      objectFit: options?.objectFit ?? 'contain',
      ...(options?.scale !== undefined ? { transform: `scale(${options.scale})` } : {}),
      ...(options?.objectPosition !== undefined ? { objectPosition: options.objectPosition } : {}),
      ...posStyle,
    },
    ...(anim ? { animation: anim } : {}),
  };
};

