const instanceIO = require('../../server/instance.js');
const jwt = require('jsonwebtoken');


const auth = exports = module.exports = function Auth() {

};

/**
 * @param {any} token
 * @param {any} ip
 * @returns
 */
auth.prototype.verifyToken = function (token, ip) {
    return new Promise((resolve, reject) => {
        // decrypted Version of the token
        // const tmpToken = encryptor.decrypt(token);

        // check given token
        if (!token) {
            reject(new Error('No token given.'));
            return;
        }

        // Verify the token
        jwt.verify(token, instanceIO.getSecretBase64(), (err, payload) => {
            if (err) {
                reject(new Error('Invalid Token!'));
            } else if (payload.ip.type === ip.type && payload.ip.value === ip.value) {
                resolve(payload);
            } else {
                reject(new Error('Token not valid to this connection!'));
            }
        });
    });
};
