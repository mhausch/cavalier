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
        if (instanceIO.getRethinkConfig()) {
            this._config = instanceIO.getRethinkConfig();
        } else {
            this._config = rethinkConfig;
        }
    }

    /**
     * Establish  RethinkDB Connection
     * !! Dont forget to close connection !!
     * @callback Function receive connection and can run operations
     */
    connect() {
        const config = this._config;
        const rcon = r.connect({ config });
        return rcon;
        // rcon.then((connection) => {
        //     callback(connection);
        // })
        // .error((err) => {
        //     throw new exception.DBConnectionError({ v1: err });
        // });

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
