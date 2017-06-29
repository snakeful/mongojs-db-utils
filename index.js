function logError (err) {
  let log = '';
  if (err instanceof Object) {
    if (err.message) {
      log += err.message + '\n';
    }
    if (err.stack) {
      log += err.stack + '\n';
    }
  }
}
function throwError (err, res) {
  if (!res.headersSent) {
    res.status(err.status || 500).json(err instanceof Object ? {
      error: err.error || err.message
    } : {
      error: err
    });
  }
  if (err instanceof Object) {
    Object.assign(err, {
      date: new Date().toISOString(),
      userId: res.req.userId
    });
  }
  logError(err);
}
function error (error, status, data) {
  error = error instanceof Object ? error : {
    status: status || 500,
    error: error
  };
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      error[prop] = data[prop];
    }
  }
  return error;
}
const dbUtils = require('./utils/db-utils');
module.exports = function (app) {
  const mongo = require('mongojs');
  app.Id = mongo.ObjectId;
  return function (dbName, dbCollections) {
    const db = mongo(dbName, dbCollections);
    dbUtils(app, db);
    dbCollections.forEach((coll) => {
      app[coll] = app.createCRUDManager(coll);
    });
    app.log = logError;
    app.throw = throwError;
    app.error = error;
    return db;
  };
};
