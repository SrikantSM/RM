module.exports = function(grunt) {
	grunt.loadNpmTasks("grunt-run");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.initConfig({
	  run: {
			options: {
		  failOnError: true,
			},
			main: {
		  exec: "npm run build",
			}
	  },
	  clean: {
		  main: ["dist/resources", "dist/test"]
		},
	  copy: {
			xsapp: {
		  expand: true,
		  src: "xs-app.json",
		  dest: "dist/",
			},
			flatten: {
				expand: true,
				cwd: "dist/resources/resourceRequestLibrary",
				src: "**",
				dest: "dist/",
			}
	  },
	  compress: {
			main: {
		  options: {
					archive: "dist/deploy-resourceRequestLibrary.zip",
		  },
		  files: [
					{
			  expand: true,
			  cwd: "dist/",
			  src: ["**/*"],
			  dest: "/",
					},
		  ],
			},
	  }
	});
	grunt.registerTask("default", [
		"run",
		"copy:xsapp",
		"copy:flatten",
		"clean",
		"compress"
	]);
};
