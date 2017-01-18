
const bcrypt = require('bcryptjs');
const r = require('rethinkdb');
const joi = require('joi');

const constants = require('./constants.js');
const instanceIO = require('../../server/instance.js');
const userSchema = require('../../server/schemas/userSchema.js');
const RConnect = require('../../server/utils/rethink_connect.js');



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
     * Add a new User to Database, the user will be validated
     * @param {object} user - User Object
     */
    add(user) {
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

            this.exists(user.username)
            .then((dbUser) => {
                // if the user alrready in DB, we are done here
                if (dbUser) {
                    reject(new Error('User already exists'));
                    return;
                }

                // conver username Uppercase
                user.toUpperCase();

                // encrypt password salt 10
                bcrypt.hash(user.password, 10)
                .then((hash) => {
                    const crypUser = user;
                    // new password is hashed
                    crypUser.password = hash;

                    // insert user to the DB
                    this._insert(crypUser)
                    // evaluate cursor
                    .then((cursor) => {
                        if (cursor.inserted === 1) {
                            resolve(user);
                        } else {
                            reject(new Error('User insertion failed'));
                        }
                    })
                    // error on DB insert
                    .catch((error) => {
                        reject(error);
                    });
                })
                // error at hashing password
                .catch((error) => {
                    console.log(error);
                });
            })
            // error on check if user already exists
            .catch((error) => {
                console.log(error);
            });
        });
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
            this.exists(user.name)
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
     * Check if User exists in the Database by username (primary key)
     * @param {string} username - Unique Username in the system
     * @return {Promise<username, error>} A Promise that
     */
    exists(username) {
        // Convert to Uppercase always
        username.toUpperCase();

        // Return Promise
        return new Promise((resolve, reject) => {
            this.rconnect.connect((connection) => {
                // promise on the query, calling callback
                r.table(constants.tables.USERS).get(username).run(connection)
                .then((cursor) => {
                    // no error and return user
                    if (cursor) {
                        resolve(cursor);
                    } else {
                        resolve(null);
                    }

                    // close connection
                    connection.close();
                })
                .catch((error) => {
                    // error occured, we cant pass a user
                    reject(error);
                    connection.close();
                });
            });
        });
    }

    /**
     * Insert user to Database without checks!!!
     * Use Users.add() to insert new Users!
     * @param {object} user - User Object
     */
    _insert(user) {
        return new Promise((resolve, reject) => {
            // establish connection
            this.rconnect.connect((connection) => {
                r.table(constants.tables.USERS).insert(user).run(connection)
                // operation callback
                .then((cursor) => {
                    if (cursor.inserted === 1) {
                        resolve(user);
                    } else {
                        reject(new Error('User insertion failed'));
                    }
                })
                // db error
                .catch((error) => {
                    reject(error);
                });
            });
        });
    }
}

module.exports = Users;

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
