const { ServerError } = require('../helpers/server');
const User = require('../models').User;


function requireAuthentication(user) {
  if (!user) {
    throw new ServerError('Authentication is required.', 403);
  }
  return user;
}

async function getUserByCredentials(email, password) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email: email }).select('+password').exec();
    if (!user) {
      return resolve(null);
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return resolve(null);
    }
    return resolve(user);
  });
}

module.exports = {
  requireAuthentication,
  getUserByCredentials,
};
