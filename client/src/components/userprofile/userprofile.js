import React from 'react';
import './userprofile.css';
const UserProfile = props => {
  return (
    <div
      className="userdetails"
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '130px'
      }}
    >
      <div
        className="userdetails_name"
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <img
          alt=""
          className="userdetails_picture"
          src={props.image}
          style={{
            maxWidth: '20px',
            maxHeight: '20px',
            borderRadius: '50%',
            marginTop: '16.5px'
          }}
        />
        <p className="userdetails_ptags" style={{ paddingLeft: '3px' }}>
          {props.firstName}
        </p>
        <p className="userdetails_ptags" style={{ paddingLeft: '3px' }}>
          {props.lastName}
        </p>
        <div
          className="editprofile"
          style={{
            display: 'flex',
            flexDirection: 'row',
            maxWidth: 'auto',
            maxHeight: '50px'
          }}
        >
          <div className="editprofileelipse" />
          <div className="editprofileelipse" />
          <div className="editprofileelipse" />
        </div>
      </div>
      <div
        className="userdetails_postslikes"
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <p id="posts" style={{ display: 'contents', paddingLeft: '20px' }}>
          Posts: {props.posts || 0}
        </p>
        <p
          id="likes"
          style={{
            display: 'contents',
            marginLeft: '10px'
          }}
        >
          Likes: {props.likes || 0}{' '}
        </p>
      </div>
      <p>Messenger</p>
    </div>
  );
};
export default UserProfile;
