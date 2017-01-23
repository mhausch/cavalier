'use strict';

const joi = require('joi');
const bcrypt = require('bcryptjs');

const Users = require('./../persistence/users');
const userSchema = require('./schemas/userSchema');
const exceptions = require('./../../utils/exception');

class User {
    /**
     * Constructor tht accepts the userdata
     * @param {Object} data - Contains data of the user
     */
    constructor(data) {
        // keep the given data in member
        this._constructorData = data;

        // persistence service
        this._persistence = new Users();

        // No real data provided
        this._plain = {};
    }

    /**
     * Check the given password against the user password
     * @param {String} password - String that contains the password
     * @returns {Boolean} true = password correct, false = password incorrect
     */
    checkPassword(password) {
        // Return the Promise
        return new Promise((resolve, reject) => {
            // check that Instance is initialized
            if (!this.isInitialized()) {
                reject(new exceptions.NoInitializeCallError({ v1: 'User' }));
            }

            // check that user ist not fictive
            if (!this._isPersistent) {
                reject(new exceptions.UserNotExistError({ v1: this._plain.username }));
            }

            // trim spaces password
            password.trim();

            // compare the plain password and the crypted pw
            bcrypt.compare(password, this._plain.password)
            .then((response) => {
                if (response) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            // error on bcrypt compare password
            .catch((error) => {
                console.log(error);
                reject(new Error('Error'));
            });
        });
    }

    /**
     * Check if User exists in the Database by username (primary key)
     * @param {string} username - Unique Username in the system
     * @returns {Promise<Boolean, error>} A Promise that returns the false or true or the error
     */
    exists() {
        // Return Promise
        return new Promise((resolve, reject) => {
            // check that Instance is initialized
            if (!this.isInitialized()) {
                reject(new exceptions.NoInitializeCallError({ v1: 'User' }));
            }

            if (!this._isPersistent) {
                resolve(true);
                return;
            }

            this._persistence.getByUsername(this._constructorData.username)
            // Query done
            .then((user) => {
                // when user found return true
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            // error occure on get user by username
            .catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Returns the username
     * @returns {String} username
     */
    getUsername() {
        return this._plain.username;
    }

    /**
     * initialize the Instance from DB or from constructor given data
     * @returns {Promise<Boolean, error>}
     */
    initialize() {
        return new Promise((resolve, reject) => {
            // real user or fictive?
            this._persistence.getByUsername(this._constructorData.username)
            .then((user) => {
                if (user) {
                    this._plain = user;
                    this._isPersistent = true;
                } else {
                    this._plain.username = this._constructorData.username;
                    this._plain.password = this._constructorData.password;
                    this._plain.email = this._constructorData.email;
                    this._plain.firstname = this._constructorData.firstname;
                    this._plain.middlename = this._constructorData.middlename;
                    this._plain.lastname = this._constructorData.lastname;
                    this._plain.birthdate = this._constructorData.birthdate;
                }
                this._initialized = true;
                resolve(true);
            })
            .catch((error) => {
                this._isPersistent = false;
                reject(error);
            });
        });
    }

    /**
     * Return true if the Instance is initialized, else false
     * @returns {Boolean}
     */
    isInitialized() {
        return this._initialized;
    }

    /**
     * Return true if the User exists on the Database
     * @returns {Boolean}
     */
    isPersistent() {
        // check that Instance is initialized
        if (!this.isInitialized()) {
            throw new exceptions.NoInitializeCallError({ v1: 'User' });
        }

        // return persistency
        return this._isPersistent;
    }

    /**
     * Remove User from database
     * @returns {Promise<Boolean, error>} Return a promise, if user removed resolve
     * will be true, else error
     */
    remove() {
        return new Promise((resolve, reject) => {
            // check that Instance is initialized
            if (!this.isInitialized()) {
                reject(new Error('User Instance is not initialized, call initialize()'));
            }
        });
    }

    /**
     * Save User to database
     * @returns {Promise<Boolean, error>} Return a promise, if user saved resolve
     * will be true, else error
     */
    save() {
        return new Promise((resolve, reject) => {
            // check that Instance is initialized
            if (!this.isInitialized()) {
                reject(new exceptions.NoInitializeCallError({ v1: 'User' }));
            }

            Object.keys(this._plain).forEach(key => this._plain[key] === undefined ? delete this._plain[key] : '');

            // Validate the user object
            try {
                this.validate();
            } catch (error) {
                reject(error);
            }

        if (this._isPersistent) {
            // update to database
            this._persistence.add(this._plain)
            // user returns, means everthing is fine
            .then((user) => {
                if (user) {
                    this._isPersistent = true;
                    // resolve(true);
                }
            })
            // error occured while saving
            .catch((error) => {
                // reject(error);
            });
        } else {
            // save new to database
            this._persistence.insert(this._plain)
            // user returns, means everthing is fine
            .then((user) => {
                if (user) {
                    this._isPersistent = true;
                    // resolve(true);
                }
            })
            // error occured while saving
            .catch((error) => {
                // reject(error);
            });
        }
        });
    }

    validate() {
        // validate
        joi.validate(this._plain, userSchema, (err, value) => {
            if (err === null) {
                // everthing is fine
            } else {
                // some validation failed
                throw new Error('validation failed');
            }
        });
    }
}

module.exports = User;
