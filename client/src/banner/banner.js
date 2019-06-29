import React from 'react';
import '../register/registerForm.css';
import './banner.css';
import Logo from '../logo/logo.js';
const Banner = props => {
  return (
    <div className="banner">
      <div className="logoandsearch">
        <Logo />
        <div>
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
            onClick={e => {
              console.log('hello');
            }}
          >
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>
      <div className="emptyDiv" />
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
        <div className="bannerIcons">
          <i className="material-icons">arrow_drop_down_circle</i>
        </div>
      </div>
    </div>
  );
};
export default Banner;
