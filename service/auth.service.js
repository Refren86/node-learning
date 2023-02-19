const { authSchema } = require('../dataBase');

module.exports = {
  create: (payload) => {
    return authSchema.create(payload);
  },
  deleteOneByParams: (params = {}) => {
    return authSchema.deleteOne({ params });
  },
  deleteManyByParams: (params = {}) => {
    return authSchema.deleteMany({ params });
  },
};
