const removeOldTokens = require('./removeOldTokens');
const removeOldPasswords = require('./removeOldPasswords');

// here will be all crons!
const cronRunner = () => {
  removeOldTokens.start();
  removeOldPasswords.start();
};

module.exports = {
  cronRunner,
};
