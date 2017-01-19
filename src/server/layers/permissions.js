'use strict';

const r = require('rethinkdb');
const joi = require('joi');

const constants = require('./constants.js');
const RConnect = require('../../server/utils/rethink_connect.js');

class Permissions {
    constructor(user) {
        this._user = user;
    }

    addRole(opts) {
        return new Promise((resolve, reject) => {

        });
    }

}

module.exports = Permissions;
