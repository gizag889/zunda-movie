export interface Segment {
  id: number;
  startFrame: number;
  durationInFrames: number;
  character: string;
  text: string;
  audioFile: string;
  media?: {
    layout?: string;
    splitRatio?: number[];
    frames?: string[];
  };
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
