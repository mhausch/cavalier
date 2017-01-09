const express = require('express');
const path = require('path');
const AuthUnit = require('../../server/units/auth.js');
const RequestIP = require('./../utils/requestip');
const passport = require('passport');

// Router obj
const router = express.Router();

// Export
const indexRouter = exports = module.exports = router;

indexRouter.use((req, res, next) => {
    const auth = new AuthUnit();
    const requestIP = new RequestIP(req).getIP();

    if (req.query.cav_token) {
        auth.verifyToken(req.query.cav_token, requestIP).then(() => {
            // everthing is fine
            res.redirect('/cavalier/private');
        }, () => {
            // next middleware or route
            //next();
        });
    } else {
        res.redirect('/cavalier/public');
    }
});

