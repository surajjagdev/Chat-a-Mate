import React from 'react';
import '../../register/registerForm.css';
import './banner.css';
import Logo from '../logo/logo.js';
import MobileMenu from './mobilemenu.js';
const Banner = props => {
  return (
    <div className="banner">
      <div className="logoandsearch">
        <Logo style={{ paddingLeft: '4vw' }} />
        <div className="searchBarAndButton">
          <input
            className="searchBar"
            type="text"
            placeholder="Search"
            name="searchbar"
            onChange={e => {
              props.handleInput(e);
            }}
          />
          <button
            className="searchButton"
            type="submit"
            onClick={e => {
              console.log('hello');
            }}
          >
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>
      <div className="emptyDiv" />
      <MobileMenu
        toggleClickHandler={props.toggleClickHandler}
        width={props.width}
        sideDrawerOpen={props.sideDrawerOpen}
      />
      <div className="userLinks">
        <div className="bannerIcons">
          <i className="material-icons">home</i>
        </div>
        <div className="bannerIcons">
          <i className="material-icons">create</i>
        </div>
        <div className="bannerIcons">
          <i className="material-icons">people</i>
        </div>
        <div className="bannerIcons">
          <i className="material-icons">message</i>
        </div>
        <div className="bannerIcons">
          <i className="material-icons">notifications</i>
        </div>
        <div
          className="bannerIcons"
          style={{
            backgroundColor: 'black',
            marginLeft: '15px',
            height: '20px',
            width: '60px',
            marginTop: '2px',
            color: 'rgba(16, 76, 132, 1)',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none'
          }}
          onClick={e => props.logout(e)}
        >
          SignOut
        </div>
      </div>
    </div>
  );
};
export default Banner;
