const bcrypt = require('bcryptjs');
const constants = require('./constants.js');
const instanceIO = require('../../server/instance.js');
const r = require('rethinkdb');

// Prepare export
const organizations = exports = module.exports = {};

// set DB connection (promise)
organizations.db = instanceIO.getDatabase();

