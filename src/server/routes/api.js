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

/*
 * App Modules
 */
const User = require('../../server/layers/objects/user.js');

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

    // Create user object
    const user = new User({ username: req.body.username });

    // initialize (from DB or fictive)
    user.initialize()
    .then(() => {
        if (!user.isPersistent()) {
            res.status(401).send('Unknown User or Password');
            return;
        }

        // Check password
        user.checkPassword(req.body.password)
        .then((response) => {
            if (!response) {
                res.status(401).send('Unknown User or Password');
            } else {
                const responseUser = {};

                // Delete password for safety reasons
                delete user.password;

                // save request ip and address src to payload
                responseUser.ip = new RequestIP(req).getIP();
                responseUser.username = user.getUsername();

                // expire 60 seconds * 60 (one hour)
                const jwtToken = jwt.sign(responseUser, instanceIO.getSecretBase64(), { expiresIn: 60 * 60 });

                // // Encrypt the whole token!
                // // jwtToken = encryptor.encrypt(jwtToken);

                // send back
                res.json({ token: jwtToken });

                // end
                res.end('');
            }
        })
        .catch(() => {
            res.status(500).send('Error occured');
            return;
        });
    })
    .catch(() => {
        res.status(500).send('Error occured');
    });
});

/*
 * Create new user
 */
apiRouter.post('/newuser', (req, res) => {
    const user = new User(req.body);

    // initialize
    user.initialize()
    .then(() => {
        // user already exists
        if (user.isPersistent()) {
            res.status(400).send('Insertion failed, user already exists');
            return;
        }
         // call unit to save user
        user.save(req.body).then((response) => {
            if (response) {
                // Promise returns
                res.status(200).send(`Inserted User ${user.getUsername()}`);
            } else {
                res.status(400).send('Insertion failed');
            }
        }, (error) => {
            error.log();
            // Send error back
            res.status(400).send('Insertion failed');
        });
    })
    .catch((error) => {
        error.log();
        // Send error back
        res.status(400).send('Insertion failed');
    });
});

/*
 * Delete User by username
 */
apiRouter.post('/deleteuser', (req, res) => {
    const users = new Users();
    // call unit to save user
    users.delete(req.body.username).then((response) => {
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
        // Verify the token
        jwt.verify(req.body.access_token, instanceIO.getSecretBase64(), (err, payload) => {
            if (err) {
                // token dont match requirements!
                res.status(400).send(err.message);
                res.end();
            } else if (payload.ip.type === requestIP.type && payload.ip.value === requestIP.value) {
                // everything is fine
                res.json({ valid: true });
                res.end();
            } else {
                res.status(400).send('Token not valid to this connection!');
                res.end();
            }
        });
    }
});

/*
 * =========================================================================== *
 * Non Specific GET - Routes                                                   *
 * =========================================================================== *
 */
apiRouter.get('/*', (req, res) => {
    res.status(405).send('API is only for POST').end();
});

/*
 * =========================================================================== *
 * Non Specific POST - Routes                                                  *
 * =========================================================================== *
 */
apiRouter.post('/*', (req, res) => {
    res.status(404).end();
});
