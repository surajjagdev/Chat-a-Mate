import React from 'react';
import UserProfile from '../components/userprofile/userprofile.js';
//import AdComponent from '../components/adsense/adsense.js';
import API from '../utils/api.js';
import './main.css';
class Main extends React.Component {
  state = {};
  handleSubmit = e => {
    e.preventDefault();
    API.poststatus({
      body: this.props.status,
      added_by: this.props.email,
      user_to: 'test'
    })
      .then(data => {
        console.log(data);
        if (data.data.success === true) {
          console.log('successfful post');
          this.setState({ status: '' }, () => {
            this.status.value = '';
          });
        } else {
          console.log('fail post');
        }
      })
      .catch(error => {
        console.log('error: ', error);
      });
  };
  render() {
    return !this.props.sideDrawerOpen ? (
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
                border: '1px solid gray',
                marginTop: '16.5px'
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
                    paddingRight: '5px',
                    border: 'none'
                  }}
                  src={this.props.image}
                />
                <input
                  ref={ref => (this.status = ref)}
                  type="text"
                  onChange={this.props.handleStatus}
                  value={this.props.status}
                  id="statusInput"
                  name="status"
                  placeholder={`Whats on your mind ${this.props.firstName} ${
                    this.props.lastName
                  }`}
                  style={{
                    width: '100%',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                    textAlign: 'center',
                    border: 'none'
                  }}
                />
                <button
                  type="submit"
                  id="postButton"
                  onClick={e => {
                    this.handleSubmit(e);
                  }}
                >
                  <i className="material-icons">send</i>
                </button>
              </div>
            </div>
          </div>
          <div className="mainads" style={{ backgroundColor: 'green' }} />
        </div>
      </div>
    ) : null;
  }
}
export default Main;
