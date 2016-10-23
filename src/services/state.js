const Scheming = require('scheming');

const Types = Scheming.TYPES;

module.exports = (Models) => {
  const {Election, Account} = Models;

  const AppModel = Scheming.create('AppModel', {
    authentication : {
      loggedIn  : Types.Boolean,
      authToken : Types.String,
      account   : Account,
    },
    myElections    : [Election],
    editing        : Election,
    voting         : Election,
    results        : {
      loading : Types.Boolean,
    }
  }, { seal : true });

  return new AppModel({
    authentication : {
      loggedIn  : false,
      authToken : null,
      account   : null,
    },
    myElections     : [],
    editing        : null,
    voting         : null,
    results        : {
      loading : false,
    },
  });
}
