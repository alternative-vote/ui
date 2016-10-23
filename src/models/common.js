'use strict';
const Scheming  = require('scheming');
const NAMESPACE = 'AlternativeVote'
const OPTIONS   = { seal : true, strict : false };

const ID = {
  type    : Scheming.TYPES.String,
  default : '',
}

const STRING = {
  type    : Scheming.TYPES.String,
  default : '',
}

module.exports = {
  NAMESPACE, OPTIONS, ID, STRING
}