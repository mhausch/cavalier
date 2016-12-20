
const bcrypt = require('bcryptjs');
const constants = require('./constants.js');
const instanceIO = require('../../server/instance.js');
const r = require('rethinkdb');

// Prepare export
const user = exports = module.exports = {};

// set DB connection (promise)
user.db = instanceIO.getDatabase();

/**
 * usernameExist - check if username exist
 * @public
 * @param {string} username
 * @param {function} callback
 */
user.usernameExist = function (username, callback) {
    // promise on connection
    this.db.then((conn) => {
        // promise on the query, calling callback
        r.table(constants.tables.USERS).get(username).run(conn).then((cursor) => {
            callback(cursor);
        });
    }).error((err) => {
        console.log(err);
    });
};

/**
 * checkCredentials - Check username and password
 * @public
 * @param {string} username
 * @param {string} password
 * @return {Promise}
 */
user.checkCredentials = function (username, password) {
    return new Promise((resolve, reject) => {
        // Trim
        username.trim();
        password.trim();

        // Find User
        this.usernameExist(username, (tmpuser) => {
            if (!tmpuser) {
                reject(new Error('User not found'));
            }

            // async compare
            const bpromise = bcrypt.compare(password, tmpuser.password);

            // evaluate promise
            bpromise.then((response) => {
                if (response) {
                    resolve(tmpuser);
                } else {
                    reject(new Error('Password incorrect'));
                }
            }, (error) => {
                reject(new Error('Error'));
            });
        });
    });
};
