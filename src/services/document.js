const unlinkSync = require('fs').unlinkSync;
const { ServerError } = require('../helpers/server');
const { uploadHandler } = require('./file');
const { isDocx } = require('../models/Document/validate');
const Document = require('../models/Document');


function findDocuments(filter = {}) {
  return Document.find(filter).exec();
}

async function createNewDocument(req, res) {
  return await new Promise(async (resolve, reject) => {
    uploadHandler(req, res, (error)=> {
        if (error) {
            return reject(error);
        }
        if (!isDocx(req.file)) {
            log.error('Document is not docx.');
            return reject({ status: 400, message: 'Document is not docx.' });
        }
        const name = req.body.name;
        const tags = JSON.parse(req.body.tags);
        const fields = JSON.parse(req.body.fields);
        const author = req.user;

        const newDocument = new Document();
        newDocument.author = author;
        newDocument.name = name;
        const newVersion = {
          majorVersion: 1,
          minorVersion: 0,
          originalName: req.file.originalname,
          serverName: req.file.filename,
          tags: tags,
          fields: fields
        };
        newDocument.versions.push(newVersion);
        try {
            newDocument.validateSync();
            return resolve(newDocument.save());
        } catch (validateError) {
            throw new ServerError(validateError.message, 400);
        }
    });
  });
}

async function pushNewDocumentData(user, documentId, versionId, data) {
  const document = await Document.findOne({ _id: documentId, author: user}).exec();
  if (!document) {
    throw new ServerError('Document not found.', 400);
  }
  const version = document.versions.id(versionId);
  const inputData = {
    version: `${version.majorVersion}.${version.minorVersion}`,
    data: data
  }
  document.inputs.push(inputData);
  return document.save();
}

async function createNewDocumentVersion(req, res, documentId) {
  const document = await Document.findOne({ _id: documentId, author: req.user}).exec();
  if (!document) {
    throw new ServerError('Document not found.', 404);
  }
  return await new Promise(async (resolve, reject) => {
    uploadHandler(req, res, (error)=> {
        if (error) {
            log.error(error);
            return reject(error);
        }
        if (!isDocx(req.file)) {
            log.error('Document is not docx.');
            return reject({ status: 400, message: 'Document is not docx.' });
        }
        const tags = JSON.parse(req.body.tags);
        const fields = JSON.parse(req.body.fields);
        
        const lastVersion = document.versions[document.versions.length -1];
        let isCompatible = true;

        if (fields.length !== lastVersion.fields.length) {
          isCompatible = false;
        } else {
          fields.forEach(name => {
            if (!lastVersion.fields.includes(name)) {
              isCompatible = false;
            }
          });
        }

        const newVersion = {
          majorVersion: isCompatible ? lastVersion.majorVersion : lastVersion.majorVersion + 1,
          minorVersion: isCompatible ? lastVersion.minorVersion + 1 : 0,
          originalName: req.file.originalname,
          serverName: req.file.filename,
          tags: tags,
          fields: fields
        };
        document.versions.push(newVersion);
        try {
            document.validateSync();
            return resolve(document.save());
        } catch (validateError) {
            throw new ServerError(validateError.message, 400);
        }
    });
  });
}

async function removeDocumentVersion(user, versionId) {
  const document = await Document.findOne({ author: user, 'versions._id': versionId}).exec();
  if (!document) {
    throw new ServerError('Document not found.', 400);
  }
  const fileServerName = document.versions.id(versionId).serverName;
  unlinkSync(`uploads/${fileServerName}`);
  document.versions.id(versionId).remove();
  return document.save();
}

async function removeDocument(user, documentId) {
  const document = await Document.findOne({ _id: documentId, author: user }).exec();
  if (!document) {
    throw new ServerError('Document not found.', 400);
  }
  document.versions.forEach(docVersion => unlinkSync(`uploads/${docVersion.serverName}`));
  return document.remove();
}

module.exports = {
  findDocuments,
  createNewDocument,
  pushNewDocumentData,
  createNewDocumentVersion,
  removeDocumentVersion,
  removeDocument,
};
