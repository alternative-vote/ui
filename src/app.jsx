'use strict';
const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router')

module.exports = (views, authService) => {

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
          <Route path="/" component={views.MyElections} onEnter={isAuth}>
          </Route>
          <Route path="/elections/:id/configure" component={views.EditLayout}>
            <Route path="properties" component={views.EditProperties}></Route>
            <Route path="candidates"component={views.EditCandidates}></Route>
            <Route path="categories" component={views.EditCategories}></Route>
            <Route path="voters" component={views.EditVoters}></Route>
            <Route path="summary" component={views.EditSummary}></Route>
          </Route>
          <Route path=":id/vote">
            <Route path=":category"></Route>
            <Route path="summary"></Route>
          </Route>
          <Route path=":id/results"></Route>
          <Route path="/login" component={views.Login}>
          </Route>
          <Route path="/test" component={views.Test}/>
          <Route path="*" component={views.NoMatch}/>
        </Router>
      )
    }
  });
}