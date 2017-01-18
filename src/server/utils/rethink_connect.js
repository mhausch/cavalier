'use strict';

const r = require('rethinkdb');
const instanceIO = require('./../instance.js');

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
        this._logger = instanceIO.getLogger();
    }

    /**
     * Establish  RethinkDB Connection
     * !! Dont forget to close connection !!
     * @callback Function receive connection and can run operations
     */
    connect(callback) {
        const self = this;
        const config = this._config;

        // Connect to r
        r.connect({ config }, (error, connection) => {

            // Error occured? Log and throw
            if (error) {
                self.log('error', 'RethinkDB Connection Error %s', error);
                throw error;
            }

            // call the callback with connection
            callback(connection);
        });
    }
}

module.exports = RethinkConnect;
