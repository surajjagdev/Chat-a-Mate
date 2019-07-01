import React from 'react';
import UserProfile from '../components/userprofile/userprofile.js';
import './main.css';
class Main extends React.Component {
  state = {};

  render() {
    return (
      <div className="main">
        <UserProfile
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          email={this.props.email}
          image={this.props.image}
        />
      </div>
    );
  }
}
export default Main;
