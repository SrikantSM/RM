/* global module */
module.exports = function (grunt) {
  "use strict";
  grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.config.merge({
    compatVersion: "edge",
    // eslint-disable-next-line camelcase
    deploy_mode: "html_repo",
    compress: {
      main: {
        options: {
          archive: "dist/deploy-download.zip"
        },
        files: [{
          expand: true,
          cwd: "dist/",
          src: ["**/*"],
          dest: "/"
        }]
      }
    }
  });
  grunt.registerTask("default", [
    "clean",
    "build",
    "compress"
  ]);
};
