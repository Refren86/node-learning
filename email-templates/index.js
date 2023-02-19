const { WELCOME, FORGOT_PASS } = require("../enums/email.enum");

module.exports = {
  [WELCOME]: {
    subject: 'Welcome onboard!',
    templateName: WELCOME,
  },
  [FORGOT_PASS]: {
    subject: 'Your new password',
    templateName: FORGOT_PASS,
  },
};