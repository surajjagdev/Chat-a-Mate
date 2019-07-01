import React from 'react';
import '../../register/registerForm.css';
const Logo = props => {
  return (
    <div>
      {props.style ? (
        <img
          alt="Chat-a-Mate"
          style={props.style}
          src="../pictures/logos.png"
          className="logo"
        />
      ) : (
        <img alt="Chat-a-Mate" src="../pictures/logos.png" className="logo" />
      )}
    </div>
  );
};
export default Logo;
