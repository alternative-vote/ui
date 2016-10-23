const {Election} = require('../models');

let id = 0;

module.exports = () => {
  return {
    myElections : function () {
      return [
        new Election({
          id   : id++,
          name : 'High school superlatives',
          description : 'The coolest kids in high school',
          candidates : [
            {name : 'Mark Whalberg',
            description: 'a dude'}
          ]
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
