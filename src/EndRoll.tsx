import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const EndRoll: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'black'
    }}>
      <Img 
        src={staticFile("images/tb01.png")} 
        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute' }} 
      />
      <div style={{ 
        position: 'absolute', 
        bottom: 180,
        textAlign: 'center',
        backgroundColor: 'white', 
        color: '#333', 
        padding: '30px 60px', 
        borderRadius: 30, 
        fontSize: 70,
        fontWeight: 'bold',
        maxWidth: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        border: '8px solid #FFB300',
        lineHeight: 1.4,
        wordBreak: 'break-word',
        zIndex: 2
      }}>
        ご視聴ありがとうございました！
      </div>
    </AbsoluteFill>
  );
};
