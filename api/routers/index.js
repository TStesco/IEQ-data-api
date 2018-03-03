/**
 * Routers
 *
 * Provides on object of routers for each API version.
 */

/* eslint-disable global-require, no-sync */

'use strict';

const fs = require('fs');

// Export the routers first so that they can be used by the controllers
module.exports = {
  v1: require('./v1'),
};

// Require all of the controllers to add their routes to the routers
const controllersDir = __dirname + '/../controllers';
fs.readdirSync(controllersDir).forEach(controller => {
  if (!controller.endsWith('.js')) return; // Skip things that aren't .js files
  require(controllersDir + '/' + controller);
});
