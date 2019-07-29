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
    this.profilepage = true;
    this.visitingpage = '';
    this.showPostsPublic = true;
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
  poststatus(cb) {
    let callbackobj = cb();
    this.posts = callbackobj.posts;
    this.likes = callbackobj.likes;
  }
  visitpage(cb) {
    //set profile page to false
    //set the visitingpage to url
    cb();
  }
  returnState() {
    if (this.authenticated === true) {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        user: this.user,
        likes: this.likes,
        posts: this.posts,
        profilepage: this.profilepage,
        visitingpage: this.visitingpage,
        showPostsPublic: this.showPostsPublic
      };
    }
  }
  isVistingAnotherPage() {
    if (this.visitingpage === '' && this.profilepage === true) {
      return false;
    } else {
      return true;
    }
  }
  pageVisit() {
    return this.visitingpage;
  }
  isAuthenticated() {
    return this.authenticated;
    //this.authenticated, this.firstName, this.lastName, this.email;
  }
}
export default new Auth();
