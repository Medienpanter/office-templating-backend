const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Session = require('express-session');
const morgan = require('morgan');
const config = require('config');
const passport = require('passport');
const mongoConnect = require('connect-mongo');
const path = require('path');

const log = require('./helpers/log');
const databases = require('./databases');
const routes = require('./routes');
const { tokenMiddleware, corsMiddleware } = require('./middlewares');

const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);

// Databases.
databases.mongodb();

// Static.
app.use(express.static(path.join(__dirname, 'uploads')))

// Cors.
app.use(corsMiddleware);

// Body.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Auth.
app.use(tokenMiddleware);

// Logging (debug only).
app.use(morgan('combined', { stream: { write: msg => log.info(msg) } }));

// URLs.
app.use('/', routes);

server.listen(PORT);
log.info(`API listening on port ${PORT}`);

module.exports = server;
