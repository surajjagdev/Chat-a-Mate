import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Register from '../register/registerform';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Register} />
          <Route exact path="/test" component={Other} />
        </div>
      </Router>
    );
  }
}
const Other = () => {
  return <div>Hi</div>;
};

export default App;
