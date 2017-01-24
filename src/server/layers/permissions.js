'use strict';

const _ = require('lodash');

const permissions = exports = module.exports = {};

// System Superior Superadmin
permissions.SUPERADMIN = 'SUPERADMIN';

/*
 * =========================================================================== *
 * Characteristic                                                              *
 * =========================================================================== *
 */

permissions.context.ADMIN = 'ADMIN';

// Management
permissions.context.MANAGEMENT_ALL = [
    permissions.context.MANAGEMENT_USER,
    permissions.context.MANAGEMENT_ISSUE,
    permissions.context.MANAGEMENT_PROJECT,
    permissions.context.MANAGEMENT_APPLICATIONS,
];
permissions.context.MANAGEMENT_USER = 'MANAGEMENT_USER';
permissions.context.MANAGEMENT_ISSUE = 'MANAGEMENT_ISSUE';
permissions.context.MANAGEMENT_PROJECT = 'MANAGEMENT_PROJECT';
permissions.context.MANAGEMENT_APPLICATIONS = 'MANAGEMENT_APPLICATIONS';

// permissions.context.USER_PERMISSIONS = 'USER_PERMISSIONS';
permissions.context.USER_ALL = [
    permissions.context.USER_PROFILE = 'USER_PROFILE',
    permissions.context.USER_SETTINGS = 'USER_SETTINGS',
];

permissions.context.USER_PROFILE = 'USER_PROFILE';
permissions.context.USER_SETTINGS = 'USER_SETTINGS';

/*
 * =========================================================================== *
 * Context                                                                     *
 * =========================================================================== *
 */
permissions.param.SYSTEM = 'SYSTEM';

/*
 * =========================================================================== *
 * Operations                                                                  *
 * =========================================================================== *
 */
permissions.operation.CHANGE = 'CHANGE';
permissions.operation.VIEW = 'VIEW';
permissions.operation.REMOVE = 'REMOVE';
permissions.operation.ADD = 'ADD';


permissions.grant = (permissions) => {
    const outPermissions = _.clone(permissions);

    // its not possible to grant Superadmin characteristic
    if (permissions === permissions.SUPERADMIN) {
        return outPermissions;
    }
};

permissions.revoke = (permissions) => {
    const outPermissions = _.clone(permissions);

    // its not possible to revoke Superadmin characteristic
    if (permissions === permissions.SUPERADMIN) {
        return outPermissions;
    }
};

permisssions.check = () => {

};

permissions.isAdmin = (user) => {

};

/**
 * Check if the user is a Superadmin
 * @param {Boolean} true if user is superadmin, false is user isnt
 */
permissions.isSuperAdmin = (user) => {
    let output = false;

    if (_.find(user.permissions, permission => permission === permissions.SUPERADMIN)) {
        output = true;
    }

    return output;
};



