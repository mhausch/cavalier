/*
 * =========================================================================== *
 * Imports                                                                     *
 * =========================================================================== *
 */
/*
 * Node NPM Modules
 */
const instanceIO = require('../../server/instance.js');
const router = require('express').Router();
const RequestIP = require('./../utils/requestip');
const jwt = require('jsonwebtoken');
const encryptor = require('simple-encryptor')(instanceIO.getJWTEncryptKeyBase64());

/*
 * App Modules
 */
const userUnit = require('../../server/units/users.js');
const AuthUnit = require('../../server/units/auth.js');

/*
 * =========================================================================== *
 * Export                                                                      *
 * =========================================================================== *
 */
const apiRouter = exports = module.exports = router;

/*
 * =========================================================================== *
 * Middleware                                                                     *
 * =========================================================================== *
 */
apiRouter.use((req, res, next) => {
    console.log('api');
    // res.redirect('public');
    next();
});

/*
 * =========================================================================== *
 * POST - Routes                                                               *
 * =========================================================================== *
 */
/*
 * Login - check credentials, return token
 */
apiRouter.post('/login', (req, res, next) => {
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

        // save request ip and address src to payload
        user.ip = new RequestIP(req).getIP();

        // expire 60 seconds * 60 (one hour)
        let jwtToken = jwt.sign(user, instanceIO.getJWTSecretBase64(), { expiresIn: 60 * 60 });

        // Encrypt the whole token!
        // jwtToken = encryptor.encrypt(jwtToken);

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
apiRouter.post('/newuser', (req, res, next) => {
    // call unit to save user
    userUnit.add(req.body).then((response) => {
        // Promise returns
        res.status(200).send('Inserted User ' + response.username);
    }, (err) => {
        // Send error back
        res.status(400).send(err.message);
    });
});

/*
 * Delete User by username
 */
apiRouter.post('/deleteuser', (req, res, next) => {
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

/*
 * Verify token
 */
apiRouter.post('/verify', (req, res) => {
    // Auth unit
    const auth = new AuthUnit();

    // we get the current ip address
    const requestIP = new RequestIP(req).getIP();

    // check body contains something
    if (!req.body) {
        res.status(400).send('No payload given');
        res.end();
    } else if (!req.body.access_token) {
        res.status(400).send('Payload given, but no property access_token');
        res.end();
    } else {
        // Verify token
        auth.verifyToken(req.body.access_token, requestIP).then(() => {
            // everything is fine
            res.json({ valid: true });
            res.end();
        }, (error) => {
            // token dont match requirements!
            res.status(400).send(error.message);
            res.end();
        });
    }
});

/*
 * =========================================================================== *
 * Non Specific GET - Routes                                                   *
 * =========================================================================== *
 */
apiRouter.get('/*', (req, res, next) => {
    res.status(405).send('API is only for POST').end();
});

/*
 * =========================================================================== *
 * Non Specific POST - Routes                                                  *
 * =========================================================================== *
 */
apiRouter.post('/*', (req, res, next) => {
    res.status(404).end();
});
