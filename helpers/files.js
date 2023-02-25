const path = require('node:path');

// 1st - avatar.jpg, 2nd - user/car etc, 3rd - userId, carId etc
const buildFileName = (fileName, itemType, itemId) => {
  const extName = path.extname(fileName); // avatar.jpg => .jpg
  return `${itemType}/${itemId}/${crypto.randomUUID()}${extName}`;
}

module.exports = {
  buildFileName,
};