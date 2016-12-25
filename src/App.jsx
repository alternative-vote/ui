import React, { Component } from 'react';
import DevTools from 'mobx-react-devtools';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import NotFoundPage from './pages/notFound'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import VotePage from './pages/vote'
import ElectionAdminPage from './pages/electionAdmin'

require('./style/index.scss') 

class App extends Component {
  render() {
    return (
      <div className="full-height">
        <Router history={browserHistory}>
          <Route path="/login" component={LoginPage}/>
          <Route path="/">
            <IndexRoute  component={HomePage}/>
            <Route path="/elections/:electionId/admin" component={ElectionAdminPage}/>
            <Route path="/elections/:electionId/vote" component={VotePage}/>
          </Route>
          <Route path="*" component={NotFoundPage}/>
        </Router>
        <DevTools />
      </div>
    );
  }
};

export default App;
