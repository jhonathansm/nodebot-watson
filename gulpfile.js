const gulp = require('gulp');

gulp.task('copy-files',() => {
	return(
		gulp.src('./node_modules/ibm-watson/dist/watson.min.js')
		.pipe(gulp.dest("./lib/watson"))
	);
})
gulp.task('builded',()=>{
	return 'Finished! Now we can code!';
})
// gulp.task('default',['copy-files','builded']);

