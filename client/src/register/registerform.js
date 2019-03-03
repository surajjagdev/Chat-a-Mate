import React from 'react';
import Logo from '../logo/logo.js';
import './registerForm.css';
class Register extends React.Component {
  state = {
    userName: '',
    userPassword: '',
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    formErrors: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  };
  formValid = (formErrors, ...rest) => {
    let valid = true;
    //valid form errors being empty
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
    //validate form was filled out
    Object.values(rest).forEach(val => {
      val === null && (valid = false);
    });
    return valid;
  };
  //email validation
  emailValidationRegExp = RegExp(
    /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/
  );
  handleInput = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = this.state.formErrors;
    //switch form case errors
    switch (name) {
      case 'firstName':
        formErrors.firstName =
          value.length < 4 || value.length > 20
            ? 'First Name must be between 4 and 20 characters.If longer shorten it. If shorter lengthen it.'
            : '';
        break;
      case 'lastName':
        formErrors.lastName =
          value.length < 4 || value.length > 20
            ? 'Last Name must be between 4 and 20 characters. If longer shorten it. If shorter lengthen it.'
            : '';
        break;
      case 'email':
        formErrors.email =
          this.emailValidationRegExp.test(value) && value.length > 0
            ? ''
            : 'Please enter a valid email address.';
        break;
      case 'password':
        formErrors.password =
          value.length < 7 || value.length > 15
            ? 'Password must be greater than 7 characters, but less than 15 characters.'
            : '';
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value });
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
      this.formValid(this.state.formErrors) &&
      this.state.firstName !== null &&
      this.state.lastName !== null &&
      this.state.email !== null &&
      this.state.password !== null
    ) {
      const upperCase = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      let firstName = upperCase(this.state.firstName);
      let lastName = upperCase(this.state.lastName);
      let email = this.state.email;
      let password = this.state.password;
      console.log(
        `firstName:${firstName}\nlastName:${lastName}\nEmail:${email}\n Password:${password}`
      );
    } else {
      alert('Error in form. Please fix it.');
    }
  };
  render() {
    const formErrors = this.state.formErrors;
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
        <div className="errorSpan">
          {formErrors.firstName.length > 0 && (
            <span className="errorMessage">{formErrors.firstName}</span>
          )}
          <br />
          {formErrors.lastName.length > 0 && (
            <span className="errorMessage">{formErrors.lastName}</span>
          )}
          <br />
          {formErrors.email.length > 0 && (
            <span className="errorMessage">{formErrors.email}</span>
          )}
          <br />
          {formErrors.password.length > 0 && (
            <span className="errorMessage">{formErrors.password}</span>
          )}
        </div>
        <div className="newUserForm">
          <h1 className="newUserFormHeader1">Don't Have an Account</h1>
          <h3 className="newUserFormHeader3">Create One</h3>
          <div className="name">
            <input
              className="firstNameField"
              style={
                formErrors.firstName.length > 0 || this.state.firstName === null
                  ? { borderColor: 'red' }
                  : { border: null }
              }
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
              style={
                formErrors.lastName.length > 0 || this.state.lastName === null
                  ? { borderColor: 'red' }
                  : { border: null }
              }
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
              style={
                formErrors.email.length > 0 || this.state.email === null
                  ? { borderColor: 'red' }
                  : { border: null }
              }
              placeholder="Email"
              name="email"
              onChange={e => {
                this.handleInput(e);
              }}
            />
            <input
              className="passwordField"
              type="password"
              style={
                formErrors.password.length > 0 || this.state.password === null
                  ? { borderColor: 'red' }
                  : { border: null }
              }
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
