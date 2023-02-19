const { userService } = require('../service');
const { ApiError } = require('../error/api.error');
const { userValidator } = require('../validators');
const { commonValidator } = require('../validators');
const { nameNormalizer } = require('../helpers/normalize');

module.exports = {
  checkIfUserExistsDynamically:
    (fieldName, from = 'body', dbField = fieldName) =>
    async (req, res, next) => {
      try {
        const fieldToSearch = req[from][fieldName];

        const user = await userService.findOneByParams({
          [dbField]: [fieldToSearch],
        });

        if (!user) {
          throw new ApiError(`User was not found`, 404);
        }

        req.user = user;
        next();
      } catch (err) {
        next(err);
      }
    },

  checkUserCreateData: (req, res, next) => {
    try {
      if (req.body?.name) {
        req.body.name = nameNormalizer(req.body.name);
      }

      const { name, age, email, password } = req.body;

      if (
        !email ||
        !email.length > 5 ||
        !email.includes('@') ||
        !email.indexOf('@') > 0 ||
        !(email.indexOf('.') > email.indexOf('@') + 2)
      ) {
        throw new ApiError('Email is not valid', 400);
      }

      if (
        typeof password !== 'string' ||
        !password ||
        !password.match(/\d/) ||
        !password.match(/[A-Za-zА-Яа-я]/) ||
        !password.length > 2
      ) {
        throw new ApiError('Password is not valid', 400);
      }

      if (!age || age < 1 || isNaN(+age) || typeof age !== 'number') {
        throw new ApiError('User age is not valid', 400);
      }

      if (!name || name.length < 3 || typeof name !== 'string') {
        throw new ApiError('User name is not valid', 400);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  checkIfEmailIsUnique: async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ApiError('Email is empty', 400);
      }

      const user = await userService.findOneByParams({ email });

      if (user) {
        throw new ApiError('User with this email already exist', 409); // 409 - conflict
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  checkUserUpdateData: (req, res, next) => {
    try {
      if (req.body?.name) {
        req.body.name = nameNormalizer(req.body.name);
      }

      const { name, age, password, email, cars } = req.body;

      if (age && (age < 1 || isNaN(Number(age)) || typeof age !== 'number')) {
        throw new ApiError('User age is not valid', 400);
      }

      if (name && (name.length < 3 || typeof name !== 'string')) {
        throw new ApiError('User name is not valid', 400);
      }

      if (
        email &&
        (!email.length > 5 || !email.includes('@') || !email.indexOf('@') > 0)
      ) {
        throw new ApiError('Email is not valid', 400);
      }

      if (
        password &&
        (typeof password !== 'string' ||
          !password.match(/\d/) ||
          !password.match(/[A-Za-zА-Яа-я]/) ||
          !password.length > 2)
      ) {
        throw new ApiError('Password is not valid', 400);
      }

      if (cars && cars?.length > 0 && req.user?.cars) {
        const carId = req.user.cars.find((car) =>
          cars.includes(car.toString())
        );

        if (carId) {
          throw new ApiError(`User already have car with id ${carId}`, 400);
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  checkIfNewUserValid: async (req, res, next) => {
    try {
      const newUserValidation = userValidator.newUserValidator.validate(
        req.body
      );

      if (newUserValidation.error) {
        throw new ApiError(newUserValidation.error.message, 400);
      }

      req.body = newUserValidation.value; // change req.body after validation

      next();
    } catch (err) {
      next(err);
    }
  },

  checkIfEditUserValid: async (req, res, next) => {
    try {
      const newUserValidation = userValidator.editUserValidator.validate(
        req.body
      );

      if (newUserValidation.error) {
        throw new ApiError(newUserValidation.error.message, 400);
      }

      req.body = newUserValidation.value; // change req.body after validation

      next();
    } catch (err) {
      next(err);
    }
  },

  checkIfUserIdValid: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const userIdValidation = commonValidator.idValidator.validate(userId);

      if (userIdValidation.error) {
        throw new ApiError(userIdValidation.error.message, 400);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  normalizeUserData: (req, res, next) => {
    const { name, email } = req.body;

    if (name) req.body.name = nameNormalizer(name);
    if (email) req.body.email = email.toLowerCase();

    next();
  },
};
