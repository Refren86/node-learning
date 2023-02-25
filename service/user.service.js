const { userSchema } = require('../dataBase');
const { usersNormalizer } = require('../normalizers/user.normalizer');

module.exports = {
  findByQueryWithPagination: async (query) => {
    const { limit = 10, page = 1, name = '', email = '' } = query;

    let findObj = {};

    if (name) {
      findObj = {
        ...findObj,
        name: { $regex: name, $options: 'i' },
      };
    }

    if (email) {
      findObj = {
        ...findObj,
        email: { $regex: email, $options: 'i' },
      };
    }

    const [users, count] = await Promise.all([
      userSchema
        .find(findObj)
        .limit(limit)
        .skip((+page - 1) * limit)
        .lean(),
      userSchema.countDocuments(findObj),
    ]);

    const normalizedUsers = usersNormalizer(users);

    return { payload: normalizedUsers, page: +page, count };
  },
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
