const React = require('react');

module.exports = () => {
  return React.createClass({
    propTypes : {
      onSubmit : React.PropTypes.func.isRequired
    },

    getInitialState : function () {
      return {
        username     : '',
        password     : '',
        errorMessage : '',
      }
    },

    onChangeUsername : function (e) {
      this.setState({ username : e.target.value });
    },

    onChangePassword : function (e) {
      this.setState({ password : e.target.value });
    },

    onSubmit : function (e) {
      e.preventDefault();
      console.log('submitted!', this.state);
      const {username, password} = this.state;
      this.props.onSubmit(username, password)
    },

    renderError : function() {
      if(this.state.errorMessage === '') {
        return null;
      }

      return (
        <div className="error">{this.stateerrorMessage}</div>
      )
    },

    render : function () {
      return (
        <div>
          <form onSubmit={this.onSubmit}>
            <input type="text" placeholder="username"
                   value={this.state.username} onChange={this.onChangeUsername}/>
            <input type="password" placeholder="password"
                   value={this.state.password} onChange={this.onChangePassword}/>
            {this.renderError()}
            <input type="submit" value="login"/>
          </form>
        </div>
      )
    }
  });
}