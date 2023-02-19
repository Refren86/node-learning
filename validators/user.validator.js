const Joi = require('joi');
const regexp = require('../enums/regexp.enum');

module.exports = {
  newUserValidator: Joi.object({
    name: Joi.string().min(2).max(100).required().required(),
    email: Joi.string().regex(regexp.EMAIL).lowercase().trim().required(),
    password: Joi.string().regex(regexp.PASSWORD).trim().required(),
    age: Joi.number().integer().min(1).max(120).required(),
  }),
  editUserValidator: Joi.object({
    name: Joi.string().min(2).max(100).required().optional(),
    email: Joi.string().regex(regexp.EMAIL).lowercase().trim().optional(),
    age: Joi.number().integer().min(1).max(120).optional(),
  }),
};