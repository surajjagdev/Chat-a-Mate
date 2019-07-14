//front-end auth
import API from '../utils/api.js';
class Auth {
  constructor() {
    this.authenticated = this.checkAuth();
    this.firstName = 'PlaceHolder';
    this.lastName = 'PlaceHolder';
    this.email = 'PlaceHolder';
    this.user = '';
    this.image = '';
    this.posts = 0;
    this.likes = 0;
  }
  checkAuth(cb) {
    API.checkauth()
      .then(data => {
        if (data.data.success === true && typeof cb !== 'undefined') {
          return (
            (this.authenticated = true),
            (this.firstName = data.data.details.firstName),
            (this.user = data.data.user),
            (this.lastName = data.data.details.lastName),
            (this.email = data.data.details.email),
            (this.image = data.data.details.image),
            (this.posts = data.data.details.posts),
            (this.likes = data.data.details.likes),
            cb()
          );
        } else if (data.data.success === true && typeof cb === 'undefined') {
          return (
            (this.authenticated = true),
            (this.firstName = data.data.details.firstName),
            (this.lastName = data.data.details.lastName),
            (this.user = data.data.user),
            (this.email = data.data.details.email),
            (this.image = data.data.details.image),
            (this.posts = data.data.details.posts),
            (this.likes = data.data.details.likes)
          );
        } else {
          return (
            (this.authenticated = false),
            (this.firstName = 'Login'),
            (this.lastName = 'Login'),
            (this.email = 'login'),
            (this.image = '../pictures/placeholder-image.png')
          );
        }
      })
      .catch(error => {
        if (error) {
          this.authenticated = false;
          console.log(error);
        }
      });
  }
  newuser(user) {
    user();
    this.authenticated = true;
  }
  login(login) {
    login();
    this.authenticated = true;
  }
  logout(logout) {
    this.authenticated = false;
    logout();
  }
  isAuthenticated() {
    return this.authenticated;
    //this.authenticated, this.firstName, this.lastName, this.email;
  }
}
export default new Auth();
