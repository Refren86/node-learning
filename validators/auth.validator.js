const Joi = require("joi");

const regexp = require('../enums/regexp.enum');

module.exports = {
  loginValidator: Joi.object({
    email: Joi.string().regex(regexp.EMAIL).lowercase().trim().required(),
    password: Joi.string().regex(regexp.PASSWORD).trim().required(),
  }),
  passwordValidator: Joi.object({
    password: Joi.string().regex(regexp.PASSWORD).trim().required(),
  }),
};