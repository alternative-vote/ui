'use strict';
const {Election} = require('@alternativeVote/data-model');
const Q = require('q');

module.exports = (model, mockData) => {
  return {
    _checkAuth : function () {

    },

    request : function () {

    },

    createElection : function () {
      return Q(mockData.createElection()).then((election) => {
        model.myElections.push(election);
        return election;
      })
    },

    getMyElections : function () {
      let mockElections = model.myElections
      if(mockElections.length == 0) {
        mockElections = mockData.myElections();
      }
      return Q(mockElections).then((elections) => {
        model.myElections = elections;
        return elections;
      });
    },
  }
}