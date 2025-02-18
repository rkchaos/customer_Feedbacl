const Joi = require('joi');

const schema = Joi.object({
    displayName: Joi.string()
        .min(3)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9^$*.\\[\\]{}()?!"@#%&/\\\\,><\':;|_~]{6,30}$'))
        .required(),
      
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
})
const loginSchmea = Joi.object({
    password: Joi.string()
        .required(),

    email: Joi.string()
        .required()
})
module.exports = { schema, loginSchmea }

