const express = require('express');
const path = require('path');
const passport = require('passport');

// Router obj
const router = express.Router();

// Export
const appRouter = exports = module.exports = router;

/*
 * =========================================================================== *
 * Middleware                                                                  *
 * =========================================================================== *
 */
appRouter.use((req, res, next) => {
    next();
});

/*
 * =========================================================================== *
 * Route handlers                                                              *
 * =========================================================================== *
 */
// login
appRouter.get('/login', (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.redirect('/client');
    } else {
        res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
    }
});

// get client
appRouter.get('/client', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
    } else {
        res.redirect('*');
    }
});

appRouter.get('/logout', (req, res) => {
    // req.session.destroy(() => {
    //     // req.session = null;
    //     // req.sessionID = null;
    //     // res.redirect('*');
    // });

    req.logout();
    res.redirect('*');
});

// catch all
appRouter.get('*', (req, res) => {
    res.redirect('/login');
});

appRouter.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    // if (req.body && req.body.username) {
    //     req.session.user = { username: 'noob' };
        res.redirect('client');
    // } else {
    //     res.redirect('login');
    // }
});
