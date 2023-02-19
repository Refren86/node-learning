const { hashPassword } = require('../helpers/security');
const { userService, carService } = require('../service');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.findByParams();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req, res) => {
    const user = await userService.findByIdWithCars(req.user._id);
    res.json(user);
  },

  addUser: async (req, res, next) => {
    try {
      const userData = req.body;

      const hashedPassword = await hashPassword(userData.password);

      const userToAdd = await userService.create({
        ...userData,
        password: hashedPassword,
      });
      res.json(userToAdd);
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { body, params, user } = req;
      const { userId } = params;

      if (user.cars?.length > 0 && body.cars?.length > 0) {
        const cars = [...user.cars, ...body.cars];
        const data = await userService.updateById(userId, { ...body, cars });

        res.status(201).json({ message: 'Success', data });

        return;
      }

      if (body.cars?.length > 0) {
        await carService.updateManyByIds(body.cars, { user: userId });
      }

      const data = await userService.updateById(userId, body);

      res.status(201).json({ message: 'Success', data });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      await userService.deleteById(userId);
      res.status(204).json({ message: 'Successfully deleted' });
    } catch (err) {
      next(err);
    }
  },
};
