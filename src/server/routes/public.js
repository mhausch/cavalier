const express = require('express');
const path = require('path');

// Router obj
const router = express.Router();

// Export
const publicRouter = exports = module.exports = router;

publicRouter.get('/public', (req, res, next) => {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
});
