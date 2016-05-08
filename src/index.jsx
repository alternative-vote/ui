const React = require('react');
const {render} = require('react-dom');
const {Tree} = require('nject');

const tree = new Tree();

tree
  .register('mockData', require('./mockData.js'))

  // model
  .register('model', require('./model'))

  // services
  .register('authService', require('./services/authService.js'))
  .register('electionService', require('./services/electionService.js'))
  .register('routes', require('./services/routes.js'))

  // components
  .register({
    LoginForm      : require('./components/loginForm.jsx'),
    DatetimePicker : require('./components/datetimePicker.jsx'),
  }, { aggregateOn : 'components' })

  // views
  .register({
    EditLayout     : require('./views/elections/admin/editLayout.jsx'),
    EditProperties : require('./views/elections/admin/editProperties.jsx'),
    EditCandidates : require('./views/elections/admin/editCandidates.jsx'),
    EditCategories : require('./views/elections/admin/editCategories.jsx'),
    EditVoters     : require('./views/elections/admin/editVoters.jsx'),
    EditSummary    : require('./views/elections/admin/editSummary.jsx'),
    NoMatch        : require('./views/noMatch.jsx'),
    Login          : require('./views/login.jsx'),
    MyElections    : require('./views/elections/admin/myElections.jsx'),

    Test    : require('./views/test.jsx'),
  }, { aggregateOn : 'views' })

  .register('App', require('./app.jsx'));

const App = tree.resolve('App');
render(<App />, document.getElementById('app'));
