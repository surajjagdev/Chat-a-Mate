import React from 'react';
const Logo = () => {
  return (
    <div className="logo">
      <img
        alt="Chat-a-Mate"
        src="../pictures/logos.PNG"
        style={{
          height: '50px',
          gridArea: 'img',
          position: 'absolute',
          left: '1px',
          width: '130px',
          top: '10px',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};
export default Logo;
