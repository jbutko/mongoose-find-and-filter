'use strict';

/**
 * Users endpoint controller
 */
const User = require('./user.model.js');

// public
module.exports = {
  updateUser,
};

/// definitions

/**
 * Get users - promise style
 * GET '/users'
 */
function getUsers(req, res, next) {
  let query = { age: { $gte: 1 } }; // default query
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
  ]; // populate refs

  User
    .findAndFilter(query, queryParams, protectedKeys, populate)
    .then((users) => {
      // users will be documents with age>1 and further filtered by query sent as query params from FE
      res.status(200).json(users);
    })
    .catch((err) => {
      return next(err);
    });
}
