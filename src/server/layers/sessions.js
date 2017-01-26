'use strict';

/*
 * =========================================================================== *
 * Require                                                                     *
 * =========================================================================== *
 */
const r = require('rethinkdb');
const express = require('express-session');
//const instanceIO = require('../../server/instance.js');
//const constants = require('./../utils/constants.js');
// const rconnect = require('../../server/utils/rethink_connect.js');


const Store = express.Store;

class RethinkStore extends Store {
    constructor(opts, dbconfig) {
        const defaultOpts = {
            ttl: 1000 * 60 * 60 * 24,
            table: 'sessions',
            autoRemoveInterval: 1000 * 60 * 5,
        };

        const options = opts || defaultOpts;

        // Call Super
        super(options);

        this.options = options;
        this.db = dbconfig;

        r.connect(dbconfig)
        .then((connection) => {
            r.tableList().run(connection)
            .then((list) => {
                if (list.indexOf(options.table) === -1) {
                    r.tableCreate(options.table).indexCreate('expires').run(connection)
                    .then((result) => {
                        if (result.tables_created === 1) {
                            connection.addListener('cleanup', RethinkStore.cleanUp);
                        }
                    });
                }

                connection.close();
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    static cleanUp() {

    }

    get(sid, cbfunc) {
        const self = this;

        r.connect(self.db, (err, connection) => {
            r.table(self.options.table).get(sid).run(connection, (error, result) => {

                if (result) {
                    cbfunc(error, result.session);
                } else {
                    cbfunc(error, result);
                }


                connection.close();
            });
        });
    }

    set(sid, sess, cbfunc) {
        const self = this;

        const sessObj = {
            id: sid,
            expires: new Date(Date.now() + (sess.cookie.originalMaxAge || self.options.ttl)),
            session: sess,
        };

        r.connect(self.db, (err, connection) => {
            r.table(self.options.table).insert(sessObj, { conflict: 'update' }).run(connection, (error, result) => {
                cbfunc(error);
                connection.close();
            });
        });
    }

    destroy(sid, cbfunc) {
        const self = this;

        r.connect(self.db, (err, connection) => {
            r.table(self.options.table).get(sid).delete().run(connection, (error, result) => {
                cbfunc(error);
                connection.close();
            });
        });
    }

    clear(cbfunc) {
        const self = this;

        r.connect(self.db, (err, connection) => {
            r.table(self.options.table).delete().run(connection, (error, result) => {
                cbfunc(error);
                connection.close();
            });
        });
    }

    length(cbfunc) {
        const self = this;

        r.connect(self.db, (err, connection) => {
            r.table(self.options.table).count().run(connection, (error, result) => {
                cbfunc(error, result);
                connection.close();
            });
        });
    }

}

module.exports = RethinkStore;

// module.exports = RethinkStore;
// // rstore.createTable = (opts) => {
// //     return new Promise((resolve, reject) => {
// //         rconnect.connect
// //     });
// // };

// module.exports = (session) => {
// //     const Store = (session.session) ? session.session.Store : session.Store;

// //     function RethinkStore(opts) {
// //         if (!(this instanceof RethinkStore)) {
// //             throw new TypeError('Cannot call RethinkStore constructor as a function');
// //         }

// //         const self = this;

// //         const options = opts || {};
// //         Store.call(this, options);
// //     }

// //     return RethinkStore;
// // };

// // /**
// //  * Wrapper Class on SocketIO
// //  * This class binds methods to the SocketIo Instance
// //  */

// // module.exports = function connectMongo(connect) {
// //     const Store = connect.Store || connect.session.Store;
// //     //  const MemoryStore = connect.MemoryStore || connect.session.MemoryStore;
// //     class Session extends Store {
// //         constructor(options, db, logger) {
// //             options = options || {};

// //             // Call Super
// //             super(options);
// //             this._db = db;
// //             this._logging = logger;

// //             this.createDatabaseTable();
// //         }

// //         createDatabaseTable() {
// //             // r.tableCreate(constants.tables.SESSIONS).run(this._db).then(function(result) {
// //             //    console.log(result);
// //             // }).catch((error) => { console.log(error) });
// //         }
// //     }

// //     return Session;
// };


