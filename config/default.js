module.exports = {
  // Databases.
  database: {
    // MongoDB.
    data: {
      host: 'localhost',
      port: 27017,
      db: 'node',
      reconnectTimeout: 5000, // ms.
    },
    // Redis.
    session: {
      host: 'localhost',
      port: 6379,
      prefix: 'node_',
    },
  },

  // Session cookie.
  session: {
    key: 'SID',
    secret: '1CONNECT Template docx app',
  },

  // Log.
  log: {
    prefix: 'api:',
  },

  // Upload.
  upload: {
    dir: 'uploads/',
  }
};
