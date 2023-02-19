const { carService } = require("../service");

module.exports = {
  getAllCars: async (req, res, next) => {
    try {
      const cars = await carService.findByParams();
      res.status(200).json(cars);
    } catch (err) {
      next(err);
    } 
  },

  getCarById: async (req, res, next) => {
    try {
      const { carId } = req.params;
      const car = await carService.findByIdWithUser(carId);
      res.status(200).json(car);
    } catch (err) {
      next(err);
    }
  },

  addCar: async (req, res, next) => {
    try {
      const newCar = await carService.create(req.body);
      res.status(201).json(newCar);
    } catch (err) {
      next(err);
    }
  },

  updateCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      const updatedCar = await carService.updateById(carId, req.body);
      res.status(201).json(updatedCar);
    } catch (err) {
      next(err);
    }
  }
}