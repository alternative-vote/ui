const React = require('react');
const {render} = require('react-dom');
const {Tree} = require('nject');

const tree = new Tree();

tree
  // model
  .register('model', require('./model'))

  // services
  .register('authService', require('./services/authService.js'))

  // components
  .register('LoginForm', require('./components/loginForm.jsx'))

  // views
  .register('NoMatch', require('./views/noMatch.jsx'))
  .register('Login', require('./views/login.jsx'))
  .register('router', require('./router.jsx'));

const Router = tree.resolve('router');
render(<Router />, document.getElementById('app'));
