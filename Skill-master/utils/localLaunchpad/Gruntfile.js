module.exports = function (grunt) {
  grunt.config.merge({
    clean: {
      ui: ['webapp/ui'],
    },
    copy: {
      skill: {
        expand: true,
        cwd: '../../app/skill/dist/',
        src: '**',
        dest: 'webapp/ui/skill',
      },
      catalog: {
        expand: true,
        cwd: '../../app/catalog/dist/',
        src: '**',
        dest: 'webapp/ui/skill-catalog',
      },
      proficiency: {
        expand: true,
        cwd: '../../app/proficiency/dist/',
        src: '**',
        dest: 'webapp/ui/skill-proficiency',
      },
      upload: {
        expand: true,
        cwd: '../../app/upload/dist/',
        src: '**',
        dest: 'webapp/ui/skill-upload',
      },
      download: {
        expand: true,
        cwd: '../../app/download/dist/',
        src: '**',
        dest: 'webapp/ui/skill-download',
      },
    },
    symlink: {
      options: {
        overwrite: false,
        force: false,
      },
      skill: {
        src: '../../app/skill/webapp',
        dest: 'webapp/ui/skill',
      },
      catalog: {
        src: '../../app/catalog/webapp',
        dest: 'webapp/ui/skill-catalog',
      },
      proficiency: {
        src: '../../app/proficiency/webapp',
        dest: 'webapp/ui/skill-proficiency',
      },
      upload: {
        src: '../../app/upload/webapp',
        dest: 'webapp/ui/skill-upload',
      },
      download: {
        src: '../../app/download/webapp',
        dest: 'webapp/ui/skill-download',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.registerTask('collectUI', ['clean:ui', 'copy']);
  grunt.registerTask('setupSymlinks', ['clean:ui', 'symlink']);
};
