'use strict';

const util = require('util');
const instanceIO = require('./../instance');

/*
 * =========================================================================== *
 * Messages                                                                    *
 * =========================================================================== *
 */
const exceptions = {
    // Codes 1xxx
    NoInitializeCallError: {
        level: 'error',
        code: 1001,
        message: '%s-Instance is not initialized, call initialize()',
    },

    // Codes 2xxx
    DBConnectionError: {
        level: 'error',
        code: 2200,
        message: 'Failed to conenct Database %s',
    },

    // Codes 3xxx
    UserNotExistError: {
        level: 'info',
        code: 3001,
        message: 'The User %s dont exists',
    },

    InvalidCredentialError: {
        level: 'info',
        code: 3002,
        message: 'The User and Password is invalid',
    },
};

/*
 * =========================================================================== *
 * Abstract definition                                                         *
 * =========================================================================== *
 */
/**
 *
 */
class AbstractError extends Error {
    constructor(msg) {
        // call super
        super(msg);

        // set Logger
        this.logger = instanceIO.getLogger();
        this.message = '';

        // Stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(msg)).stack;
        }
    }

    getMessage() {
        if (this.v1 && this.v2 && this.v3 && this.v4) {
            return util.format(this.message, this.v1, this.v2, this.v3, this.v4);
        } else if (this.v1 && this.v2 && this.v3) {
            return util.format(this.message, this.v1, this.v2, this.v3);
        } else if (this.v1 && this.v2) {
            return util.format(this.message, this.v1, this.v2);
        } else if (this.v1) {
            return util.format(this.message, this.v1);
        } else {
            return this.message;
        }
    }

    getStack() {
        return this.stack;
    }

    /**
     * Call logging library
     */
    log() {
        this.logger.log(this.level, this.message);
    }

    printConsole() {
        console.log(this.getMessage());
    }
}

/*
 * =========================================================================== *
 * General Errors - Code 1xxx                                                  *
 * =========================================================================== *
 */
class NoInitializeCallError extends AbstractError {
    constructor(opts) {
        super('NoInitializeCallError');

        // read default properties
        const excp = exceptions[this.constructor.name];

        // change props
        this.message = excp.message || opts.message;
        this.level = excp.level || opts.level;
        this.v1 = excp.v1 || opts.v1;
        this.v2 = excp.v2 || opts.v2;
        this.v3 = excp.v3 || opts.v3;
        this.v4 = excp.v4 || opts.v4;

        this.message = this.getMessage();

        // code cant be changed
        this.code = excp.code;

        // stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
    }

    getName() {
        return this.constructor.name;
    }
}

/*
 * =========================================================================== *
 * Technical Errors - Code 2xxx                                                *
 * =========================================================================== *
 */

class DBConnectionError extends AbstractError {
    constructor(opts) {
        super('DBConnectionError');

        // read default properties
        const excp = exceptions[this.constructor.name];

        // change props
        this.message = excp.message || opts.message;
        this.level = excp.level || opts.level;
        this.v1 = excp.v1 || opts.v1;
        this.v2 = excp.v2 || opts.v2;
        this.v3 = excp.v3 || opts.v3;
        this.v4 = excp.v4 || opts.v4;

        this.message = this.getMessage();

        // code cant be changed
        this.code = excp.code;

        // stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
    }

    getName() {
        return this.constructor.name;
    }
}

/*
 * =========================================================================== *
 * Persistence Layer Errors - Code 3xxx                                        *
 * =========================================================================== *
 */

/*
 * =========================================================================== *
 * Object Layer Errors - Code 4xxx                                             *
 * =========================================================================== *
 */
class UserNotExistError extends AbstractError {
    constructor(opts) {
        super('UserNotExistError');

        // read default properties
        const excp = exceptions[this.constructor.name];

        // change props
        this.message = excp.message || opts.message;
        this.level = excp.level || opts.level;
        this.v1 = excp.v1 || opts.v1;
        this.v2 = excp.v2 || opts.v2;
        this.v3 = excp.v3 || opts.v3;
        this.v4 = excp.v4 || opts.v4;

        this.message = this.getMessage();

        // code cant be changed
        this.code = excp.code;

        // stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
    }

    getName() {
        return this.constructor.name;
    }
}

class InvalidCredentialError extends AbstractError {
    constructor(opts) {
        super('UserNotExistError');

        // read default properties
        const excp = exceptions[this.constructor.name];

        // change props
        this.message = excp.message || opts.message;
        this.level = excp.level || opts.level;
        this.v1 = excp.v1 || opts.v1;
        this.v2 = excp.v2 || opts.v2;
        this.v3 = excp.v3 || opts.v3;
        this.v4 = excp.v4 || opts.v4;

        this.message = this.getMessage();

        // code cant be changed
        this.code = excp.code;

        // stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
    }

    getName() {
        return this.constructor.name;
    }
}

module.exports = {
    DBConnectionError,
    InvalidCredentialError,
    NoInitializeCallError,
    UserNotExistError,
};
