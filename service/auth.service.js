const { authSchema } = require('../dataBase');

module.exports = {
  findByParams: (params = {}) => {
    return authSchema.find(params);
  },
  create: (payload) => {
    return authSchema.create(payload);
  },
  deleteOneByParams: (params = {}) => {
    return authSchema.deleteOne(params);
  },
  deleteManyByParams: (params = {}) => {
    return authSchema.deleteMany(params);
  },
};
