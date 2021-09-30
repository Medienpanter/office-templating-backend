const passport = require('passport');
const uuidv4 = require('uuid/v4');

const { ServerError } = require('../helpers/server');
require('../helpers/passport-strategies');
const getUserByCredentials = require('../services/auth').getUserByCredentials;
const { createToken } = require('../services').token;
const User = require('../models').User;


async function login(email, password) {
  return await new Promise(async (resolve, reject) => {
    const user = await getUserByCredentials(email, password);
    if (!user) {
      return reject({ status: 400, message: 'Bad credentials.' });
    }
    const token = uuidv4();
    const newToken = await createToken(token, user);
    if (!newToken) {
      return reject();
    }
    return resolve({ key: token });
  });
}

async function signup(email, password, firstName, lastName) {
  const user = await User.findOne({ email: email }).exec();
  if (user) {
    throw { status: 400, message: 'There is already an account using this email address.' };
  }
  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.firstName = firstName;
  newUser.lastName = lastName;

  try {
    return await newUser.save();
  } catch (error) {
    throw { status: 400, message: error.message };
  }
}

module.exports = {
  signup,
  login,
};
