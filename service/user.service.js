const { userSchema } = require('../dataBase');

module.exports = {
  findByParams: (filtersObj = {}) => {
    return userSchema.find(filtersObj);
  },
  findOneByParams: (filterObj = {}) => {
    return userSchema.findOne(filterObj);
  },
  findById: (userId) => {
    return userSchema.findById(userId);
  },
  // similar to populate, without REFERENCES!
  findByIdWithCars: async (userId) => {
    const result = await userSchema.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: 'cars', // where to search
          localField: '_id', // _id in user schema should match user in car schema
          foreignField: 'user',
          as: 'cars', // result array name
        },
      },
    ]);

    return result[0]; // result will be array with only one object
  },
  create: (data) => {
    return userSchema.create(data);
  },
  updateById: (userId, body) => {
    return userSchema.findByIdAndUpdate(userId, body, { new: true });
  },
  deleteById: (userId) => {
    return userSchema.findByIdAndDelete(userId);
  },
};
