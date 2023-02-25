const router = require('express').Router();

const { userController } = require('../controller');
const { userMiddleware, authMiddleware, fileMiddleware } = require('../middleware');

// NB! First validate incoming data, then goes db validations 
// checkAccessToken - makes endpoint protected!

router.get('/', userController.getAllUsers);

router.post(
  '/',
  userMiddleware.checkIfNewUserValid,
  userMiddleware.checkUserCreateData,
  userMiddleware.normalizeUserData,
  userMiddleware.checkIfEmailIsUnique,
  userController.addUser
);

router.get(
  '/:userId',
  userMiddleware.checkIfUserIdValid,
  authMiddleware.checkAccessToken,
  userMiddleware.checkIfUserExistsDynamically('userId', 'params', '_id'),
  userController.getUserById
);

router.put(
  '/:userId',
  userMiddleware.checkIfUserIdValid,
  userMiddleware.checkIfEditUserValid,
  authMiddleware.checkAccessToken,
  userMiddleware.checkIfUserExistsDynamically('userId', 'params', '_id'),
  userMiddleware.checkUserUpdateData,
  userMiddleware.normalizeUserData,
  userController.updateUser,
);

router.delete(
  '/:userId',
  userMiddleware.checkIfUserIdValid,
  authMiddleware.checkAccessToken,
  userMiddleware.checkIfUserExistsDynamically('userId', 'params', '_id'),
  userController.deleteUser
);

router.patch(
  '/:userId/avatar',
  fileMiddleware.checkUploadImage,
  userMiddleware.checkIfUserIdValid,
  authMiddleware.checkAccessToken,
  userMiddleware.checkIfUserExistsDynamically('userId', 'params', '_id'),
  userController.uploadAvatar,
);

module.exports = router;
