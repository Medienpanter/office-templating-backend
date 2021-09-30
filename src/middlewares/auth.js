const isUndefined = require('util').isUndefined;
const Token = require('../models/').Token;
const User = require('../models').User;


async function tokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!isUndefined(authHeader)) {
        const reqToken = authHeader.split(' ')[1];
        const token = await Token.findOne({ token: reqToken }).exec();
        if (token) {
            req.user = await User.findOne({ _id: token.user}).exec();
        }
    }
    next();
}

module.exports = {
    tokenMiddleware,
}