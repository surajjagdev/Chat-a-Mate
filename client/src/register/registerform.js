import React from 'react';
class Register extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  handleInput = e => {
    e.preventDefault();
    let name = e.target.name;
    this.setState({ [name]: e.target.value }, () => {
      console.log(
        `firstName: ${this.state.firstName}, \nlastName: ${
          this.state.lastName
        }, \nemail: ${this.state.email},\n password:${this.state.password}`
      );
    });
  };

  render() {
    return (
      <div>
        <h1>Register Form</h1>
        <div className="name">
          <label>First Name</label>
          <input
            className="firstNameField"
            type="text"
            name="firstName"
            onChange={e => {
              this.handleInput(e);
            }}
          />
          <label>Last Name</label>
          <input
            className="lastNameField"
            type="text"
            name="lastName"
            onChange={e => {
              this.handleInput(e);
            }}
          />
        </div>
        <div className="emailPass">
          <label>Email</label>
          <input
            className="emailField"
            type="text"
            name="email"
            onChange={e => {
              this.handleInput(e);
            }}
          />
          <label>Password</label>
          <input
            className="passwordField"
            type="text"
            name="password"
            onChange={e => {
              this.handleInput(e);
            }}
          />
        </div>
      </div>
    );
  }
}
export default Register;
