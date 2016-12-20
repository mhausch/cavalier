const joi = require('joi');

const userSchema = exports = module.exports = joi.object().keys({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(6).strip().required(),
    email: joi.string().email().required(),
    firstname: joi.string().alphanum(),
    middlename: joi.string().alphanum().allow(''),
    lastname: joi.string().alphanum(),
    birthdate: joi.date().allow(''),
});
