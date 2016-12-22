
const bcrypt = require('bcryptjs');
const r = require('rethinkdb');
const joi = require('joi');

const constants = require('./constants.js');
const instanceIO = require('../../server/instance.js');
const userSchema = require('../../server/schemas/userSchema.js');

// Prepare export
const users = exports = module.exports = {};

// set DB connection (promise)
users.db = instanceIO.getDatabase();

/**
 * usernameExist - check if username exist
 * @public
 * @param {string} username
 * @param {function} callback
 */
users.usernameExist = function (username, callback) {
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
users.checkCredentials = function (username, password) {
    return new Promise((resolve, reject) => {
        // Trim
        username.trim();
        password.trim();

        // always save uppercase
        const userUpper = username.toUpperCase();

        // Find User
        this.usernameExist(userUpper, (tmpuser) => {
            if (!tmpuser) {
                // we are done, because we got no user to compare with
                reject(new Error('User not exists'));
            } else {
                // async compare
                const bpromise = bcrypt.compare(password, tmpuser.password);

                // evaluate promise
                bpromise.then((response) => {
                    if (response) {
                        resolve(tmpuser);
                    } else {
                        reject(new Error('Password/Username incorrect'));
                    }
                }, (error) => {
                    reject(new Error('Error'));
                });
            }
        });
    });
};

/**
 * Add - Add User to Database
 * @public
 * @param {Object} user
 * @return {Promise}
 */
users.add = function (user) {
    return new Promise((resolve, reject) => {

        // validate
        joi.validate(user, userSchema, (err, value) => {
            if (err === null) {
                // everthing is fine
            } else {
                // some validation failed
                reject(new Error('validation failed'));
                return;
            }
        });

        this.usernameExist(user.username, (tmpuser) => {
            let use = user;

            // convert to uppercase
            use.username = use.username.toUpperCase();

            // if the user alrready in DB, we are done here
            if (tmpuser) {
                reject(new Error('User already exists'));
                return;
            }

            // retrieve promise from encryption
            const promise = bcrypt.hash(user.password, 10);

            // evaluate promise
            promise.then((hash) => {
                // set hashed password
                use.password = hash;

                this.db.then((conn) => {
                    // promise on the query, calling callback
                    r.table(constants.tables.USERS).insert(use).run(conn)
                    // promise returns
                    .then((cursor) => {
                        if (cursor.inserted === 1) {
                            resolve(use);
                        } else {
                            reject(new Error('User insertion failed'));
                        }
                    });
                }).error((err) => {
                    reject(err);
                });
            }, (error) => {
                reject(new Error('Cant encrypt password'));
            });
        });
    });
};

/**
 * Delete - Delete User from DB
 * @public
 * @param {Object} user
 * @return {Promise}
 */
users.delete = function (username) {
    // Return new promise
    return new Promise((resolve, reject) => {
        // always save uppercase
        const userUpper = username.toUpperCase();

        // Wait for promise
        this.db.then((conn) => {
            // promise on the query, calling callback
            r.table(constants.tables.USERS).get(userUpper).delete().run(conn)
            // promise returns
            .then((cursor) => {
                if (cursor.deleted === 1) {
                    resolve(true);
                } else {
                    reject(new Error('User deletion failed: ' + userUpper));
                }
            });
        }).error((err) => {
            reject(err);
        });
    });
};