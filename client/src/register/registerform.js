import React from 'react';
import Logo from '../logo/logo.js';
import { Link } from 'react-router-dom';
import API from '../utils/api.js';
import './registerForm.css';
import auth from '../auth/auth.js';
class Register extends React.Component {
  state = {
    userName: '',
    userPassword: '',
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    serverErrors: '',
    formErrors: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  };
  componentDidMount() {
    setTimeout(() => {
      if (auth.isAuthenticated() === true) {
        return this.props.history.push('/profile');
      }
    }, 1000);
  }
  /*componentDidMount() {
    console.log('auth: ', auth.isAuthenticated());
    auth.checkAuth(() => {
      API.checkauth()
        .then(data => {
          if (data.data.success === true) {
            return console.log('hi');

            // this.props.history.push('/profile');
          }
        })
        .catch(error => {
          if (error) {
            console.log(error);
          }
        });
    });
  }*/
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
  //strip html tags
  stripTags = myString => {
    return myString.replace(/(<([^>]+)>)/gi, '');
  };
  //handle input. Then validate
  handleInput = e => {
    e.preventDefault();
    const { name, value } = e.target;
    const formErrors = this.state.formErrors;
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
      this.state.userName.length > 1 &&
      this.state.userPassword !== '' &&
      this.state.userPassword.length > 1
    ) {
      console.log(
        `userName: ${this.state.userName}\n userPassword: ${
          this.state.userPassword
        }`
      );
      auth.login(() => {
        API.login({
          userName: this.state.userName,
          userPassword: this.state.userPassword
        })
          .then(data => {
            if (data.data.success === true) {
              this.setState({ serverErrors: '' });
              this.props.history.push('/profile');
            }
            if (data.data.success === false) {
              this.setState({ serverErrors: data.data.errors.errors });
            }
          })
          .catch(error => {
            if (error) {
              const uncaughtError = {
                message: 'Uncaught Error. Please Try again later'
              };
              this.setState({ serverErrors: uncaughtError });
            }
          });
      });
    } else {
      this.setState({
        serverErrors: [{ message: 'Please enter a valid username password' }]
      });
    }
  };
  logout = e => {
    /*e.preventDefault();
    API.logout();*/
    auth.logout(() => {
      this.props.history.push('/');
    });
  };
  //submit form
  //upper case first letter, dont allow null
  //strip html tags and then check length
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
      let firstName = upperCase(
        this.stripTags(this.state.firstName.split(' ').join(''))
      );
      let lastName = upperCase(
        this.stripTags(this.state.lastName.split(' ').join(''))
      );
      let email = this.state.email.split(' ').join('');
      let password = this.state.password.split(' ').join('');
      if (
        firstName !== '' &&
        firstName.length >= 4 &&
        firstName.length < 20 &&
        lastName !== '' &&
        lastName.length >= 4 &&
        lastName.length < 20 &&
        email !== '' &&
        email.length > 0 &&
        password !== '' &&
        password.length >= 7 &&
        password.length < 20
      ) {
        API.newuser({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password
        }).then((data, error) => {
          console.log(error);
          const success = data.data.success;
          if (success === true) {
            this.setState({ serverErrors: '' });
            console.log('success');
            console.log(data.data);
          } else if (success === false) {
            let returnedErrors = data.data.errors.errors;
            this.setState({ serverErrors: returnedErrors });
            console.log(returnedErrors);
          } else {
            console.log('nothing');
          }
        });
      } else {
        this.setState({ serverErrors: '' });
        alert('Error');
      }
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
          {this.state.serverErrors.length > 0
            ? this.state.serverErrors.map((error, index) => {
                return (
                  <span key={index} className="errorMessage">
                    {error.message}.
                  </span>
                );
              })
            : null}
          <br />
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
        <div className="newUserForm" ref="form">
          <h1 className="newUserFormHeader1">Don't Have an Account</h1>
          <h3 className="newUserFormHeader3">Create One</h3>
          <div className="name">
            <input
              ref="firstName"
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
              ref="lastName"
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
              ref="email"
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
              ref="password"
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/surajjagdev/Chat-a-Mate"
        >
          <div
            style={{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '30px',
              height: '30px'
            }}
          >
            <img
              alt="Chat-a-Mate"
              src="../pictures/Github-Icon.png"
              style={{ width: '30px', height: '30px' }}
            />
          </div>
        </a>
      </div>
    );
  }
}
export default Register;
