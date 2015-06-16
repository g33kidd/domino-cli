var sass = require('node-sass');
var importOnce = require('node-sass-import-once');

module.exports = {

  compileSass: function(file) {
    sass.render({
      file: file,
      importer: importOnce,
      importOnce: {
        index: false,
        css: false,
        bower: true
      },
      outputStyle: 'compressed'
    }, function(error, result) {
      if(error) {
        console.log(error.status);
        console.log(error.column);
        console.log(error.message);
        console.log(error.line);
      }else{
        console.log(result.css.toString());
        console.log(result.stats);
      }
    });
  }

};