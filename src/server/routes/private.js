const express = require('express');
const path = require('path');

// Router obj
const router = express.Router();

// Export
const privateRouter = exports = module.exports = router;

privateRouter.use((req, res, next) => {
    console.log('reta');
    // res.redirect('public');
    if (2 === 1) {
        next();
    }
    res.redirect('public');
});

privateRouter.get('/', (req, res, next) => {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
});
