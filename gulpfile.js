//引入gulp工具1
var gulp = require("gulp");
//将多个文件合并为一个文件
var concat = require('gulp-concat');
//压缩文件
var uglify = require('gulp-uglify');
//将angularjs 模板压缩并缓存
var templateCache = require('gulp-angular-templatecache');
var ngHtml2Js = require("gulp-ng-html2js");
//将gulp任务按照顺序队列执行
var runSequence = require('run-sequence');
//gulp删除文件目录
var del = require('del');
//gulp逻辑判断
var gulpif  = require('gulp-if');//if判断，用来区别生产环境还是开发环境的




/**
 * 推荐
 * 将html模板页面 以angularjs的方式 压缩并缓存
 * */
gulp.task('angularTemplateCache', function () {
    return gulp.src(['template/*.html','template/**/*.html'])
        //templateHTML.js为压缩之后的文件名，注意.js后缀名不能少
        .pipe(templateCache("templateHTML.js",{
            //路径的前缀
            root: 'templates/',
            //模块的名字
            module:"klwkOmsApp"
        }))
        .pipe(gulp.dest('dist/'));
});

/**
 * 推荐
 * 将service controller filter directive config 等逻辑js文件连接起来
 * */
gulp.task('concatJS', function () {

    gulp.src("dist/**/*.*")
        .pipe(concat("target"+new Date().getTime()+".js"))
        .pipe(gulp.dest("dist/temp/"))

});

/**
 * 推荐
 * 将删除dist/目录下的所有文件
 * */
gulp.task("delFiles",function(delCallBack){
    del([
        'dist/**/*.*'
    ]);
    delCallBack();
});

/**
 * 推荐
 * 将dist/temp/的所有文件连接起来
 * */
gulp.task('step2', function () {

    gulp.src("dist/**/*.*")
        .pipe(concat("target.js"))
        //.pipe(gulp.dest("dist/"))
        .pipe(gulp.dest(""))

});

/**
 * 合并所有的js文件
 * */
gulp.task('step1', function () {
    runSequence(
        'delFiles',//删除目标文件夹下的所有目录
        'angularTemplateCache',//将HTML模板文件转为js文件，放在目标目录中
        'compressJS'//将逻辑文件压缩，存放到目标文件中
    )
});

/**
 * 压缩目标文件
 * */
gulp.task('compressJS', function () {
    gulp.src("scripts/**/*.*")
        .pipe(uglify())
        .pipe(gulp.dest("dist/"));
});

/**
 * 完成目标 需要做的事情 按照 配置顺序运行
 * */
gulp.task('default', function () {
    console.log("test gulp is ok!");
});