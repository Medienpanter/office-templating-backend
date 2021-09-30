const multer = require('multer');
const config = require('config');
const uuidv4 = require('uuid/v4');
const Document = require('../models').Document;

const uploadDir = config.get('upload.dir');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${uuidv4()}.docx`)
});

const uploadHandler = multer({ storage: storage }).single('file');

async function downloadFile(req, res, next) {
    const fileName = req.params.fileName;
    const document = await Document.findOne({ author: req.user, 'versions.serverName': fileName }).exec();
    if (!document) {
        throw new ServerError('Document not found.', 400);
    }
    const options = {
        root: __dirname + '../../../uploads/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
    
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', fileName);
        }
      });
}

module.exports = {
    uploadHandler,
    downloadFile
}
