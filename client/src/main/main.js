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
          posts={this.props.posts}
          likes={this.props.likes}
        />
        <div className="main">
          <div className="mainstories">
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid gray'
              }}
            >
              <div
                style={{
                  width: 'intial',
                  backgroundColor: 'rgba(223, 227, 238)'
                }}
              >
                Create Post
              </div>
              <div
                style={{
                  width: 'intial',
                  padding: '10px',
                  maxHeight: '120px',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <img
                  alt="user pic"
                  style={{
                    maxWidth: '60px',
                    maxHeight: '60px',
                    borderRadius: '50%',
                    paddingRight: '5px'
                  }}
                  src={this.props.image}
                />
                <input
                  type="text"
                  onChange={this.props.handleStatus}
                  name="status"
                  placeholder={`Whats on your mind ${this.props.firstName} ${
                    this.props.lastName
                  }`}
                  style={{
                    width: '100%',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mainads" />
        </div>
      </div>
    );
  }
}
export default Main;
