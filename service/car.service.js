const { carSchema } = require('../dataBase');

module.exports = {
  findByParams: (filterParams = {}) => {
    return carSchema.find(filterParams);
  },
  findByIdWithUser: (carId) => {
    return carSchema.findById(carId).populate('user'); // populate user field
  },
  create: (carData) => {
    return carSchema.create(carData);
  },
  updateById: (carId, carData) => {
    return carSchema.findByIdAndUpdate(carId, carData, { new: true });
  },
  updateManyByIds: (carIds, carData) => {
    return carSchema.updateMany({ _id: { $in: carIds } }, carData);
  },
};
