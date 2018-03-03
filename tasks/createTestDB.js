/**
 * createTestDB - Grunt task that creates an empty database for testing.
 */

'use strict';

const mysql = require('mysql-plus');

module.exports = function(grunt) {
  grunt.registerTask('createTestDB', 'Creates an empty test database', function() {
    const done = this.async();

    const database = process.env.MYSQL_DATABASE;
    const db = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
    });

    db.query('DROP DATABASE IF EXISTS ??', database, err => {
      if (err) throw err;

      db.query('CREATE DATABASE ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', database, err => {
        if (err) throw err;
        grunt.log.ok(`Created empty database "${database}"`);
        done();
      });
    });
  });
};
