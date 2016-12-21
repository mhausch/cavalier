const axios = require('axios');

const fetch = exports = module.exports = {};

const verify = {
    method: 'post',
    url: '/cavalier/api/verify',
    responseType: 'json',
    'Content-Type': 'application/json',
    data: {
        access_token: '',
    },
};

const login = {
    method: 'post',
    url: '/cavalier/api/login',
    responseType: 'json',
    'Content-Type': 'application/json',
    data: {
        username: '',
        password: '',
    },
};

fetch.login = function (username, password, callback) {
    login.data.username = username;
    login.data.password = password;

    // http request
    axios(login).then((response) => {
        callback(response);
    })
    .catch((error) => {
        console.log(error);
        callback(error);
    });
};

fetch.verify = function (token, callback) {
    verify.data.access_token = token;

    // http request
    axios(verify).then((response) => {
        callback(response);
    })
    .catch((error) => {
        console.log(error);
        callback(error);
    });
};
