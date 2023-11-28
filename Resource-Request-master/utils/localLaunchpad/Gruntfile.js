/*global module */

module.exports = function (grunt) {
    'use strict';
    grunt.config.merge({
        clean: {
            ui: ["webapp/ui"]
        },
        copy: {
            manageResourceRequest: {
                expand: true,
                cwd: "../../app/manageResourceRequest/dist/",
                src: "**",
                dest: "webapp/ui/manageResourceRequest"
            },
            staffResourceRequest: {
                expand: true,
                cwd: "../../app/staffResourceRequest/dist/",
                src: "**",
                dest: "webapp/ui/staffResourceRequest"
            },
            resourceRequestLibrary: {
                expand: true,
                cwd: "../../app/resourceRequestLibrary/dist/",
                src: "**",
                dest: "webapp/ui/resourceRequestLibrary"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('collectUI',
        [
            'clean:ui',
            'copy:manageResourceRequest',
            'copy:staffResourceRequest',
            'copy:resourceRequestLibrary'
        ]);
};