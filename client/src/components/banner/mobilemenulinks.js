import React from 'react';
const MobileMenuLinks = props => {
  return props.sideDrawerOpen && props.width <= 610 ? (
    <div className="sideDrawer">
      <div className="bannerIconsMobile">
        <img
          alt="user pic"
          style={{
            maxWidth: '60px',
            maxHeight: '60px',
            borderRadius: '50%',
            paddingRight: '5px',
            border: 'none'
          }}
          src={props.image}
        />
        <p>{`${props.firstName} ${props.lastName}`}</p>
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">home</i>
        Home
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">create</i> Edit
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">people</i> Friends
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">message</i> Messenger
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">notifications</i> Notifications
      </div>
      <div className="bannerIconsMobile">
        <i className="material-icons">arrow_drop_down_circle</i>Profile
      </div>
    </div>
  ) : null;
};
export default MobileMenuLinks;
