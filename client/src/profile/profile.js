import React from 'react';
import auth from '../auth/auth.js';
import Banner from '../components/banner/banner.js';
import { Link } from 'react-router-dom';
import MobileMenuLinks from '../components/banner/mobilemenulinks.js';
import Main from '../main/main.js';
class Profile extends React.Component {
  state = {
    search: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    sideDrawerOpen: false,
    width: window.innerWidth
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
              image: auth.image
            },
            () => {
              return console.log(this.state);
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
  };
  render() {
    return (
      <div className="homePage">
        <Banner
          handleInput={this.handleInput}
          toggleClickHandler={this.toggleClickHandler}
          sideDrawerOpen={this.state.sideDrawerOpen}
          width={this.state.width}
        />
        <Link to="/test">
          Test
          {auth.isAuthenticated()}
        </Link>
        {this.state.sideDrawerOpen && this.state.width <= 610 ? (
          <MobileMenuLinks
            sideDrawerOpen={this.state.sideDrawerOpen}
            width={this.state.width}
          />
        ) : null}
        <Main
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.state.email}
          image={this.state.image}
        />
      </div>
    );
  }
}
export default Profile;
