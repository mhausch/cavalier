const joi = require('joi');

const orgSchema = exports = module.exports = joi.object().keys({
    identifier: joi.string().alphanum().uppercase().min(1).max(10).required(),
    name: joi.string().alphanum().required(),
    active: joi.boolean(),
    sysowner: joi.boolean(),
    address: {
        street: joi.string().alphanum().max(50),
        number: joi.string().alphanum().max(10),
        zipcode: joi.string().alphanum().max(30),
        country: joi.string().alphanum().max(30),
        isocode: joi.string().alphanum().max(2).uppercase(),
    },
});
