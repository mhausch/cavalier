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
const userSchema = require('../../server/schemas/userSchema.js');
const userUnit = require('../../server/units/user.js');

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
    }, () => {
        res.status(401).send('Error');
    });
});

/*
 * Create new user
 */
apiRouter.post('/api/newuser', (req, res, next) => {
    let isError = false;
    const tmpUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: 'David',
        middlename: '',
        lastname: 'Thomson',
        birthdate: new Date(),
    };

    // validate
    joi.validate(tmpUser, userSchema, (err, value) => {
        if (err === null) {
            console.log(value);
        } else {
            res.send({ state: 'error' });
            res.end('done');
            isError = true;
        }
    });

    if (isError === true) {
        return;
    }

    // retrieve promise
    const promise = bcrypt.hash(tmpUser.password, 10);

    // evaluate promise
    promise.then((hash) => {
        tmpUser.password = hash;
        console.log(tmpUser);
    }, (error) => {
        console.log(error);
    });

    res.send({ state: 'ok' });
    res.end('done');
});

