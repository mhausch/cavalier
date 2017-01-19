'use strict';

const r = require('rethinkdb');
const instanceIO = require('./../instance.js');
const exception = require('./exception');

/**
 * RethinkDB Connector
 */
class RethinkConnect {
    /**
     * Constructor
     * @param {object} rethinkConfig - Config to connect to RethinkDB
     */
    constructor(rethinkConfig) {
        this._config = rethinkConfig || instanceIO.getRethinkConfig();
    }

    /**
     * Establish  RethinkDB Connection
     * !! Dont forget to close connection !!
     * @callback Function receive connection and can run operations
     */
    connect(callback) {
        const config = this._config;
        const rcon = r.connect({ config });
        rcon.then((connection) => {
            callback(connection);
        })
        .error((err) => {
            throw new exception.DBConnectionError({ v1: err });
        });

        // // Connect to r
        // r.connect({ config }, (error, connection) => {
        //     // Error occured? Log and throw
        //     if (error) {
        //         throw new exception.DBConnectionError({ v1: error });
        //     }

        //     // call the callback with connection
        //     callback(connection);
        // });
    }
}

module.exports = RethinkConnect;
