const express = require('express');
const path = require('path');

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
    if (req.session.user) {
        res.redirect('/client');
    } else {
        res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
    }
});

// get client
appRouter.get('/client', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
    } else {
        res.redirect('*');
    }
});

appRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        req.session = null;
        res.redirect('*');
    });
});

// catch all
appRouter.get('*', (req, res) => {
    res.redirect('/login');
});

appRouter.post('/login', (req, res) => {
    if (req.body && req.body.username) {
        req.session.user = { username: 'noob' };
        res.redirect('client');
    } else {
        res.redirect('login');
    }
});
