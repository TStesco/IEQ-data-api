/**
 * Database connection configuration
 */

'use strict';

module.exports = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'atmena_main',
  charset: 'utf8mb4_unicode_ci',
  supportBigNumbers: true,
  bigNumberStrings: true,
};
