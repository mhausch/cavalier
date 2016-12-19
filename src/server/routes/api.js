const express = require('express');
//const path = require('path');

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
