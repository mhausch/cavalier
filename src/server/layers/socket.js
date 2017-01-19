'use strict';

/**
 * Wrapper Class on SocketIO
 * This class binds methods to the SocketIo Instance
 */
class Socket {
    /**
     * Wrapper Class on SocketIO
     * @param {object} socket - socketIO object to bind methods
     */
    constructor(socket) {
        // reference to the SocketIO Object
        this._socket = socket;

        this._constants = Socket.getConstants();

        // register on events
        this._registerOnConnection('private', 'message', this._connection);
        // this._registerOn('connection', this._connection2);

    }

    /**
     * Method return all declared constants
     * @returns {object} obj - Object that hold all constants
     */
    static getConstants() {
        return {
            ON_CONNECTION: 'connection',
            ON_MESSAGE: 'message',
            ON_PROFIL_SAVE: 'profil_save',
            PRIVATE: 'private',
        };
    }

    /**
     * Register all On Events
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    _registerOnConnection(type, action, func) {
        const self = this;

        switch (type) {
        case this._constants.PRIVATE:
            self._socket.on('connection', (socket) => {
                socket.on(action, func);
            });
            break;
        default:
        }

    }

    _connection() {
        console.log('socket11');
    }


    _auth() {
        const self = this;

        self._socket.use((socket, next) => {
            console.log(socket.handshake.headers);
            next();
        });
    }

};

module.exports = Socket;