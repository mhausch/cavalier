'use strict';

const bcrypt = require('bcryptjs');
const r = require('rethinkdb');
const joi = require('joi');

const constants = require('./../../utils/constants.js');
const userSchema = require('./../objects/schemas/userSchema.js');
const RConnect = require('../../../server/utils/rethink_connect.js');

const User = require('./../objects/user.js');
const exceptions = require('./../../utils/exception');

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
        // Database call
        const getUser = (tempUsername) => {
            const c = this.rconnect.connect();
            c.then((connection) => {
                // return database Promise
                return r.table(constants.tables.USERS).get(tempUsername).run(connection);
            })
            .catch((error) => {});
        };

        // Return Promise
        return new Promise((resolve, reject) => {

            const c = this.rconnect.connect();
            c.then((connection) => {

                console.log('lalalal');
                // return database Promise
                const quer = r.table(constants.tables.USERS).get(username).run(connection);
                resolve(quer);
            })
            .catch((error) => {
                console.log(error);
            });

           // getUser(username.toUpperCase())
            // database result
            // .then((cursor) => {
            //     // If user exist, return the cursor
            //     if (cursor) {
            //         resolve(cursor);
            //     // nothing found, return null
            //     } else {
            //         reject(null);
            //     }
            // })
            // .catch((error) => {
            //     reject(error);
            // });
        });
    }

    /**
     * Insert user to Database
     * @param {object} user - User Object
     */
    insert(user) {
        return new Promise((resolve, reject) => {
            // clean up
            const cleanUpUser = (userInsert, hash) => {
                const newUser = userInsert;
                newUser.username = userInsert.username.toUpperCase();
                newUser.password = hash;
                return newUser;
            };

            // Insert operation
            const insert = (userInsert) => {
                this.rconnect.connect((connection) => {
                    return r.table(constants.tables.USERS).insert(userInsert).run(connection);
                });
            };

            // encipher user password
            bcrypt.hash(user.password, 10)
            // Receive the hash
            .then((hash) => {
                return insert(cleanUpUser(user, hash));
            })
            // Receive the database return code
            .then((cursor) => {

                // If the db inserted the object, everthing is fine
                if (cursor.inserted === 1) {
                    resolve(user);
                // Error occured
                } else {
                    reject(new exceptions.UserInsertionError({ v1: user.username }));
                }
            })
            // error at hash or some other error occured
            .catch((error) => {
                reject(error);
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
