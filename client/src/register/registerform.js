import React from 'react';
import Logo from '../logo/logo.js';
import './registerForm.css';
class Register extends React.Component {
  state = {
    userName: '',
    userPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  handleInput = e => {
    e.preventDefault();
    let name = e.target.name;
    this.setState({ [name]: e.target.value }, () => {
      /*console.log(
        `firstName: ${this.state.firstName}, \nlastName: ${
          this.state.lastName
        }, \nemail: ${this.state.email},\n password:${this.state.password}`
      );*/
    });
  };
  signIn = e => {
    e.preventDefault();
    if (
      this.state.userName !== '' &&
      (this.state.userPassword !== '' && this.state.userPassword.length > 5)
    ) {
      console.log(
        `userName: ${this.state.userName}\n userPassword: ${
          this.state.userPassword
        }`
      );
    } else {
      alert('enter valid userName and password');
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    if (
      this.state.firstName !== '' &&
      this.state.lastName !== '' &&
      this.state.email !== '' &&
      this.state.password !== '' &&
      this.state.password.length > 5
    ) {
      console.log(`Name: ${this.state.firstName}\n
    Last Name:${this.state.lastName}\n
    email:${this.state.email}\n
    password:${this.state.password}
    `);
    } else {
      alert('need to enter name, email and password');
      return false;
    }
  };

  render() {
    return (
      <div className="homePage">
        <div className="existingUserForm">
          <Logo />
          <h1 className="existingUserFormHeader">Chat-a-Mate</h1>
          <input
            className="userName"
            type="text"
            placeholder="Email"
            name="userName"
            onChange={e => {
              this.handleInput(e);
            }}
          />
          <input
            className="userPassword"
            type="password"
            placeholder="Password"
            name="userPassword"
            onChange={e => {
              this.handleInput(e);
            }}
          />
          <button
            className="signIn"
            onClick={e => {
              this.signIn(e);
            }}
          >
            Log In
          </button>
        </div>
        <div className="newUserForm">
          <h1 className="newUserFormHeader1">Don't Have an Account</h1>
          <h3 className="newUserFormHeader3">Create One</h3>
          <div className="name">
            <input
              className="firstNameField"
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={e => {
                this.handleInput(e);
              }}
            />
            <input
              className="lastNameField"
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={e => {
                this.handleInput(e);
              }}
            />
          </div>
          <div className="emailPass">
            <input
              className="emailField"
              type="text"
              placeholder="Email"
              name="email"
              onChange={e => {
                this.handleInput(e);
              }}
            />
            <input
              className="passwordField"
              type="password"
              placeholder="Password"
              name="password"
              onChange={e => {
                this.handleInput(e);
              }}
            />
          </div>
          <button
            className="newUserFormSubmit"
            onClick={e => this.handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
export default Register;
