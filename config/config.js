module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_DB_URL: process.env.MONGO_DB_URL || '',

  WEB_URL: process.env.WEB_URL || '',

  ACCESS_SECRET: process.env.ACCESS_SECRET || 'secretAccessWord',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'secretRefreshWord',
  FORGOT_PASS_SECRET: process.env.FORGOT_PASS_SECRET || 'secretForgotPassWord',
  CONFIRM_ACCOUNT_SECRET: process.env.CONFIRM_ACCOUNT_SECRET || 'secretConfirmAccountWord',

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL || '',
  NO_REPLY_EMAIL_PASS: process.env.NO_REPLY_EMAIL_PASS || '',
};