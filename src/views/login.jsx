const {withRouter} = require('react-router');
const React = require('react');

module.exports = (LoginForm, authService, model) => {
  return withRouter(React.createClass({
    getInitialState : function () {
      return {
        loggedIn : false
      }
    },

    componentDidMount : function () {
      this._unwatches = [
        model.authentication.watch('loggedIn', (isLoggedIn, wasLoggedIn) => {
          if (isLoggedIn && isLoggedIn != wasLoggedIn) {
            this.props.router.push('/elections');
          }
        })
      ];
    },

    componentWillUnmount : function () {
      for (const unwatch of this._unwatches) {
        unwatch();
      }
    },

    login : function (username, password) {
      authService.login(username, password)
    },

    getLoginState : function () {
      return authService.isLoggedIn() ? 'Logged in.' : 'NOT logged in.';
    },

    render : function () {
      return (
        <div>
          <LoginForm onSubmit={this.login}></LoginForm>

          <div>Current login state: {this.getLoginState()}</div>
        </div>
      )
    }
  }));
}