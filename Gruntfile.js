'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  // initialize grunt
  grunt.initConfig({

    // create jshint task
    jshint: {
      dev: {
        // tell jshint what check
        src: ['Gruntfile.js', 'server.js', 'lib/**/*.js', 'test/**/*.js', 'models/**/*.js', 'routes/**/*.js']
      },
      // bring in options from .jshintrc
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //create jscs task
    jscs: {
      dev: {
        //tell jscs to check the same file as jshint
        src: ['<%= jshint.dev.src %>']
      }
    },

    //create simplemocha task
    simplemocha: {
      dev: {
        //tell simple mocha where the test files are
        src: ['test/**/*.js']
      }
    },

    //use watch to keep testing files
    watch: {
      //tell watch to watch the same files as jshint and simplemocha
      files: ['<%= jshint.dev.src %>', '<%= simplemocha.dev.src %>'],
      //tell watch to run jshint and simplemocha
      tasks: ['jshint', 'simplemocha']
    }
  });

  //register jshint and jscs as task named test
  grunt.registerTask('test', ['jshint:dev'], ['jscs:dev']);
  //register simplemocha as task named mocha
  grunt.registerTask('mocha', ['simplemocha:dev']);
  //register default taks to run test and mocha and then use watch to keep them running
  grunt.registerTask('default', ['test', 'mocha', 'watch']);
}
