module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_DB_URL: process.env.MONGO_DB_URL || '',

  WEB_URL: process.env.WEB_URL || '',

  ACCESS_SECRET: process.env.ACCESS_SECRET || 'secretAccessWord',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'secretRefreshWord',
  FORGOT_PASS_SECRET: process.env.FORGOT_PASS_SECRET || 'secretForgotPassWord',
  CONFIRM_ACCOUNT_SECRET:
    process.env.CONFIRM_ACCOUNT_SECRET || 'secretConfirmAccountWord',

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL || '',
  NO_REPLY_EMAIL_PASS: process.env.NO_REPLY_EMAIL_PASS || '',

  S3_REGION: process.env.S3_REGION,
  S3_USER_PASS: process.env.S3_USER_PASS,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_BUCKET_URL: process.env.S3_BUCKET_URL,
  S3_USER_SIGN_IN_URL: process.env.S3_USER_SIGN_IN_URL,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
};
