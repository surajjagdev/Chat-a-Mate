import React from 'react';
import './banner.css';
const MobileMenu = props => {
  return (
    <button
      className="toggle_button"
      style={{ right: props.sideDrawerOpen ? '29px' : null }}
      onClick={e => {
        props.toggleClickHandler(e);
      }}
    >
      <div className="toggle_button_line" />
      <div className="toggle_button_line" />
      <div className="toggle_button_line" />
    </button>
  );
};
export default MobileMenu;
