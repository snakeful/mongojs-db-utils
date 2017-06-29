module.exports = function (app, db) {
  app.createCRUDManager = function (coll) {
    return {
      count: function (query = {}) {
        return new Promise((resolve, reject) => {
          db[coll].count(query, (err, count) => {
            if (err) {
              reject(err);
            }
            resolve(count);
          }, reject);
        });
      },
      getAll: function (query = {}, proj = {}, sort = {}) {
        return new Promise((resolve, reject) => {
          db[coll].find(query, proj).sort(sort, (err, objects) => {
            if (err) {
              reject(err);
            }
            resolve(objects);
          }, reject);
        });
      },
      get: function (query = {}, offset = 0, limit = 100, proj = {}, sort = {}) {
        return new Promise((resolve, reject) => {
          db[coll].find(query, proj).limit(limit || 100).skip(offset || 0).sort(sort, (err, objects) => {
            if (err) {
              reject(err);
            }
            resolve(objects);
          }, reject);
        });
      },
      getOne: function (query = {}, proj) {
        return new Promise((resolve, reject) => {
          db[coll].findOne(query, proj, (err, object) => {
            if (err) {
              reject(err);
            }
            resolve(object);
          }, reject);
        });
      },
      create: function (object) {
        return new Promise((resolve, reject) => {
          db[coll].insert(object, (err, created) => {
            if (err) {
              reject(err);
            }
            resolve(created);
          }, reject);
        });
      },
      update: function (query) {
        return new Promise((resolve, reject) => {
          db[coll].findAndModify(query, (err, updated) => {
            if (err) {
              reject(err);
            }
            resolve(updated);
          }, reject);
        });
      },
      remove: function (query = {}) {
        return new Promise((resolve, reject) => {
          db[coll].remove(query, (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }, reject);
        });
      },
      distinct: function (fields, query) {
        return new Promise((resolve, reject) => {
          db[coll].distinct(fields, query, (err, distinct) => {
            if (err) {
              reject(err);
            }
            resolve(distinct);
          }, reject);
        });
      },
      aggregates: function (query, offset = 0, limit = 100) {
        return new Promise((resolve, reject) => {
          db[coll].aggregate(query).limit(limit || 100).skip(offset || 0, (err, aggregate) => {
            if (err) {
              reject(err);
            }
            resolve(aggregate);
          }, reject);
        });
      },
      initializeOrderedBulkOp: function () {
        return db[coll].initializeOrderedBulkOp();
      },
      initializeUnorderedBulkOp: function () {
        return db[coll].initializeUnorderedBulkOp();
      }
    };
  };
};