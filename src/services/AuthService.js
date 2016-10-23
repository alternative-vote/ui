module.exports = (state) => {
  return {
    isLoggedIn : function () {
      return state.authentication.loggedIn;
    },

    login : function(username, password) { 
      console.log('logging in');
      state.authentication.loggedIn = true;
      state.authentication.authToken = 'abcdefg';
    }
  }
}
