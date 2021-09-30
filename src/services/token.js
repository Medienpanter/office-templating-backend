const Token = require('../models').Token;

async function createToken(token, user) {
    await removeOldTokens(user);
    const newToken = new Token({ token: token, user: user }).save();
    return newToken;
}

async function removeOldTokens(user) {
    const cb = await Token.find({ user: user}).remove().exec();
}

module.exports = {
    createToken
}