const security = require('../helpers/security');
const { ApiError } = require('../error/api.error');
const { authValidator } = require('../validators');
const {
  authSchema,
  actionTokenSchema,
  oldPasswordSchema,
} = require('../dataBase');
const { REFRESH_TOKEN, FORGOT_PASS_TOKEN } = require('../enums/token.enum');

module.exports = {
  isLoginBodyValid: async (req, res, next) => {
    try {
      const loginValidation = authValidator.loginValidator.validate(req.body);

      if (loginValidation.error) {
        throw new ApiError(loginValidation.error.message, 400);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  isPasswordValid: async (req, res, next) => {
    try {
      const passwordValidation = authValidator.passwordValidator.validate(
        req.body
      );

      if (passwordValidation.error) {
        throw new ApiError(passwordValidation.error.message, 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  checkAccessToken: async (req, res, next) => {
    try {
      const accessToken = req.get('Authorization'); // getting token from headers

      if (!accessToken) {
        throw new ApiError('Token was not provided', 401);
      }

      security.checkToken(accessToken); // check if token is valid and not dead xD

      const existingTokenInfo = await authSchema.findOne({ accessToken });

      if (!existingTokenInfo) {
        throw new ApiError('Token is invalid', 401);
      }

      req.tokensInfo = existingTokenInfo; // { refreshToken, accessToken, _userId }
      next();
    } catch (err) {
      next(err);
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.get('Authorization'); // getting token from headers

      if (!refreshToken) {
        throw new ApiError('Token was not provided', 401);
      }

      security.checkToken(refreshToken, REFRESH_TOKEN); // check if token is valid and not dead xD

      const existingTokenInfo = await authSchema.findOne({ refreshToken });

      if (!existingTokenInfo) {
        throw new ApiError('Token is invalid', 401);
      }

      req.tokensInfo = existingTokenInfo; // { refreshToken, accessToken, _userId }
      next();
    } catch (err) {
      next(err);
    }
  },

  checkActionToken: async (req, res, next) => {
    try {
      const actionToken = req.get('Authorization'); // getting token from headers

      if (!actionToken) {
        throw new ApiError('Token was not provided', 401);
      }

      security.checkToken(actionToken, FORGOT_PASS_TOKEN); // check if token is valid and not dead xD

      const existingTokenInfo = await actionTokenSchema
        .findOne({ token: actionToken, tokenType: FORGOT_PASS_TOKEN })
        .populate('_userId');

      if (!existingTokenInfo) {
        throw new ApiError('Token is invalid', 401);
      }

      req.user = existingTokenInfo._userId; // user object
      next();
    } catch (err) {
      next(err);
    }
  },

  checkOldUserPasswords: async (req, res, next) => {
    try {
      const { user, body } = req;

      const oldUserPasswords = await oldPasswordSchema
        .find(
          {
            _userId: user._id,
          },
          { password: 1, _id: 0 } // get only password from all model
        )
        .lean(); // use lean when I don't change this data in database in here/next functions
      

      if (!oldUserPasswords && !oldUserPasswords.length) {
        return next();
      }

      const allUserPasswords = [
        ...oldUserPasswords,
        { password: user.password },
      ];

      // to find if password already exists in the db
      const asyncComparisonResult = await Promise.allSettled(
        allUserPasswords.map(async (record) => {
          // waits until all promises are fulfilled
          return security.compareOldPasswords(record.password, body.password); // array of promises
        })
      );

      const oldPasswordInDb = asyncComparisonResult.some(
        (result) => result.value
      );

      if (oldPasswordInDb) {
        throw new ApiError('Cannot set this password', 409); // conflict
      }

      // next();
    } catch (err) {
      next(err);
    }
  },
};
