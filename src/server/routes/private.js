const express = require('express');
const path = require('path');

// Router obj
const router = express.Router();

// Export
const privateRouter = exports = module.exports = router;

privateRouter.get('/private', (req, res, next) => {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
});
