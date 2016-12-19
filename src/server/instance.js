const fs = require('fs');
const path = require('path');
const winston = require('winston');
const r = require('rethinkdb');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.config.js');

// Export
const inst = exports = module.exports = {};

/**
 * Instance
 * @private
 */
inst.start = function () {
    // Environment
    this.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

    // create a logger for this initialization
    this._initLogger = this._getInitLogger();

    // send a upstart message
    this._upstartMessage();

    // load config
    this._config = this._loadConfig();
    this._logger = this._getLogger();

    // Connect to rethink
    this._db = this._connectDatabase();

    // Start http (express) Server
    this._startServer();
};

inst.getDatabase = function () {
    return this._db;
};

/**
 * Return logger
 * @public
 */
inst.getLogger = function () {
    return this._logger;
};

/**
 * Return loaded Config
 * @public
 */
inst.getConfig = function () {
    return this._config;
};

/**
 * Return loaded Config
 * @public
 */
inst.getExpress = function () {
    return this._express;
};

/**
 * Return loaded Config
 * @public
 */
inst.getSocketIO = function () {
    return this._socketIO;
};

/**
 * Return loaded Config
 * @private
 */
inst._startServer = function () {
    // express instance
    this._express = express();
    this._express.use(webpackDevMiddleware(webpack(webpackConfig)));

    // create http on express
    this._httpServer = http.createServer(this._express);

    // socket io
    this._socketIO = socketIo(this._httpServer);

    // server listen
    this._express.listen(3000);
};

/**
 * Return DB
 * @private
 */
inst._connectDatabase = function () {
    const self = this;

    return r.connect({
        db: self._config.rethinkdb.db,
    }, function (err, conn) {
        if (err) {
            self._initLogger.log('error', err);
            throw new Error();
        }

        self._initLogger.log('info', 'Database [%s] connected!', self._config.rethinkdb._db);
    });
};

/**
 * Create Logger for the Init Module
 * @private
 */
inst._getInitLogger = function () {
    return new winston.Logger({
        transports: [
            new (winston.transports.Console)(),
        ],
    });
};

/**
 * Upstart message
 * @private
 */
inst._upstartMessage = function () {
    const d = new Date();
    this._initLogger.log('info', 'App Instance is starting at %s', d.toString());
    this._initLogger.log('info', 'App Instance running in [%s] mode', this.environment);
};


inst._loadConfig = function () {
    const cfglogger = new winston.Logger({
        transports: [
            new (winston.transports.Console)(),
        ],
    });

    // read config
    let cfgJSON = null;
    try {
        cfgJSON = fs.readFileSync(path.join('config.json'));

        // everything was fine, success msg as info
        cfglogger.log('info', 'Config loaded!');
    } catch (err) {
        // log the errors
        cfglogger.log('error', 'Failed to load config, crushing app...');      
        cfglogger.log('error', err);

        // stop loading
        throw new Error();
    }

    // parsing json into javascript object
    const cfg = JSON.parse(cfgJSON);

    // return production config
    if (this.environment === 'production') {
        return cfg.production;
    }

    return cfg.development;
};

/**
 * Getting the logger
 * @private
 */
inst._getLogger = function () {
    if (this._config.logger.toUpperCase() === 'FILE'){
        return new winston.Logger({
            transports: [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: 'filelog-info.log',
                    level: 'silly',
                }),
                new (winston.transports.File)({
                    name: 'error-file',
                    filename: 'filelog-error.log',
                    level: 'error',
                }),
            ],
        });
    }

    if (this._config.logger.toUpperCase() === 'CONSOLE') {
        return new winston.Logger({
            transports: [
                new (winston.transports.Console)(),
            ],
        });
    }
    return null;
};
