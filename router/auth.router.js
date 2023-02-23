const router = require('express').Router();

const { authMiddleware, userMiddleware } = require('../middleware');
const { authController } = require('../controller');

router.post(
  '/login',
  authMiddleware.isLoginBodyValid,
  userMiddleware.checkIfUserExistsDynamically('email'),
  authController.login
);

router.post(
  '/refresh',
  authMiddleware.checkRefreshToken,
  authController.refresh
);

router.post(
  '/logout',
  authMiddleware.checkAccessToken,
  authController.logout
);

router.post(
  '/logoutAll',
  authMiddleware.checkAccessToken,
  authController.logoutAll
);

router.post(
  '/password/forgot',
  userMiddleware.checkIfUserExistsDynamically('email'),
  authController.forgotPassword
);
// when user enters new password and confirms it
router.put(
  '/password/forgot',
  authMiddleware.isPasswordValid,
  authMiddleware.checkActionToken,
  authMiddleware.checkOldUserPasswords,
  authController.setNewPasswordAfterForgot
);

module.exports = router;
