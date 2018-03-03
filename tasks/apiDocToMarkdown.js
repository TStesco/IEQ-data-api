/**
 * apiDocToMarkdown - Grunt task that converts produced apiDoc to markdown.
 */

'use strict';

const exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerTask('apiDocToMarkdown', 'Creates markdown documentation from the generated apiDoc files', function() {
    const done = this.async();
    const command = 'node node_modules/apidoc-markdown/index.js -p apidoc/dist -o api/README.md -t apidoc/template.ejs';

    exec(command, (error, stdout) => {
      if (error) {
        grunt.fail.fatal(error);
      }
      grunt.log.ok(stdout);
      done();
    });
  });
};
