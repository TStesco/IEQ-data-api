/* eslint-disable global-require, camelcase */

'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
  })({
    customTasksDir: 'tasks',
  });

  grunt.initConfig({
    symlink: {
      all: {
        files: {
          'node_modules/app.js': 'app.js',
          'node_modules/class': 'class',
          'node_modules/db': 'db',
          'node_modules/io.js': 'io.js',
          'node_modules/logger.js': 'logger.js',
          'node_modules/test': 'test',
        },
      },
    },

    eslint: {
      all: ['*.js', '@(api|class|db|tasks|test)/**/*.js'],
    },

    env: {
      options: {
        MYSQL_DATABASE: 'atmena_api_test',
      },
      dev: {
        NODE_ENV: 'development',
      },
      prod: {
        NODE_ENV: 'production',
        API_ACCESS_LOG: __dirname + '/_logs/access-production.log',
        API_APP_LOG: __dirname + '/_logs/app-production.log',
      },
      test: {
        NODE_ENV: 'test',
        API_ACCESS_LOG: __dirname + '/_logs/access-test.log',
        API_APP_LOG: __dirname + '/_logs/app-test.log',
      },
    },

    mkdir: {
      logs: {
        options: {
          create: ['_logs'],
        },
      },
    },

    express: {
      app: {
        options: {
          script: 'app.js',
        },
      },
    },

    watch: {
      files: '@(api|db)/**/*.js',
      tasks: ['express:dev'],
      options: {
        spawn: false,
      },
    },

    mochaTest: {
      unit: {
        src: 'test/unit/**/*.test.js',
      },
      integration: {
        src: 'test/integration/**/*.test.js',
      },
      options: {
        require: ['should', 'should-sinon'],
      },
    },

    mocha_istanbul: {
      coverage: {
        src: [
          'test/utils/startServer.js', // Hack to wait for the server to start before running tests
          'test/**/*.test.js',
        ],
        options: {
          reportFormats: ['html'],
        },
      },
      options: {
        mochaOptions: ['--colors'],
        require: ['should', 'should-sinon'],
      },
    },

    apidoc: {
      internal: {
        src: 'api/controllers/',
        dest: 'apidoc/dist',
        options: {
          includeFilters: ['.*\\.doc\\.js$'],
        },
      },
    },
  });

  // Register tasks
  grunt.registerTask('dev', ['env:dev', 'express', 'watch']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('coverageSetup', ['env:test', 'mkdir:logs', 'createTestDB']);
  grunt.registerTask('testSetup', ['coverageSetup', 'startServer']);
  grunt.registerTask('test:unit', ['testSetup', 'mochaTest:unit']);
  grunt.registerTask('test:integration', ['testSetup', 'mochaTest:integration']);
  grunt.registerTask('test', ['testSetup', 'mochaTest']);
  grunt.registerTask('coverage', ['coverageSetup', 'mocha_istanbul']);
  grunt.registerTask('doc', ['apidoc', 'apiDocToMarkdown']);
  grunt.registerTask('default', ['lint', process.env.CI_SERVER ? 'coverage' : 'test']);
};
