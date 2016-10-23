'use strict';
const Scheming = require('scheming');
const common   = require('./common');
const people   = require('./people');

const Types = Scheming.TYPES;
const Voter = people.Voter;

const START_END_DATE = {
  type    : {
    manual : {
      type    : Types.Boolean,
      default : true
    },
    date   : {
      type    : Types.Date,
      default : () => {
        return Date.now();
      }
    }
  },
  default : {}
}

const STATUSES = {
  EDITING   : 'editing',
  ACTIVE    : 'active',
  COMPLETED : 'completed',
}

const STATUS = {
  type     : Types.String,
  default  : STATUSES.EDITING,
  validate : (value) => {
    for (const status of STATUSES) {
      if (value === status) {
        return true;
      }
    }

    return `${value} is not a valid election status.`
  }
}

const ROLE = {
  isPublic : {
    type    : Types.Boolean,
    default : false
  },
  members  : {
    type    : [Voter],
    default : []
  }
}

const ELECTION_ROLES = {
  type    : {
    viewers        : ROLE,
    voters         : ROLE,
    administrators : ROLE,
    owners         : ROLE,
  },
  default : {}
}

const Candidate = Scheming.create(`${common.NAMESPACE}Candidate`, {
  id          : common.ID,
  name        : common.STRING,
  description : common.STRING,
  members     : {
    type    : [Voter],
    default : []
  }
}, common.OPTIONS);

const Ballot = Scheming.create(`${common.NAMESPACE}Ballot`, {
  id    : common.ID,
  voter : Voter,
  votes : {
    type    : [Candidate],
    default : [],
  }
}, common.OPTIONS);

const Election    = Scheming.create(`${common.NAMESPACE}Election`, {
  id            : common.ID,
  name          : common.STRING,
  description   : common.STRING,
  status        : STATUS,
  start         : START_END_DATE,
  end           : START_END_DATE,
  roles         : ELECTION_ROLES,
  candidates    : {
    type    : [Candidate],
    default : []
  },
  ballots    : {
    type    : [Ballot],
    default : [],
  }
}, common.OPTIONS);
Election.STATUSES = STATUSES;

module.exports = { Election, Ballot, Candidate, }
