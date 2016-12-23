const express = require('express');
const path = require('path');

// Router obj
const router = express.Router();

// Export
const publicRouter = exports = module.exports = router;

publicRouter.use((req, res, next) => {

    res.redirect('public');
    next();
});

publicRouter.get('/public', (req, res, next) => {
    if (req.query.access_token) {
        res.send('/cavalier/private');
    } else {
        res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
    }
});
