const router = require('express').Router();

const { carController } = require('../controller');

router.get('/', carController.getAllCars);

router.post('/', carController.addCar);

router.get('/:carId', carController.getCarById);

router.patch('/:carId', carController.updateCar);

module.exports = router;
