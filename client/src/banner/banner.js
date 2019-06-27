import React from 'react';
import '../register/registerForm.css';
import './banner.css';
import Logo from '../logo/logo.js';
const Banner = props => {
  return (
    <div className="Banner">
      <div style={{ display: 'grid', gridTemplateColumns: '150px  1fr' }}>
        <Logo />
        <input
          className="searchBar"
          type="text"
          placeholder="Search"
          name="searchbar"
          onChange={e => {
            props.handleInput(e);
          }}
        />
      </div>
      <button
        className="searchButton"
        onClick={e => {
          console.log('hello');
        }}
      >
        <i className="material-icons">search</i>
      </button>
      <div />
      <div
        className="userLinks"
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 40px 40px 40px 40px 40px',
          gridGap: '5px',
          marginLeft: '5px',
          marginTop: '5px',
          textAlign: 'center'
        }}
      >
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
