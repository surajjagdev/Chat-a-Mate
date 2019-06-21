//front-end auth
import API from '../utils/api.js';
class Auth {
  constructor() {
    this.authenticated = false;
  }
  login(login) {
    login();
    this.authenticated = true;
  }
  checkAuth(check) {
    check();
    this.authenticated = true;
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
