module.exports = function(grunt) {
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.config.merge({
		compatVersion: "edge",
		deploy_mode: "html_repo",
		compress: {
			main: {
				options: {
					archive: "dist/deploy-staffResourceRequest.zip"
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
