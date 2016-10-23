'use strict';
const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router')

require('./styles/index.sass')

module.exports = (views, routes, authService) => {

  const isAuth = (nextState, replace) => {
    // if (!authService.isLoggedIn()) {
    //   replace({
    //     pathname : '/login',
    //     state    : { nextPathname : nextState.location.pathname }
    //   });
    // }
  }

  console.log(routes.home());

  return React.createClass({
    render : function () {
      return (
        <Router history={browserHistory}>
          <Route path={routes.home()} component={views.MyElections} onEnter={isAuth}/>
          <Route path={routes.editElection()} component={views.EditElection}/>
          <Route path="/elections/:id/vote">
            <Route path=":category"></Route>
            <Route path="summary"></Route>
          </Route>
          <Route path="/elections/:id/results"/>
          <Route path="/login" component={views.Login}/>
          <Route path="/test" component={views.Test}/>
          <Route path="*" component={views.NoMatch}/>
        </Router>
      )
    }
  });
}
