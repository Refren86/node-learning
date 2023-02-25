const userNormalizer = (user) => {
  const { password, ...otherData } = user;
  return otherData;
};

const usersNormalizer = (users) => {
  return users.map((user) => userNormalizer(user));
};

module.exports = {
  userNormalizer,
  usersNormalizer,
};
