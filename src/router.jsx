'use strict';
const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router')

module.exports = (NoMatch, Login, authService) => {
  const Placeholder = React.createClass({
    render : () => {
      return (
        <div>Hello world</div>
      )
    }
  });

  const isAuth = (nextState, replace) => {
    if (!authService.isLoggedIn()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }

  return React.createClass({
    render : function () {
      return (
        <Router history={browserHistory}>
          <Route path="/" component={Placeholder} onEnter={isAuth} >

          </Route>
          <Route path="/login" component={Login}>
          </Route>
          <Route path="*" component={NoMatch}/>
        </Router>
      )
    }
  });
}