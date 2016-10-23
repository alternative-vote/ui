'use strict';
const Scheming = require('scheming');
const common   = require('./common');

const Voter = Scheming.create(`${common.NAMESPACE}Voter`, {
  id    : common.ID,
  email : common.STRING,
  name  : common.STRING,
}, common.OPTIONS);

const Account = Scheming.create(`${common.NAMESPACE}Account`, {
  id    : common.ID,
  type  : common.STRING,
  voter : Voter,
}, common.OPTIONS);

module.exports = { Voter, Account };