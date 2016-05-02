module.exports = (model) => {
  return {
    isLoggedIn : function () {
      return model.authentication.loggedIn;
    },

    login : function(username, password) {
      console.log('logging in');
      model.authentication.loggedIn = true;
    }
  }
}