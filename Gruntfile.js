module.exports = function(grunt) {
  grunt.initConfig({
    typescript: {
      base: {
        src: ['d.ts/**/*.ts', '*.ts'],
        dest: '__compiled.js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          base_path: './',
          sourcemap: true,
          fullSourceMapPath: true,
          declaration: true,
        }
      }
    },
/*
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
*/
  });

  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['typescript']);
};
