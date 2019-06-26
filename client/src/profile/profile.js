import React from 'react';
import auth from '../auth/auth.js';
import Logo from '../logo/logo.js';
import '../register/registerForm.css';
import { Link } from 'react-router-dom';
class Profile extends React.Component {
  state = {
    hi: 'hi'
  };
  render() {
    return (
      <div className="homePage">
        <div className="existingUserForm">
          <Logo />
          <h1 className="existingUserFormHeader">Chat-a-Mate</h1>
          <input
            className="userName"
            type="text"
            placeholder="Email"
            value={this.state.userName}
            name="placeholder"
            onChange={e => {
              console.log(e);
            }}
          />
          <input
            className="userPassword"
            type="text"
            placeholder="Change"
            name="placeholder2"
            onChange={e => {
              console.log(e);
            }}
          />
          <button
            className="signIn"
            onClick={e => {
              console.log('hello');
            }}
          >
            Change
          </button>
        </div>
        <Link to="/test">
          Test
          {auth.isAuthenticated()}
        </Link>
      </div>
    );
  }
}
export default Profile;
