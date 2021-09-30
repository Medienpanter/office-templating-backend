const { downloadFile } = require('../services').file;
const { requireAuthentication } = require('../services').auth;


function getFile(req, res, next) {
    requireAuthentication(req.user);
    downloadFile(req, res, next);
}

module.exports = {
    getFile
}