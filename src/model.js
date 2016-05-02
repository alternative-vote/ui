const Scheming = require('scheming');
const {Election, Account} = require('@alternativeVote/data-model');

const Types = Scheming.TYPES;

module.exports = () => {
  const AppModel = Scheming.create('AppModel', {
    authentication : {
      loggedIn  : Types.Boolean,
      authToken : Types.String,
      account   : Account,
    },
    myElections    : {
      loading   : Types.Boolean,
      elections : [Election],
    },
    editing        : {
      loading  : Types.Boolean,
      election : Election,
    },
    voting         : {
      loading  : Types.Boolean,
      election : Election,
    },
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
    myElections    : {
      loading   : false,
      elections : []
    },
    editing        : {
      loading  : false,
      election : null,
    },
    voting         : {
      loading  : false,
      election : null,
    },
    results        : {
      loading : false,
    },
  });
}