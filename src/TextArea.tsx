import React from 'react';

interface TextAreaProps {
  character: string;
  text: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ character, text }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      color: '#333', 
      marginLeft: 200,
      padding: '30px 30px', 
      borderRadius: 30, 
      fontSize: Math.max(30, Math.min(50, 50 * (60 / Math.max(60, text.length)))), 
      fontWeight: 'bold',
      maxWidth: '85%',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: `4px solid ${character === 'zundamon' ? '#4CAF50' : '#555'}`,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      zIndex: 2
    }}>
       {text}
    </div>
  );
};
