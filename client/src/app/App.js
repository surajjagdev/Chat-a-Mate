import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Register from '../register/registerform';
import ProtectedRoute from '../auth/protectroute.js';
import auth from '../auth/auth.js';
import Profile from '../profile/profile.js';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Register} />
          <ProtectedRoute exact path="/test" component={Other} />
          <ProtectedRoute exact path="/profile" component={Profile} />
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

export default App;
