import React from 'react';
import '../register/registerForm.css';
import './banner.css';
import Logo from '../logo/logo.js';
const Banner = props => {
  return (
    <div className="Banner">
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
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
        style={{
          position: 'relative',
          height: '41px',
          width: '60px',
          top: '15px'
        }}
        onClick={e => {
          console.log('hello');
        }}
      >
        Search
      </button>
      <div
        className="userLinks"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          gridGap: '1px',
          marginLeft: '5px'
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
        <div
          style={{
            backgroundColor: 'red',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
        <div
          style={{
            backgroundColor: 'yellow',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
        <div
          style={{
            backgroundColor: 'brown',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
        <div
          style={{
            backgroundColor: 'purple',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
        <div
          style={{
            backgroundColor: 'black',
            width: '80px',
            height: '35px',
            position: 'relative',
            top: '18px'
          }}
        />
      </div>
    </div>
  );
};
export default Banner;
