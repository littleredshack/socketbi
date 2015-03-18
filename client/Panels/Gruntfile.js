module.exports = function(grunt) { 
	grunt.initConfig({ 
		pkg: grunt.file.readJSON('package.json'), 
		concat: { 
			options: { 
				separator: ';' }, 
				dist: {
					src: ['src/libs/*.js','src/js/*.js'], 
					dest: 'dist/js/<%=pkg.name%>.js' 
				} 
			}, 
		copy: { 
			main: { 
				src: 'src/css/main.css', 
				dest: 'dist/css/main.css', 
			}, 
		}, 
		targethtml: { 
			dist: { 
				files: { 
					'dist/index.html': 'src/index.html' 
				} 
			} 
		}
	}); 
	grunt.loadNpmTasks('grunt-contrib-concat'); 
	grunt.loadNpmTasks('grunt-contrib-copy'); 
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.registerTask('default', ['concat', 'targethtml', 'copy']); 
};

