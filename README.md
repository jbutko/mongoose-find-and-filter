Mongoose find and filter plugin
=========

[![NPM](https://nodei.co/npm/mongoose-find-and-filter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mongoose-find-and-filter/)

*mongoose-find-and-filter* plugin is a [mongoose](http://www.mongoose.com) plugin which improves the `find` method with filtering and sorting features. You can also limit or skip results and populate refs.

## Installation
```
npm install mongoose-find-and-filter --save
```

You can use this plugin with specific schema or globally for all schemas.<br />
To use it with specific schema:
```javascript
const mongooseFindAndFilter = require('mongoose-find-and-filter');

const userSchema = new Schema({...});

// attach mongoose-find-and-filter plugin to userSchema
userSchema.plugin(mongooseFindAndFilter);
```

If you want to use the plugin globally for all schemas:
```javascript
const mongoose = require('mongoose');
const mongooseFindAndFilter = require('mongoose-find-and-filter');

mongoose.plugin(mongooseFindAndFilter);
```
After attaching `mongoose-find-and-filter` plugin you will have `Model.findAndFilter(...)` method on your model.


## Usage

*Mongoose find and filter* plugin provides support for both promise style as well as callback style queries. Setup for your backend API server (eg. ExpressJS) might look something like this:

### Promise example
```javascript
const User = require('./user.model.js'); // model

/* this is example of User model instance
{
  "_id": "58e0dc934ee10d2f1c2cd0f4",
  "username": "johndoe",
  "contact": "58e68c594ee10d1870493af1", // ref to Contact model
  "updatedAt": "2017-04-05T05:31:00.522Z",
  "createdAt": "2017-02-16T08:32:17.959Z",
  "job": "58f0ab4e62697f2db41b2e69", // ref to Job model
  "age": 10,
  "email": "johndoe@johndoe123.com",
  "surname": "doe",
  "firstName": "john",
  "password": "sdlkfjldksfjcdslkjdslkfjsdflkdsjkfsdfjsdfkf"
}
*/

let query = { age: { $gte: 1 } }; // default query
let queryParams = req.query; // query params from FE
let protectedKeys = ['email']; // protected keys == not searchable/filterable
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

```

### Callback example
```javascript
const User = require('./user.model.js'); // model

let query = { age: { $gte: 0 } }; // default query
let queryParams = req.query; // query params from FE
let protectedKeys = ['email']; // protected keys == not searchable/filterable
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

```

Then if you want to query your endpoint send request in one of the following forms:
```javascript
curl http://localhost:5005/api/v1/users // all users will be returned
curl http://localhost:5005/api/v1/users?username=johndoe // only docs with username=johndoe will be returned
curl http://localhost:5005/api/v1/users?username=johndoe&select=age username // only docs with username=johndoe will be returned and only age and username keys will be selected
curl http://localhost:5005/api/v1/users?username=johndoe&limit=5 // max 5 docs will be returned
curl http://localhost:5005/api/v1/users?username=johndoe&sort=_id // only docs with username=johndoe sorted by _id in ASC order will be returned
curl http://localhost:5005/api/v1/users?email=johndoe@johndoe123.com // request will respond with 400 bad request as email is protected key
curl http://localhost:5005/api/v1/users?_id=58e0dc934ee10d2f1c2cd0f4 // only doc with _id=58e0dc934ee10d2f1c2cd0f4 will be returned
```

## License

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) 2017 Jozef Butko <jbutko@gmail.com>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.
