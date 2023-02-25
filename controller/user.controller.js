const User = require('../dataBase/User');
const UserDto = require('../dtos/user.dto');
const { userNormalizer } = require('../normalizers/user.normalizer');
const { userService, carService, s3Service } = require('../service');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const usersWithMeta = await userService.findByQueryWithPagination(
        req.query
      );

      res.json(usersWithMeta);
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req, res) => {
    const user = await userService.findByIdWithCars(req.user._id);
    const normalizedUser = userNormalizer(user);
    res.json({ user: normalizedUser });
  },

  addUser: async (req, res, next) => {
    try {
      const userToAdd = await User.createWithHashPassword(req.body);
      const userDto = new UserDto(userToAdd);
      res.status(201).json({ user: userDto });
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

      const updatedUser = await userService.updateById(userId, body);
      const userDto = new UserDto(updatedUser);

      res.status(201).json({ user: userDto });
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

  uploadAvatar: async (req, res, next) => {
    try {
      const { userId } = req.params;

      // to save photo in static folder
      // const extension = path.extname(req.files.avatar.name);
      // const avatarPath = path.join(process.cwd(), 'static', `${crypto.randomUUID()}${extension}`);

      // req.files.avatar.mv(avatarPath, (err) => {
      //   if (err) throw err;
      // });

      const uploadedData = await s3Service.uploadPublicFile(
        req.files.avatar,
        'users',
        userId
      ); // uploads on S3
      const updatedUser = await userService.updateById(userId, {
        avatar: uploadedData.Location,
      });

      const userDto = new UserDto(updatedUser);
      res.json({ user: updatedUser });
    } catch (err) {
      next(err);
    }
  },
};
