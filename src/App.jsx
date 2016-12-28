import React, { Component } from 'react';
import DevTools from 'mobx-react-devtools';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Layout from './pages/layout'
import NotFoundPage from './pages/notFound'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import VotePage from './pages/vote'
import ElectionAdminPage from './pages/electionAdmin'

import auth from './services/auth'

require('./style/index.scss') 

class App extends Component {
  checkAuth(nextState, replace) {
    if (!auth.isLoggedIn()) {
      replace("/login")
    }
  }

  render() {
    return (
      <div className="full-height">
        <Router history={browserHistory}>
          <Route path="/login" component={LoginPage}/>
          <Route path="/" component={Layout} onEnter={this.checkAuth}>
            <IndexRoute  component={HomePage}/>
            <Route path="/elections/:electionId/admin" component={ElectionAdminPage}/>
          </Route>
          <Route path="/vote/:hash" onEnter={VotePage.fromHash}/>
          <Route path="/elections/:electionId/vote" component={VotePage}/>
          <Route path="*" component={NotFoundPage}/>
        </Router>
        <DevTools />
      </div>
    );
  }
};

export default App;
