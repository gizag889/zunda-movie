import React from 'react';

export const ArrowRight: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style
    }}>
      <svg width="100%" height="100%" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12H46M46 12L36 2M46 12L36 22" stroke="#222222" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};
