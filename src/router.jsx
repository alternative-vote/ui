'use strict';
const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router')

module.exports = (NoMatch, Login, MyElections, authService) => {

  const isAuth = (nextState, replace) => {
    if (!authService.isLoggedIn()) {
      replace({
        pathname : '/login',
        state    : { nextPathname : nextState.location.pathname }
      });
    }
  }

  return React.createClass({
    render : function () {
      return (
        <Router history={browserHistory}>
          <Route path="/elections" component={MyElections} onEnter={isAuth}>
            <Route path=":id/configure">
              <Route path="properties"></Route>
              <Route path="candidates"></Route>
              <Route path="categories"></Route>
              <Route path="summary"></Route>
            </Route>
            <Route path=":id/vote">
              <Route path=":category"></Route>
              <Route path="summary"></Route>
            </Route>
            <Route path=":id/results"></Route>
          </Route>
          <Route path="/login" component={Login}>
          </Route>
          <Route path="*" component={NoMatch}/>
        </Router>
      )
    }
  });
}