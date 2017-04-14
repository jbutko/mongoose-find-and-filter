/*
 * Extended find method with filter/limit/select/sort options for mongoose
 * Copyright(c)2017 Jozef Butko <jbutko@gmail.com>
 * WTFPL License
 */

'use strict';

module.exports = function(schema) {

  const ObjectId = require('mongoose').Types.ObjectId;

  /**
   * Extended find query with filter/limit/select/sort options for mongoose
   * @param  {object}       query           query
   * @param  {object}       queryParams     query params sent from FE
   * @param  {array}        protectedKeys   protected (not filterable) keys
   * @param  {array}        populate        populate for refs
   * @param  {function}     cb              callback
   * @return {object|array}                 promise/array with found documents
   */
  schema.statics.findAndFilter = function findAndFilter(query, queryParams, protectedKeys, populate, cb) {
    query = query || {};
    queryParams = queryParams || {};
    protectedKeys = protectedKeys || [];
    if (!Array.isArray(protectedKeys)) return 'protectedKeys must be of type array';
    protectedKeys.push('__v');

    // get schema keys
    let schemaKeys = Object.keys(schema.paths);

    // check if we can filter on key
    let filterAttributes = schemaKeys.filter((key) => {
      let isProtectedKey = protectedKeys.indexOf(key) > -1;
      return !isProtectedKey;
    });

    let queryOptions = ['limit', 'skip', 'page', 'sort', 'select', 'populate'];

    // prepare query
    for (let param in queryParams) {
      if (queryOptions.indexOf(param) > -1 && filterAttributes.indexOf(param) > -1)
        query[param] = queryParams[param];

      // _ids are ObjectIds not a string
      if (param == '_id')
        query[param] = ObjectId(queryParams[param]);

      let isProtectedKey = queryOptions.indexOf(param) === -1 && filterAttributes.indexOf(param) === -1;
      if (isProtectedKey)
        return Promise.reject({
          message: `Not allowed to filter by ${param} param`,
          code: 'protectedKeyFilterNotAllowed',
          status: 400
        });
    }

    // find query options
    let options = {
      sort: queryParams.sort || '',
      limit: parseInt(queryParams.limit, 10) || '',
      skip: parseInt(queryParams.skip, 10) || '',
      populate: populate || '',
    };

    return this
      .find(query, queryParams.select || '', options)
      .then((result) => {
        if (cb) return cb(null, result);
        return result;
      })
      .catch((err) => {
        if (cb) return cb({ message: err, status: 400 }, null);
        return { message: err, status: 400 };
      });
  };
};
