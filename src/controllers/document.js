const { auth, document } = require('../services');
const { isDocx } = require('../models/Document/validate');

const { requireAuthentication } = auth;
const {   findDocuments, createNewDocument, pushNewDocumentData,
          createNewDocumentVersion, removeDocumentVersion, removeDocument
      } = document;

/**
 * Get list of user's documents.
 * @param {User} user Current user
 * @returns {[Document]} List of documents
 */
function getDocuments(user) {
  requireAuthentication(user);
  return findDocuments({ author: user });
}

/**
 * Create new document with one document version.
 * @param {*} req Request
 * @param {*} res Response
 * @returns {Document} Created document.
 */
function postNewDocument(req, res) {
  requireAuthentication(req.user);
  return createNewDocument(req, res);
}

/**
 * Add new document data.
 * @param {User} user Current user.
 * @param {String} documentId Document id
 * @param {String} versionId Document version id
 * @param {Object} data Data to insert 
 */
function postDocumentRegistration(user, documentId, versionId, data) {
  requireAuthentication(user);
  return pushNewDocumentData(user, documentId, versionId, data);
}

/**
 * Add new document version.
 * @param {*} req Request
 * @param {*} res Response
 * @param {String} documentId Document id
 */
function postDocumentVersion(req, res, documentId) {
  requireAuthentication(req.user);
  return createNewDocumentVersion(req, res, documentId);
}

/**
 * Delete document version from document.
 * @param {User} user Current user.
 * @param {String} versionId Id of document version to delete.
 */
function deleteDocumentVersion(user, versionId) {
  requireAuthentication(user);
  return removeDocumentVersion(user, versionId);
}

/**
 * Delete document with all his versions.
 * @param {User} user 
 * @param {String} documentId 
 */
function deleteDocument(user, documentId) {
  requireAuthentication(user);
  return removeDocument(user, documentId);
}

module.exports = {
  getDocuments,
  postNewDocument,
  postDocumentRegistration,
  postDocumentVersion,
  deleteDocumentVersion,
  deleteDocument,
};
