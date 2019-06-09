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
  }
};
