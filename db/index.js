/**
 * Database Connection
 */

'use strict';

const config = require('./config');
const mysql = require('mysql-plus');

const db = mysql.createPool(config);

module.exports = db;
