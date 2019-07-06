import React from 'react';
import UserProfile from '../components/userprofile/userprofile.js';
//import AdComponent from '../components/adsense/adsense.js';
import './main.css';
class Main extends React.Component {
  state = {};

  render() {
    return (
      <div className="mainwrapper">
        <UserProfile
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          email={this.props.email}
          image={this.props.image}
        />
        <div className="main">
          <div className="mainstories">hi</div>
          <div className="mainads" />
        </div>
      </div>
    );
  }
}
export default Main;
