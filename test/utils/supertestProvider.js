/**
 * supertestProvider
 *
 * Exports a function that returns a new supertest instance based
 * on the passed in URL base path.
 */

'use strict';

const app = require('app');
const supertest = require('supertest');

function supertestProvider(basePath) {
  basePath = basePath || '';

  const request = supertest(app);

  // Hijack the request methods to inject the URL base path for every request
  ['get', 'post', 'put', 'head', 'del'].forEach(method => {
    const action = request[method];
    request[method] = function() {
      if (arguments.length) {
        arguments[0] = basePath + arguments[0];
      }
      return action.apply(this, arguments);
    };
  });

  return request;
}

module.exports = supertestProvider;
