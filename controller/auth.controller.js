const { WEB_URL } = require('../config/config');
const { authService, emailService, userService } = require('../service');
const {
  generateTokenPair,
  generateActionToken,
  hashPassword,
} = require('../helpers/security');
const { WELCOME, FORGOT_PASS } = require('../enums/email.enum');
const { FORGOT_PASS_TOKEN } = require('../enums/token.enum');
const { actionTokenSchema, oldPasswordSchema } = require('../dataBase');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { user, body } = req;

      await user.comparePasswords(body.password);

      const tokenPair = generateTokenPair({
        id: user._id,
      });

      await authService.create({ ...tokenPair, _userId: user._id });
      await emailService.sendEmail(user.email, WELCOME, {
        userName: user.name,
      });

      res.json({ user, ...tokenPair });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken, _userId } = req.tokensInfo;

      await authService.deleteOneByParams({ refreshToken }); // delete old tokens data to keep db clean :)

      const tokenPair = generateTokenPair({ id: _userId });

      await authService.create({ ...tokenPair, _userId });

      res.status(201).json({ ...tokenPair, user: { _id: _userId } });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { accessToken } = req.tokensInfo;
      await authService.deleteOneByParams({ accessToken }); // delete old tokens data to keep db clean :)
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  logoutAll: async (req, res, next) => {
    try {
      const { _userId } = req.tokensInfo;
      await authService.deleteManyByParams({ _userId }); // deletes all tokens data for specified user
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const user = req.user;

      const actionToken = generateActionToken(FORGOT_PASS_TOKEN, {
        email: user.email,
      });
      const forgotPassUrl = `${WEB_URL}/password/new?token=${actionToken}`;

      await actionTokenSchema.create({
        token: actionToken,
        _userId: user._id,
        tokenType: FORGOT_PASS_TOKEN,
      });
      await emailService.sendEmail(user.email, FORGOT_PASS, { forgotPassUrl });

      res.status(201).json(actionToken);
    } catch (error) {
      next(error);
    }
  },

  setNewPasswordAfterForgot: async (req, res, next) => {
    try {
      const { body, user } = req;

      const hashedPassword = await hashPassword(body.password);

      await oldPasswordSchema.create({ _userId: user._id, password: user.password });
      await actionTokenSchema.deleteOne({ token: req.get('Authorization') }); // delete token because it can be used only once!
      await userService.updateById(user._id, { password: hashedPassword });

      res.json({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  },
};
