const express = require('express');
const path = require('path');
const passport = require('passport');


// Router obj
const router = express.Router();

// Export
const privateRouter = exports = module.exports = router;

/*
 * =========================================================================== *
 * Middleware                                                                  *
 * =========================================================================== *
 */
// The middleware checks if there is a valid token provided
// 1. no or invalid token, we redirect to "cavalier/public"
// 2. everthing fine, we continue and send private app
privateRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: 'public' }), (req, res, next) => {
    console.log('privateRouter Middleware');
    next();
});

/*
 * =========================================================================== *
 * Route handlers                                                              *
 * =========================================================================== *
 */
// If the middleware is passed, we send our private app
privateRouter.get('/', (req, res, next) => {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
});
