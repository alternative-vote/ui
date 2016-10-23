'use strict';
const Q = require('q');

module.exports = (state, mockData) => {
  const mockElections = mockData.myElections();

  return {
    _checkAuth : function () {

    },

    request : function () {

    },

    createElection : function () {
      return Q(mockData.createElection()).then((election) => {
        mockElections.push(election);
        return election;
      })
    },

    getMyElections : function () {
      return Q(mockElections).then((elections) => {
        state.myElections = elections;
        return elections;
      });
    },

    getElection : function(id) {
      const match = mockElections.find((election) => {
        return election.id == id;
      });

      return Q(match);
    },
  }
}
