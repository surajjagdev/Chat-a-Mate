import React from 'react';
import './userprofile.css';
const UserProfile = props => {
  return (
    <div className="userdetails">
      <div className="userdetails_name">
        <img alt="user pic" className="userdetails_picture" src={props.image} />
        <p className="userdetails_ptags">{props.firstName}</p>
        <p className="userdetails_ptags">{props.lastName}</p>
        <div className="editprofile">
          <div className="editprofileelipse" />
          <div className="editprofileelipse" />
          <div className="editprofileelipse" />
        </div>
      </div>
      <div className="userdetails_postslikes">
        <p id="posts">Posts: {props.posts || 0} </p>
        <p id="likes">Likes: {props.likes || 0} </p>
      </div>
      <p>Messenger</p>
    </div>
  );
};
export default UserProfile;
