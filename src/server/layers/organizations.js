'use strict';

/*
 * =========================================================================== *
 * Require                                                                     *
 * =========================================================================== *
 */
// node modules
const _ = require('lodash');
const joi = require('joi');
const r = require('rethinkdb');

// cavalier modules
const rconnect = require('../../server/utils/rethink_connect.js');

/*
 * =========================================================================== *
 * Exports                                                                     *
 * =========================================================================== *
 */
const organizations = exports = module.exports = {};

// attach db object
organizations.db = {};

// attach constants
organizations.constants = {
    TABLE: 'organizations',
};

/*
 * =========================================================================== *
 * Object Schema                                                                   *
 * =========================================================================== *
 */
organizations.schema = joi.object().keys({
    identifier: joi.string().alphanum().uppercase().min(1)
    .max(10)
    .required(),
    name: joi.string().alphanum().required(),
    active: joi.boolean().required(),
    sysowner: joi.boolean().required(),
    address: {
        street: joi.string().alphanum().max(50),
        number: joi.string().alphanum().max(10),
        zipcode: joi.string().alphanum().max(30),
        country: joi.string().alphanum().max(30),
        isocode: joi.string().alphanum().max(2).uppercase(),
    },
});

/*
 * =========================================================================== *
 * Database functions                                                          *
 * =========================================================================== *
 */
organizations.db.add = (org) => {
    return new Promise((resolve, reject) => {
        rconnect.connect()
        .then((connection) => {
            r.table(organizations.constants.TABLE).insert(org).run(connection)
            .then((result) => {
                resolve(result);
                connection.close();
            })
            .catch(error => reject(error));
        });
    });
};

organizations.db.get = (key) => {
    return new Promise((resolve, reject) => {
        rconnect.connect()
        .then((connection) => {
            r.table(organizations.constants.TABLE).get(key).run(connection)
            .then((result) => {
                resolve(result);
                connection.close();
            })
            .catch(error => reject(error));
        });
    });
};

organizations.db.getTable = () => {
    return new Promise((resolve, reject) => {
        rconnect.connect()
        .then((connection) => {
            r.table(organizations.constants.TABLE).run(connection)
            .then(cursor => cursor.toArray())
            .then((result) => {
                resolve(result);
                connection.close();
            })
            .catch(error => reject(error));
        });
    });
};

// organizations.db.getTable = () => {
//     return new Promise((resolve, reject) => {
//         rconnect.connect()
//         .then(connection => r.table(organizations.constants.TABLE)
//             .run(connection))
//         .then(cursor => cursor.toArray())
//         .then(result => resolve(result))
//         .catch(error => reject(error));
//     });
// };

organizations.db.change = (org) => {
    const cloneOrg = _.clone(org);
    delete cloneOrg.techname;

    return new Promise((resolve, reject) => {
        rconnect.connect()
        .then((connection) => {
            r.table(organizations.constants.TABLE).update(cloneOrg).run(connection)
            .then((result) => {
                resolve(result);
                connection.close();
            })
            .catch(error => reject(error));
        });
    });
};

organizations.db.remove = (key) => {
    return new Promise((resolve, reject) => {
        rconnect.connect()
        .then((connection) => {
            r.table(organizations.constants.TABLE).get(key).delete().run(connection)
            .then((result) => {
                resolve(result);
                connection.close();
            })
            .catch(error => reject(error));
        });
    });
};

/*
 * =========================================================================== *
 * IO Functions                                                                *
 * =========================================================================== *
 */
organizations.validate = (org) => {
    if (joi.validate(org, organizations.schema) === null) {
        return true;
    } else {
        throw new Error();
    }
};
