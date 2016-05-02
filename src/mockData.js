const {Election} = require('@alternativeVote/data-model');

let id = 0;

module.exports = () => {
  return {
    myElections : function () {
      return [
        new Election({
          id   : id++,
          name : 'High school superlatives'
        }),
        new Election({
          id   : id++,
          name : 'Coolest Animals'
        }),
        new Election({
          id   : id++,
          name : 'Favorite Cities'
        })
      ]
    },

    createElection : function () {
      return new Election({
        id : id++
      });
    },
  }
}
