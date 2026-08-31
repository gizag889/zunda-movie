import React from 'react';
import { LipSyncCharacter } from './LipSyncCharacter';
import { Segment } from './types';

interface CharacterAreaProps {
  segment: Segment;
}

export const CharacterArea: React.FC<CharacterAreaProps> = ({ segment }) => {
  return (
    <div style={{ 
      position: 'absolute',
      left: -120,
      bottom: -460, // テキストの高さに影響されないように絶対位置で固定
      zIndex: 1
    }}>
       <LipSyncCharacter 
         character="zundamon" 
         audioFile={segment.character === 'zundamon' ? segment.audioFile : undefined} 
         expression={segment.character === 'zundamon' ? segment.expression : undefined}
       />
    </div>
  );
};
