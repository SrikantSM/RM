
/*global module */

module.exports = function (grunt) {
    'use strict';
    grunt.config.merge({
        clean: {
            ui: ["webapp/ui"]
        },
        copy: {
            site_app_confApplication: {
                files:[
                {
                    expand: true,
                    cwd: "../../app/capacityGridUi/dist/",
                    src: "**",
                    dest: "webapp/ui/capacityGridUi"
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('collectUI', ['clean:ui', 'copy']);
};