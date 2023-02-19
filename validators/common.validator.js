const Joi = require("joi");
const regexp = require('../enums/regexp.enum');

module.exports = {
  idValidator: Joi.string().regex(regexp.MONGO_ID)
}