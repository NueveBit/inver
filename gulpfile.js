/**
 * @author emerino
 * 
 * Tareas para el proyecto inVer.
 */

// sys deps
var fs = require('fs');
var es = require('event-stream');
var cordova = require("cordova");
var argv = require("yargs").argv; // cmd arguments support
var path = require('path');
var _ = require("underscore");

// gulp plugins
var gulp = require("gulp");
var util = require("gulp-util");
var template = require('gulp-template');
var clean = require('gulp-clean');
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var requirejs = require("gulp-requirejs");
var uglify = require("gulp-uglify");
var less = require('gulp-less');
var minifycss = require("gulp-minify-css");

// local config
var config = {
    srcDir: path.join(process.cwd(), "src"),
    distDir: path.join(process.cwd(), "dist"),
    supportedPlatforms: [
        "android"
    ],
    plugins: [
        'https://github.com/phonegap-build/PushPlugin.git'
    ],
    getJsFiles: function() {
        return JSON.parse(fs.readFileSync("src/www/js/scripts.json"));
    }
};

// cada vez que se ejecuta el script, se crea un nuevo device con la 
// configuración necesaria para la API de cordova.
var device = {
    platforms: (typeof argv.platform !== "undefined")
            ? [argv.platform]
            : config.supportedPlatforms
};

/**
 * Clean tasks 
 */
gulp.task("clean", function() {
    return gulp.src([config.distDir]).pipe(clean());
});

gulp.task("clean:init", function() {
    return gulp.src([
        "src/www/index.html",
        "src/platforms",
        "src/plugins",
        "src/merges"
    ]).pipe(clean());
});

gulp.task("clean:bower", function() {
    return gulp.src(["src/www/bower_components"]).pipe(clean());
});

gulp.task("clean:all", ["clean", "clean:init", "clean:bower"], function() {
});

/**
 * Copy tasks
 */
gulp.task("copy:web-resources", ["build:scripts", "build:style"],
        function() {
            return es.merge(
                    // copia configuración de cordova
                    gulp.src("config.xml", {cwd: "src/"})
                    .pipe(gulp.dest("dist/")),
                    // copia recursos estáticos
                    gulp.src("**", {cwd: "src/www/img/"})
                    .pipe(gulp.dest("dist/www/img/"))
                    );

        });

gulp.task("copy:cordova-resources", [
    "copy:cordova-platforms", "copy:cordova-plugins"
], function() {
});

// Aquí se definen la tareas que se deben llevar a cabo para copiar los plugins 
// a dist.
gulp.task("copy:cordova-plugins", ["build:structure"], function() {
    return es.merge(
            // copia todos los plugins a dist/
            gulp.src("**", {cwd: "src/plugins"})
            .pipe(gulp.dest("dist/plugins")),
            // PushNotification plugin
            gulp.src("PushNotification.js",
                    {cwd: "src/plugins/com.phonegap.plugins.PushPlugin/www"})
            .pipe(gulp.dest("dist/www/js"))
            );
});

gulp.task("copy:cordova-platforms", ["build:structure"], function() {
    return gulp.src("**", {cwd: "src/platforms"})
            .pipe(gulp.dest("dist/platforms"));
});


/**
 * Build tasks
 */
gulp.task("build:scripts", function() {
    var scripts = [];
    _.each(config.getJsFiles(), function(src) {
        scripts.push("src/www/" + src);
    });

    gulp.src(scripts)
            .pipe(concat("inver.js"))
            .pipe(uglify())
            .pipe(gulp.dest("dist/www/js"));
});

gulp.task("build:style", function() {
    gulp.src("src/www/less/main.less")
            .pipe(less().on("error", util.log))
            .pipe(minifycss())
            .pipe(rename("inver.css"))
            .pipe(gulp.dest("dist/www/css"));
});

gulp.task("build:template-dev", function() {
    var srcFile = fs.readFileSync("src/www/template/scripts-include-dev.tpl", "utf8");

    gulp.src("src/www/template/index.html.tpl")
            .pipe(template({
                headerInclude: srcFile,
                scripts: config.getJsFiles()}))
            .pipe(rename("index.html"))
            .pipe(gulp.dest("src/www"));
});

gulp.task("build:template-prod", function() {
    var srcFile = fs.readFileSync(
            "src/www/template/scripts-include-prod.tpl", "utf8");

    gulp.src("src/www/template/index.html.tpl")
            .pipe(template({headerInclude: srcFile, scripts: ["js/inver.js"]}))
            .pipe(rename("index.html"))
            .pipe(gulp.dest("dist/www"));
});

gulp.task("build:structure", function(cb) {
    // crea la estructura para la aplicación cordova
    _.each([
        "dist",
        "dist/plugins",
        "dist/platforms",
        "dist/www",
        "dist/hooks",
        "dist/merges"
    ], function(dir) {
        if (!fs.existsSync(dir)) { // evitamos errores si ya existe
            fs.mkdirSync(dir);
        }
    });

    cb();
});

gulp.task("build:init-structure", function(cb) {
    _.each(["src/plugins", "src/platforms"], function(dir) {
        fs.mkdirSync(dir);
    });

    cb();
});

gulp.task("build:web", ["build:structure", "copy:web-resources"], function() {
    return gulp.start("build:template-prod");
});

/**
 * Cordova tasks
 */
gulp.task("build:cordova", function() {
    process.env["PWD"] = config.distDir;
    cordova.build(device);
});

gulp.task("emulate", function() {
    process.env["PWD"] = config.distDir;
    cordova.emulate(device);
});

/**
 * Public tasks
 * 
 * Estas son las tareas que comunmente se ejecutan en la línea de comandos.
 */

/**
 * Genera el archivo index.html que se utilizará en desarrollo, además de
 * crear la estructura inicial del proyecto.
 * 
 * La configuración inicial también configura el proyecto para trabajar con
 * Apache Cordova. Utilizamos la API cordova directamente en lugar de recurrir
 * a algún plugin externo.
 */
gulp.task("init", ["build:template-dev", "build:init-structure"], function() {
    process.env["PWD"] = config.srcDir;

    cordova.raw.platform("add", config.supportedPlatforms).then(function() {
        cordova.plugin("add", config.plugins); // agregar plugins después
    });
});

/**
 * Construye los paquetes distribuiles para las plataformas soportadas.
 * 
 * NOTE: Para ejecutar esta tarea, es necesario tener instalado y configurado
 * en el sistema el SDK de Android (única plataforma soportada actualmente).
 */
gulp.task("build", ["build:web", "copy:cordova-resources"], function() {
    gulp.start("build:cordova");
});

/**
 * Debe ejecutarse en una terminal mientras se esté trabajando en el proyecto.
 * Se encarga de observar cambios en distintos archivos y al detectarlos
 * regenerar index.html de desarrollo.
 * 
 * Útil para actualizar los scripts js del proyecto y automáticamente regenerar
 * index.html para tomarlos en cuenta, así se evita la tarea manual repetitiva
 * de ejecutar el task build:template-dev.
 */
gulp.task("default", function() {
    var sources = [
        "src/www/js/scripts.json",
        "src/www/templates/scripts-include-dev.tpl",
        "src/www/templates/index.html.tpl"
    ];
    gulp.src(sources)
            .pipe(watch(function() {
                gulp.start("build:template-dev");
            }));
});

// shortcuts
gulp.task("rebuild", ["clean"], function() {
    gulp.start("build");
});

gulp.task("reinit", ["clean:init"], function() {
    gulp.start("init");
});

