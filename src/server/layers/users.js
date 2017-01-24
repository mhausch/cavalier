'use strict';

const bcrypt = require('bcryptjs');
const _ = require('lodash');

// Export
const users = exports = module.exports = {};
users.db = {};

// user.insert = () => {
//     users.getUser()
// }
users.clean = (user) => {
    let output = users.removeUndefinedKeys(user);
    output = users.trimUsernamePassword(output);
    output = users.toUpper(output, ['username']);
    return output;
};

users.removeUndefinedKeys = function (user) {
    return _.omitBy(user, _.isNil);
};

/**
 * Trim username and password
 * @param {object} user - Object contains user data
 */
users.trimUsernamePassword = (user) => {
    const outUser = _.clone(user);
    outUser.username = _.trim(outUser.username);
    outUser.password = _.trim(outUser.password);

    return outUser;
};

/**
 * Converts value of an Object to upper case
 * @param {object} user - Object contains user data
 * @param {array} upperKeys - Arrays of Key to identify which values should be Upper
 * @returns {object} output user object
 */
users.toUpper = (user, upperKeys) => {
    const outUser = _.mapValues(user, (value, key) => {
        return _.includes(upperKeys, key) ? value.toUpperCase() : value;
    });
    return outUser;
};

/**
 * Converts value of an Object to lower case
 * @param {object} user - Object contains user data
 * @param {array} lowerKeys - Arrays of Key to identify which values should be Upper
 * @returns {object} output user object
 */
users.toLower = (user, lowerKeys) => {
    const outUser = _.mapValues(user, (value, key) => {
        return _.includes(lowerKeys, key) ? value.toLowerCase() : value;
    });
    return outUser;
};


users.cryptPassword = function (password) {
    return bcrypt.hash(password, 10);
};

users.setTimeout5 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('5 seconds');
        }, 5000);
    });
};

users.setTimeout2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('2 seconds');
        }, 2000);
    });
};



// users.getUser = (username) => {

// };

// users.getUsers = (query) => {

// };
