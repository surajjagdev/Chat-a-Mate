//front-end auth
import API from '../utils/api.js';
class Auth {
  constructor() {
    this.authenticated = this.checkAuth();
  }
  checkAuth() {
    API.checkauth()
      .then(data => {
        if (data.data.success === true) {
          return (this.authenticated = true);
        } else {
          return (this.authenticated = false);
        }
      })
      .catch(error => {
        if (error) {
          this.authenticated = false;
          console.log(error);
        }
      });
  }
  login(login) {
    login();
    this.checkAuth();
  }
  logout(logout) {
    this.authenticated = false;
    logout();
  }
  isAuthenticated() {
    return this.authenticated;
  }
}
export default new Auth();
