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
        <div
          style={{
            backgroundColor: 'black',
            height: '30px',
            width: '120px',
            color: 'rgba(223, 227, 238)',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer',
            border: 'none',
            textAlign: 'center'
          }}
          onClick={e => props.logout(e)}
        >
          SignOut
        </div>
      </div>
    </div>
  ) : null;
};
export default MobileMenuLinks;
