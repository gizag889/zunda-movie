import React from 'react';
import { Render02Mockup } from './Render02Mockup';

export const RenderPhaseScene: React.FC<{ style?: React.CSSProperties, segment?: any }> = ({ style, segment }) => {
  return (
    <div style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
      <Render02Mockup
        style={{ position: 'absolute', top: '150px', left: '300px', width: '600px', height: '600px', borderRadius: 0 }}
        segment={segment}
      />
    </div>
  );
};
