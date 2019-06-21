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
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Register} />
          <ProtectedRoute exact path="/profile" component={Other} />
          <Route path="*" component={() => '404 NOT FOUND!'} />
        </Switch>
      </Router>
    );
  }
}
const Other = () => {
  return <div>Hi</div>;
};

export default App;
