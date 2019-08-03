import axios from 'axios';
export default {
  //find all employees
  allusers: () => {
    return axios.get('/api/users');
  },
  //create a new user
  newuser: data => {
    return axios.post('/api/newuser', data);
  },
  test: () => {
    return axios.get('/api/newuser/test');
  },
  login: data => {
    return axios.post('/api/user/login', data);
  },
  logout: () => {
    return axios.get('/api/user/logout');
  },
  checkauth: () => {
    return axios.get('/api/auth/user/authcheck');
  },
  poststatus: data => {
    return axios.post('/api/auth/user/newpost', data);
  },
  updateimage: data => {
    return axios.put('/api/user/update', {
      params: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      }
    });
  },
  getPostsByFriends: data => {
    return axios.get('/api/user/posts/allfriends', {
      params: {
        userId: data.userId,
        email: data.email
      }
    });
  },
  getAllPostsFeed: data => {
    return axios.get('/api/auth/user/posts', {
      params: {
        user: data.user,
        public: data.public
      }
    });
  },
  intialPosts: () => {
    return axios.get('/api/user/allposts');
  }
};
