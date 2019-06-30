import React from 'react';
const MobileMenuLinks = props => {
  return props.sideDrawerOpen && props.width <= 570 ? (
    <div className="sideDrawer">
      <div className="bannerIconsMobile">
        <i className="material-icons">home</i>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">create</i>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">people</i>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">message</i>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">notifications</i>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">arrow_drop_down_circle</i>
      </div>
    </div>
  ) : null;
};
export default MobileMenuLinks;
