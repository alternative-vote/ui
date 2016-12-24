import React, { Component } from 'react';
import DevTools from 'mobx-react-devtools';
import { Router, Route, Link, browserHistory } from 'react-router'

import NotFoundPage from './pages/notFound'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import VotePage from './pages/vote'
import ElectionAdminPage from './pages/electionAdmin'

class App extends Component {
  render() {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/"  component={HomePage}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/elections/:electionId/admin" component={ElectionAdminPage}/>
          <Route path="/elections/:electionId/vote" component={VotePage}/>
          <Route path="*" component={NotFoundPage}/>
        </Router>
        <DevTools />
      </div>
    );
  }
};

export default App;
