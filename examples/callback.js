'use strict';

/**
 * Users endpoint controller
 */
var User = require('./user.model.js');

// public
module.exports = {
  getUsers
};

/// definitions

/**
 * Get users - callback style
 * GET '/users'
 */
function getUsers(req, res, next) {
  let query = { age: { $gte: 0 } }; // default query
  let queryParams = req.query; // query params from FE
  let protectedKeys = ['password']; // protected keys == not searchable/filterable
  let populate = [{
      path: 'contact',
      model: 'Contact',
      populate: {
        path: 'city',
        model: 'City'
      }
    },
    { path: 'job', model: 'Job' }
  ];

  User
    .findAndFilter(query, queryParams, protectedKeys, populate,
      (err, users) => {
        if (err) return next(err);
        // users will be documents with age>1 and further filtered by query sent as query params from FE
        res.status(200).json(users);
      });
}
