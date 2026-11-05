import React from 'react';

export interface ElementAnimation {
  fadeInStart?: number;
  fadeInDuration?: number;
  fadeOutStart?: number;
  fadeOutDuration?: number;
  slideDownStart?: number;
  slideDownDuration?: number;
  slideDownDistance?: number;
  slideInStart?: number;
  slideInDuration?: number;
  slideInX?: number;
  slideInY?: number;
}

export interface MediaElement {
  src?: string;
  component?: string;
  text?: string;
  style?: React.CSSProperties;
  animation?: ElementAnimation;
}

export interface TextElement {
  id?: string;
  text: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  x?: number | string;
  y?: number | string;
  style?: React.CSSProperties;
  animation?: ElementAnimation;
  startFrame?: number;
}

export interface Segment {
  id: number;
  startFrame: number;
  durationInFrames: number;
  mediaStartFrame?: number;
  textsStartFrame?: number;
  character: string;
  text: string;
  audioFile: string;
  media?: MediaElement[] | null;
  texts?: TextElement[] | null;
  background?: {
    src?: string | null;
    opacity?: number;
    color?: string;
  } | null;
  expression?: string;
}

export interface SceneConfig {
  media?: MediaElement[] | null;
  texts?: TextElement[] | null;
  background?: Segment['background'];
  expression?: string;
}

export interface TelopData {
  text: string;
  startSegmentId: number;
}

export interface TimingData {
  segments: Segment[];
  totalDurationInFrames: number;
  telops?: TelopData[];
  telopText?: string;          // 古い形式用
  telopStartSegmentId?: number; // 古い形式用
}
