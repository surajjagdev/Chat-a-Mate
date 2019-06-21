import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';
import Register from '../register/registerform';
import ProtectedRoute from '../auth/protectroute.js';
import auth from '../auth/auth.js';
import API from '../utils/api.js';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Register} />
          <ProtectedRoute exact path="/test" component={Other} />
          <ProtectedRoute exact path="/profile" component={Test} />
          <Route path="*" component={() => '404 NOT FOUND!'} />
        </Switch>
      </Router>
    );
  }
}
const Other = () => {
  return (
    <div>
      Hi
      <Link to="/profile">
        <div>Profile {auth.isAuthenticated()}</div>
      </Link>
    </div>
  );
};
const Test = () => {
  return (
    <Link to="/test">
      <div>
        Test
        {auth.isAuthenticated()}
      </div>
    </Link>
  );
};

export default App;
