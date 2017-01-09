const express = require('express');
const path = require('path');
const passport = require('passport');

// Router obj
const router = express.Router();

// Export
const publicRouter = exports = module.exports = router;

/*
 * =========================================================================== *
 * Middleware                                                                  *
 * =========================================================================== *
 */
// we take another approach comparing to the middleware /cavalier/private
// here we cant failureRedirect or successRedirect after the authenticate
// process.
// The solution is to place a custom auth callback and handle this by our
// own style. (we dont care for sessions!)
// - when auth header jwt is valid we redirect to private, private shouldnt
//   redirect back, becuse we use same check algo.
publicRouter.use((req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) {
            return next(err);
        }

        // if there is a valid user we now that the token is valid so 
        // we can trigger private
        if (user) {
            res.cookie({jwt: ''});
            // return res.status(401).send(info).end();
            res.redirect('/cavalier/private');
        } else {
            next();
        }
    })(req, res, next);
});

/*
 * =========================================================================== *
 * Route handlers                                                              *
 * =========================================================================== *
 */
publicRouter.get('/*', (req, res) => {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
});
