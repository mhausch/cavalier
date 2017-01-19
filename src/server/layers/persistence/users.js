'use strict';

const bcrypt = require('bcryptjs');
const r = require('rethinkdb');
const joi = require('joi');

const constants = require('./../../utils/constants.js');
const userSchema = require('./../objects/schemas/userSchema.js');
const RConnect = require('../../../server/utils/rethink_connect.js');

const User = require('./../objects/user.js');

/**
 * This Class represents Functions around Users Collection
 * specific Function on a Single User can be retrieved from
 * User class (not implemented)
 */
class Users {
    constructor() {
        // Setup Connector
        this.rconnect = new RConnect();
    }

    /**
     * Check user credentials based on username and password
     * @param {object} user - user that contains username and password
     */
    checkCredentials(user) {
        // trim spaces arround the username and password
        user.username.trim();
        user.password.trim();

        // Return the Promise
        return new Promise((resolve, reject) => {
            this.get(user.username)
            .then((dbUser) => {
                if (!dbUser) {
                    // we are done, because we got no user to compare with
                    reject(new Error('User not exists'));
                } else {
                    // compare password
                    bcrypt.compare(user.password, dbUser.password)
                    .then((response) => {
                        if (response) {
                            resolve(dbUser);
                        } else {
                            reject(new Error('Password/Username incorrect'));
                        }
                    })
                    // error on bcrypt compare password
                    .catch((error) => {
                        console.log(error);
                        reject(new Error('Error'));
                    });
                }
            })
            // error checking user existence
            .catch((error) => {
                console.log(error);
            });
        });
    }

    /**
     * Returns all Users in the Database
     * @returns {array} result - return all Users in the Database
     */
    getAll() {
        return new Promise((resolve, reject) => {
            this.rconnect.connect((connection) => {
                // promise on the query, calling callback
                r.table(constants.tables.USERS).run(connection)
                // promise returns
                .then((cursor) => {
                    const result = [];
                    cursor.each((err, row) => {
                        result.push(row);
                    });
                    connection.close();
                    resolve(result);
                })
                .catch((error) => {
                    connection.close();
                    reject(error);
                });
            });
        });
    }

    /**
     * Get one unique User by username
     * @param {string} username - Unique Username in the system
     * @returns {Promise<user, error>} A Promise that returns the user or an error
     */
    getByUsername(username) {
        // Convert to Uppercase always
        const tmpUsername = username.toUpperCase();

        // Return Promise
        return new Promise((resolve, reject) => {
            this.rconnect.connect((connection) => {
                // promise on the query, calling callback
                r.table(constants.tables.USERS).get(tmpUsername).run(connection)
                .then((cursor) => {
                    connection.close();
                    // no error and return user
                    if (cursor) {
                        resolve(cursor);
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    connection.close();
                    // error occured, we cant pass a user
                    reject(error);
                });
            });
        });
    }

    /**
     * Insert user to Database
     * @param {object} user - User Object
     */
    insert(user) {
        return new Promise((resolve, reject) => {
            const tmpUser = user;

            // conver username Uppercase
            tmpUser.username = user.username.toUpperCase();

            // encrypt password salt 10
            bcrypt.hash(user.password, 10)
            .then((hash) => {
                // new password is hashed
                tmpUser.password = hash;

                // establish connection
                this.rconnect.connect((connection) => {
                    r.table(constants.tables.USERS).insert(user).run(connection)
                    // operation callback
                    .then((cursor) => {
                        connection.close();
                        if (cursor.inserted === 1) {
                            resolve(user);
                        } else {
                            reject(new Error('User insertion failed'));
                        }
                    })
                    // db error
                    .catch((error) => {
                        connection.close();
                        reject(error);
                    });
                });
            })
            // error at hashing password
            .catch((error) => {
                console.log(error);
            });
        });
    }

    /**
     * Delete user from Database without checks!!!
     * Use Users.remove() to delete  Users!
     * @param {object} user - User Object
     */
    delete(user) {
        // Return new promise
        return new Promise((resolve, reject) => {
            // Wait for promise
            this.rconnect.connect((connection) => {
                // promise on the query, calling callback
                r.table(constants.tables.USERS).get(user.username).delete().run(connection)
                // promise returns
                .then((cursor) => {
                    connection.close();

                    if (cursor.deleted === 1) {
                        resolve(true);
                    } else {
                        reject(new Error(`User deletion failed: ${user.username}`));
                    }
                })
                .catch((error) => {
                    connection.close();
                    reject(error);
                });
            });
        });
    }
}

module.exports = Users;
