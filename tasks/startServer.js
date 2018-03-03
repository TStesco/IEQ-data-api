'use strict';

module.exports = function(grunt) {
  grunt.registerTask('startServer', 'Starts the server manually', function() {
    const done = this.async();
    const app = require('app');
    app.once('start', done);
  });
};
