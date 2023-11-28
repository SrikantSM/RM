/*global module */

module.exports = function (grunt) {
    'use strict';
    grunt.config.merge({
        clean: {
            ui: ["webapp/ui"]
        },
        copy: {
            myProjectExperienceUi: {
                expand: true,
                cwd: "../../app/myProjectExperienceUi/dist/",
                src: "**",
                dest: "webapp/ui/myProjectExperienceUi"
            },
            projectRoleUi: {
                expand: true,
                cwd: "../../app/projectRoleUi/dist/",
                src: "**",
                dest: "webapp/ui/projectRoleUi"
            },
            availabilityUploadUi: {
                expand: true,
                cwd: "../../app/availabilityUploadUi/dist/",
                src: "**",
                dest: "webapp/ui/availabilityUploadUi"
            },
            availabilityUpload: {
                expand: true,
                cwd: "../../app/availabilityUpload/dist/",
                src: "**",
                dest: "webapp/ui/availabilityUpload"
            },
            availabilityDownload: {
                expand: true,
                cwd: "../../app/availabilityDownload/dist/",
                src: "**",
                dest: "webapp/ui/availabilityDownload"
            },
            businessServiceOrgUi: {
                expand: true,
                cwd: "../../app/businessServiceOrgUi/dist/",
                src: "**",
                dest: "webapp/ui/businessServiceOrgUi"
            },
            businessServiceOrgUpload: {
                expand: true,
                cwd: "../../app/businessServiceOrgUpload/dist/",
                src: "**",
                dest: "webapp/ui/businessServiceOrgUpload"
            },
            replicationScheduleUi: {
                expand: true,
                cwd: "../../app/replicationScheduleUi/dist/",
                src: "**",
                dest: "webapp/ui/replicationScheduleUi"
            },
            myResourcesUi: {
                expand: true,
                cwd: "../../app/myResourcesUi/dist/",
                src: "**",
                dest: "webapp/ui/myResourcesUi"
            },
            myAssignmentsUi: {
                expand: true,
                cwd: "../../app/myAssignmentsUi/dist/",
                src: "**",
                dest: "webapp/ui/myAssignmentsUi"
            }
        },
        symlink: {
            options: {
                overwrite: false,
                force: false
            },
            myProjectExperienceUi: {
                src: "../../app/myProjectExperienceUi/webapp",
                dest: "webapp/ui/myProjectExperienceUi"
            },
            projectRoleUi: {
                src: "../../app/projectRoleUi/webapp",
                dest: "webapp/ui/projectRoleUi"
            },
            availabilityUploadUi: {
                src: "../../app/availabilityUploadUi/webapp",
                dest: "webapp/ui/availabilityUploadUi"
            },
            availabilityUpload: {
                src: "../../app/availabilityUpload/webapp",
                dest: "webapp/ui/availabilityUpload"
            },
            availabilityDownload: {
                src: "../../app/availabilityDownload/webapp",
                dest: "webapp/ui/availabilityDownload"
            },
            businessServiceOrgUi: {
                src: "../../app/businessServiceOrgUi/webapp",
                dest: "webapp/ui/businessServiceOrgUi"
            },
            businessServiceOrgUpload: {
                src: "../../app/businessServiceOrgUpload/webapp",
                dest: "webapp/ui/businessServiceOrgUpload"
            },
            replicationScheduleUi: {
                src: "../../app/replicationScheduleUi/webapp",
                dest: "webapp/ui/replicationScheduleUi"
            },
            myResourcesUi: {
                src: "../../app/myResourcesUi/webapp",
                dest: "webapp/ui/myResourcesUi"
            },
            myAssignmentsUi: {
                src: "../../app/myAssignmentsUi/webapp",
                dest: "webapp/ui/myAssignmentsUi"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.registerTask('collectUI', [
        'clean:ui',
        'copy:myProjectExperienceUi',
        'copy:projectRoleUi',
        'copy:availabilityUploadUi',
        'copy:availabilityUpload',
        'copy:availabilityDownload',
        'copy:businessServiceOrgUi',
        'copy:businessServiceOrgUpload',
        'copy:myResourcesUi',
        'copy:replicationScheduleUi',
        'copy:myAssignmentsUi'
    ]);
    grunt.registerTask('setupSymlinks', ['clean:ui', 'symlink']);
};
