const socketFunctions = exports = module.exports = {};

socketFunctions.attach = function (socketIO) {
    this._socket = socketIO;

    this._auth();

     // register on "connection"
    this._connection();
};

socketFunctions._auth = function () {
    const self = this;

    self._socket.use((socket, next) => {
        console.log(socket.handshake.headers);
        // return accept('', false);
    });
};

socketFunctions._connection = function () {
    const self = this;

    self._socket.on('connection', (socket) => {
        socket.on('message', (gg) => {
            console.log('socket');
        });

        console.log('MAHAH');
    });
};

