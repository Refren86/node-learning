const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ApiError } = require('../error/api.error');
const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  FORGOT_PASS_SECRET,
  CONFIRM_ACCOUNT_SECRET,
} = require('../config/config');
const {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  FORGOT_PASS_TOKEN,
  CONFIRM_ACCOUNT_TOKEN,
} = require('../enums/token.enum');

module.exports = {
  hashPassword: (password) => bcrypt.hash(password, 10),

  comparePasswords: async (hashedPass, password) => {
    const isSamePasswords = await bcrypt.compare(password, hashedPass);

    if (!isSamePasswords) {
      throw new ApiError('Wrong email or password', 400);
    }
  },

  compareOldPasswords: (hashedPass, password) => {
    return bcrypt.compare(password, hashedPass);
  },

  generateTokenPair: (payload = {}) => {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: '7d',
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  },
  // to restore password/confirm account/confirm sign up etc.
  generateActionToken: (tokenType = '', payload = {}) => {
    let secretWord = '';

    switch (tokenType) {
      case FORGOT_PASS_TOKEN:
        secretWord = FORGOT_PASS_SECRET;
        break;
      case CONFIRM_ACCOUNT_TOKEN:
        secretWord = CONFIRM_ACCOUNT_SECRET;
        break;
      default:
        break;
    }

    return jwt.sign(payload, secretWord, {
      expiresIn: '7d',
    });
  },

  checkToken: (token = '', tokenType = ACCESS_TOKEN) => {
    try {
      let secret = '';

      switch (tokenType) {
        case ACCESS_TOKEN:
          secret = ACCESS_SECRET;
          break;
        case REFRESH_TOKEN:
          secret = REFRESH_SECRET
          break;
        case FORGOT_PASS_TOKEN:
          secret = FORGOT_PASS_SECRET
          break;
        default:
          break;
      }

      return jwt.verify(token, secret);
    } catch (err) {
      throw new ApiError(`${tokenType} is expired/invalid`, 401);
    }
  },
};
