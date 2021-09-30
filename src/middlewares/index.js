const { tokenMiddleware } = require('./auth');
const { corsMiddleware } = require('./cors');

module.exports = {
    tokenMiddleware,
    corsMiddleware,
}