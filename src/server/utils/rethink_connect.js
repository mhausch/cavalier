'use strict';

const r = require('rethinkdb');
const instanceIO = require('./../instance.js');
const exception = require('./exception');

// Export
const rconnect = exports = module.exports = {};

// connection wrapper
rconnect.connect = () => r.connect(instanceIO.getRethinkConfig());
