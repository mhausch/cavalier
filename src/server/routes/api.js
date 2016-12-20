const express = require('express');

const bcrypt = require('bcryptjs');
const joi = require('joi');
const userSchema = require('../../server/models/userSchema.js');

// Router obj
const router = express.Router();

// Export
const apiRouter = exports = module.exports = router;

apiRouter.get('/api', (req, res, next) => {
    res.json({ auth: 'ok', trash: 'nothing' });
});

apiRouter.get('/api/doll', (req, res, next) => {
    res.json({ auth: 'ok', trash: 'nothing' });
});

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

