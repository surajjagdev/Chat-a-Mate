import React from 'react';
import auth from '../auth/auth.js';
import Banner from '../components/banner/banner.js';
import { Link } from 'react-router-dom';
import MobileMenuLinks from '../components/banner/mobilemenulinks.js';
import Main from '../main/main.js';
import API from '../utils/api.js';
//socket and events
import io from 'socket.io-client';
import {
  USER_CONNECTED,
  LOGOUT,
  INITIAL_POSTS,
  MESSAGE_SENT
} from '../events.js';
const socketUrl = 'http://localhost:3001/';
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      globalposts: [],
      socket: null
    };
    io(socketUrl).on(MESSAGE_SENT, data => {
      console.log('message sent');
      return this.handleMessageSent([data]);
    });
    io(socketUrl).on('connectedusers', data => {
      console.log('connectedusers:', data);
    });
  }
  componentDidMount() {
    this.handleIntialPosts();
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
  handleIntialPosts = () => {
    API.intialPosts().then(data => {
      return this.handleGlobalPosts([data.data]);
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log('submit');
    API.poststatus({
      body: this.state.status,
      added_by: this.state.email,
      user_to: auth.isVistingAnotherPage() ? auth.visitingpage() : 'None',
      user: this.state.user
    }).then(data => {
      if (data.data.success === true) {
        this.setState(
          {
            likes: data.data.number_likes_total,
            posts: data.data.number_posts_total
          },
          () => {
            console.log('updated number of likes and posts');
          }
        );
      }
    });
  };

  //socket functions
  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      this.setState({ socket }, () => {
        this.setUser(this.state.user);
      });
    });
  };
  setUser = user => {
    //reference point of this
    const that = this;
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
  };
  handleMessageSent = async data => {
    data.map(posts => {
      if (data[0].success === true) {
        this.setState({
          globalposts: [posts.posts, ...this.state.globalposts],
          status: ''
        });
      }
    });
  };
  handleGlobalPosts = async data => {
    const { globalposts } = this.state;
    if (globalposts.length === 0) {
      data.map(posts => {
        if (posts.success === true) {
          this.setState({
            globalposts: posts.posts,
            ...this.state.globalposts
          });
        }
      });
    }
  };
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
          socket={this.state.socket}
          handleGlobalPosts={this.handleGlobalPosts}
          globalposts={this.state.globalposts}
        />
      </div>
    );
  }
}
export default Profile;
