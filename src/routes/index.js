const express = require('express');

const log = require('../helpers/log');
const { ServerError } = require('../helpers/server');
const controllers = require('../controllers');

const router = express.Router();
const {
  auth,
  home,
  document,
  file,
} = controllers;


const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};
const c = controllerHandler;

/**
 * Auth.
 */
router.post('/signup', c(auth.signup, req => [req.body.email, req.body.password, req.body.firstName, req.body.lastName]));
router.post('/login', c(auth.login, req => [req.body.email, req.body.password]));

/**
 * Home.
 */
router.get('/', c(home.hello));
router.get('/greet/:name', c(home.getGreeting, req => [req.params.name]));
router.post('/greet/', c(home.postGreeting, req => [req.body.name]));

/**
 * Documents.
 */
router.get('/documents', c(document.getDocuments, req => [req.user]));
router.post('/documents', c(document.postNewDocument, (req, res) => [req, res]));

router.delete('/documents/:documentId', c(document.deleteDocument, req => [req.user, req.params.documentId]));

router.post('/documents/:documentId/registrations', c(document.postDocumentRegistration, req => [req.user, req.params.documentId, req.body.versionId, req.body.data]));

router.post('/documents/:documentId/versions', c(document.postDocumentVersion, (req, res, next) => [req, res, req.params.documentId]));
router.delete('/documents/:documentId/versions/:versionId', c(document.deleteDocumentVersion, req => [req.user, req.params.versionId]));

/**
 * Files
 */
router.get('/files/:fileName', file.getFile);

/**
 * Error-handler.
 */
router.use((err, req, res, _next) => {
  if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    log.error('~~~ Unexpected error exception start ~~~');
    log.error(req);
    log.error(err);
    log.error('~~~ Unexpected error exception end ~~~');
  }

  return res.status(status).json({ message: message });
});

module.exports = router;
