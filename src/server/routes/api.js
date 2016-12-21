/*
 * Node NPM Modules
 */
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const joi = require('joi');
const jwt = require('jsonwebtoken');

/*
 * App Modules
 */
const instanceIO = require('../../server/instance.js');
const userUnit = require('../../server/units/users.js');

/*
 * Export
 */
const apiRouter = exports = module.exports = router;

/*
 * =========================================================================== *
 * GET - Routes                                                                *
 * =========================================================================== *
 */
apiRouter.get('/api', (req, res, next) => {
    res.status(204);
});

/*
 * =========================================================================== *
 * POST - Routes                                                               *
 * =========================================================================== *
 */

/*
 * Login - check credentials, return token
 */
apiRouter.post('/api/login', (req, res, next) => {
    // No data was sent
    if (req.body.username === undefined || req.body.username === undefined) {
        res.status(400).send('Undefined payload on request!');
        return;
    }

    // Data was sent but is empty
    if (req.body.username === '' || req.body.password === '') {
        res.status(400).send('No Credentials filled!');
        return;
    }

    // Asking user unit for user credentials
    userUnit.checkCredentials(req.body.username, req.body.password).then((response) => {
        const user = response;

        // Delete password for safety reasons
        delete user.password;

        // expire 60 seconds * 60 (one hour)
        const jwtToken = jwt.sign(user, instanceIO.getJWTSecretBase64(), { expiresIn: 60 * 60 });

        // send back
        res.json({ token: jwtToken });

        // end
        res.end('');
    }, (err) => {
        res.status(401).send(err.message);
    });
});

/*
 * Create new user
 */
apiRouter.post('/api/newuser', (req, res, next) => {
    // call unit to save user
    userUnit.add(req.body).then((response) => {
        // Promise returns
        res.status(200).send('Inserted User ' + response.username);
    }, (err) => {
        // Send error back
        res.status(400).send(err.message);
    });
});

apiRouter.post('/api/deleteuser', (req, res, next) => {
    // call unit to save user
    userUnit.delete(req.body.username).then((response) => {
        if (response) {
            res.status(200).send('User deleted');
        }
    }, (err) => {
        // Send error back
        res.status(400).send(err.message);
    });
});

apiRouter.post('/api/verify', (req, res, next) => {
    let token = null;

    // Token exist?
    if (req.body && req.body.access_token) {
        token = req.body.access_token;
    } else {
        res.status(400).send('No Token found');
    }

    // Verify the token
    jwt.verify(token, instanceIO.getJWTSecretBase64(), (err, payload) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json({ valid: true });
        }        
        res.end('');
    });
});
