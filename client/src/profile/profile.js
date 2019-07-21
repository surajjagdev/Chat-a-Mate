import React from 'react';
import auth from '../auth/auth.js';
import Banner from '../components/banner/banner.js';
import { Link } from 'react-router-dom';
import MobileMenuLinks from '../components/banner/mobilemenulinks.js';
import Main from '../main/main.js';
import API from '../utils/api.js';
//socket and events
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../events.js';
//put on process.env after
const socketUrl = 'http://localhost:3001/';
class Profile extends React.Component {
  state = {
    user: '',
    search: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    likes: 0,
    posts: 0,
    sideDrawerOpen: false,
    width: window.innerWidth,
    status: '',
    showPostsPublic: true,
    socket: null
  };
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    const details = () => {
      setTimeout(() => {
        if (auth.firstName !== 'PlaceHolder')
          this.setState(
            {
              firstName: auth.firstName,
              lastName: auth.lastName,
              email: auth.email,
              image: auth.image,
              likes: auth.likes,
              posts: auth.posts,
              user: auth.user,
              showPostsPublic: auth.showPostsPublic
            },
            () => {
              return this.initSocket();
            }
          );
      }, 1000);
    };
    auth.checkAuth(details());
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  handleInput = e => {
    e.preventDefault();
    this.setState({ search: e.target.value }, () => {
      console.log(this.state.search);
    });
  };
  handleStatus = e => {
    e.preventDefault();
    this.setState(
      {
        status: e.target.value
      },
      () => {
        console.log('status: ', this.state.status);
      }
    );
  };
  toggleClickHandler = e => {
    e.preventDefault();
    this.setState(
      prevState => {
        return { sideDrawerOpen: !prevState.sideDrawerOpen };
      },
      () => {
        console.log(this.state.sideDrawerOpen);
      }
    );
  };
  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
    if (this.state.sideDrawerOpen === true && this.state.width > 610) {
      this.setState(
        prevState => ({
          sideDrawerOpen: !prevState.sideDrawerOpen
        }),
        () => {
          console.log(this.state.sideDrawerOpen);
        }
      );
    }
  };
  logout = e => {
    e.preventDefault();
    auth.logout(() => {
      API.logout()
        .then(() => {
          console.log('success');
          return this.props.history.push('/');
        })
        .catch(error => {
          if (error) {
            console.log(error);
          }
        });
    });
  };
  handleSubmit = e => {
    e.preventDefault();

    API.poststatus({
      body: this.state.status,
      added_by: this.state.email,
      user_to: auth.isVistingAnotherPage() ? auth.visitingpage() : 'None'
    })
      .then(data => {
        if (data.data.success === true) {
          console.log(data.data.number_posts);
          this.setState({
            status: '',
            posts: data.data.number_posts,
            likes: data.data.number_likes
          });
          auth.poststatus(() => {
            const obj = {
              posts: data.data.number_posts,
              likes: data.data.number_likes
            };

            return obj;
          });
          process.nextTick(function() {
            console.log(auth.returnState());
          });
        }
      })
      .catch(error => {
        console.log('error: ', error);
      });
  };

  //socket functions
  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log('\nsocket connected\n');
    });
    this.setState({ socket }, () => {
      this.setUser(this.state.user);
    });
  };
  setUser = user => {
    console.log('setuser');
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
  };

  //
  render() {
    return (
      <div className="homePage">
        <Banner
          handleInput={this.handleInput}
          toggleClickHandler={this.toggleClickHandler}
          sideDrawerOpen={this.state.sideDrawerOpen}
          width={this.state.width}
          logout={this.logout}
        />
        <Link to="/test">
          Test
          {auth.isAuthenticated()}
        </Link>
        {this.state.sideDrawerOpen && this.state.width <= 610 ? (
          <MobileMenuLinks
            sideDrawerOpen={this.state.sideDrawerOpen}
            width={this.state.width}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            image={this.state.image}
            logout={this.logout}
          />
        ) : null}
        <button
          style={{
            zIndex: '100000',
            width: '100px',
            height: '100px',
            backgroundColor: 'red',
            marginTop: '40px'
          }}
          type="submit"
          onClick={e => {
            e.preventDefault();
            this.state.socket.emit('greet', this.state.email);
            console.log(this.state.socket);
          }}
        >
          Click me!
        </button>
        <Main
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.state.email}
          image={this.state.image}
          likes={this.state.likes}
          posts={this.state.posts}
          handleStatus={this.handleStatus}
          sideDrawerOpen={this.state.sideDrawerOpen}
          status={this.state.status}
          user={this.state.user}
          width={this.state.width}
          handleSubmit={this.handleSubmit}
          showPostsPublic={this.state.showPostsPublic}
        />
      </div>
    );
  }
}
export default Profile;
