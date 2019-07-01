import React from 'react';
import './userprofile.css';
const UserProfile = props => {
  return (
    <div className="userdetails">
      <img alt="user pic" className="userdetails_picture" src={props.image} />
      <p className="userdetails_ptags">{props.firstName}</p>
      <p className="userdetails_ptags">{props.lastName}</p>
      <div className="editprofile">
        <div className="editprofileelipse" />
        <div className="editprofileelipse" />
        <div className="editprofileelipse" />
      </div>
    </div>
  );
};
export default UserProfile;
