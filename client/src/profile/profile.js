import React from 'react';
import auth from '../auth/auth.js';
import Banner from '../banner/banner.js';
import { Link } from 'react-router-dom';
class Profile extends React.Component {
  state = {
    search: ''
  };
  handleInput = e => {
    e.preventDefault();
    this.setState({ search: e.target.value }, () => {
      console.log(this.state.search);
    });
  };
  render() {
    return (
      <div className="homePage">
        <Banner handleInput={this.handleInput} />
        <Link to="/test">
          Test
          {auth.isAuthenticated()}
        </Link>
      </div>
    );
  }
}
export default Profile;
