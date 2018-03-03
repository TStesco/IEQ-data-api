'use strict';

const log4js = require('log4js');

const NODE_ENV = process.env.NODE_ENV === 'development' ? null : process.env.NODE_ENV;

if (NODE_ENV && process.env.API_APP_LOG) {
  log4js.configure({
    appenders: [
      {type: 'file', filename: process.env.API_APP_LOG, category: NODE_ENV},
    ],
    levels: {
      production: 'ERROR',
      test: 'WARN',
    },
  });
}

module.exports = log4js.getLogger(NODE_ENV);
