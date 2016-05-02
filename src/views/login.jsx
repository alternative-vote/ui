const React = require('react');

module.exports = (LoginForm, authService, model) => {
  return React.createClass({
    getInitialState : function() {
      return {
        loggedIn : false
      }
    },

    componentDidMount : function() {
      this._unwatches = [
        model.authentication.watch('loggedIn', (isLoggedIn) => {
          //this.setState({loggedIn : isLoggedIn});
          this.forceUpdate();
        })
      ];
    },

    componentWillUnmount : function() {
      for(const unwatch of this._unwatches) {
        unwatch();
      }
    },

    login : function(username, password) {
      authService.login(username, password)
    },

    getLoginState : function() {
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
  });
}