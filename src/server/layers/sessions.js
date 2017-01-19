'use strict';

const r = require('rethinkdb');
const instanceIO = require('../../server/instance.js');
const constants = require('./../utils/constants.js');


/**
 * Wrapper Class on SocketIO
 * This class binds methods to the SocketIo Instance
 */

module.exports = function connectMongo(connect) {
    const Store = connect.Store || connect.session.Store;
    //  const MemoryStore = connect.MemoryStore || connect.session.MemoryStore;
    class Session extends Store {
        constructor(options, db, logger) {
            options = options || {};

            console.log(instanceIO);

            // Call Super
            super(options);
            this._db = db;
            this._logging = logger;

            this.createDatabaseTable();
        }

        createDatabaseTable() {
            // r.tableCreate(constants.tables.SESSIONS).run(this._db).then(function(result) {
            //    console.log(result);
            // }).catch((error) => { console.log(error) });
        }
    }

    return Session;
};


