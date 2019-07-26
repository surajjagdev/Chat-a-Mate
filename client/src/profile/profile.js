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
  USER_POST,
  USER_DICONNECTED,
  GLOBAL_POSTS,
  INITIAL_POSTS,
  MESSAGE_SENT
} from '../events.js';
//put on process.env after
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

    io(socketUrl).on(INITIAL_POSTS, data => {
      return this.handleGlobalPosts(data);
    });
    io(socketUrl).on(GLOBAL_POSTS, data => {
      return this.handleGlobalPosts([data]);
    });
    io(socketUrl).on(MESSAGE_SENT, data => {
      console.log('message sent');
      return this.handleMessageSent([data]);
    });
  }
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
    const { socket } = this.state;
    socket.emit(USER_POST, {
      body: this.state.status,
      added_by: this.state.email,
      user_to: auth.isVistingAnotherPage() ? auth.visitingpage() : 'None',
      user: this.state.user
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
    console.log('hanlde message sent');
    const { globalposts } = this.state;
    let chat = [];
    if (globalposts.length === 0) {
      await data.map(posts => {
        if (data.success === true) {
          chat.push(posts.posts);
        }
      });
      return await this.setState({
        globalposts: chat,
        status: '',
        likes: data[0].number_likes_total,
        posts: data[0].number_posts_total
      });
    } else {
      await globalposts.map(posts => {
        chat.push(posts);
      });
      if (data[0].success === true) {
        chat.push(data[0].posts);
      }
      return await this.setState({
        globalposts: chat,
        status: '',
        likes: data[0].number_likes_total,
        posts: data[0].number_posts_total
      });
    }
  };
  handleGlobalPosts = async data => {
    console.log('handle gloval posts');
    const { globalposts } = this.state;
    let chat = [];
    if (globalposts.length === 0) {
      await data.map(posts => {
        if (posts.success === true) {
          chat.push(posts.posts);
        }
      });
      return await this.setState({ globalposts: chat }, () => {
        console.log(this.state.globalposts);
      });
    } else {
      await globalposts.map(posts => {
        chat.push(posts);
      });
      if (data[0].success === true) {
        chat.push(data[0].posts);
        //update likes and posts
      }
      return await this.setState({ globalposts: chat }, () => {
        console.log(this.state.globalposts);
      });
    }
  };
  render() {
    /* if (this.state.socket !== null) {
      const { socket } = this.state;
      socket.on(INITIAL_POSTS, data => {
        return this.handleGlobalPosts(data);
      });
    }*/
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
