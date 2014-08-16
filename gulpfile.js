/**
 * @author emerino
 * 
 * Tareas para el proyecto inVer.
 * 
 * Todas las tareas que aquí se definen son cross-platform, lo que quiere
 * decir que pueden ejecutarse en cualquier Sistema Operativo soportado por las
 * siguientes plataformas: NodeJS, Apache Cordova, Android SDK.
 * 
 */

/**
 * 
 * CONSTANTES
 */

// Todos los fuentes CSS, tanto propios como de terceros.
var CSS_SOURCES = [
    "src/www/bower_components/onsenui/build/css/font_awesome/**/*.css",
    "src/www/bower_components/onsenui/build/css/polyfill/**/*.css",
    "src/www/bower_components/onsenui/build/css/onsenui.css",
    //"src/www/bower_components/onsenui/build/css/topcoat-mobile-onsen-blue.css",
    "src/www/css/topcoat-mobile-onsen-inver.css",
    "src/www/css/main.css"
];

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
var uglify = require("gulp-uglify");
var less = require('gulp-less');
var minifycss = require("gulp-minify-css");

// local config
var config = {
    srcDir: path.join(__dirname, "src"),
    distDir: path.join(__dirname, "dist"),
    supportedPlatforms: [
        "android"
    ],
    plugins: [
        'https://github.com/phonegap-build/PushPlugin.git',
        'https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git',
        'https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git',
        '--variable',
        'URL_SCHEME=inver'
    ],
    getJsFiles: function() {
        return JSON.parse(fs.readFileSync("src/www/js/scripts.json"));
    }
};

// cada vez que se ejecuta el script, se crea un nuevo device con la 
// configuración necesaria para la API de cordova.
var device = {
    platforms: (argv.platform)
            ? [argv.platform]
            : config.supportedPlatforms
};

// un servidor express con livereload para que inyecte los cambios directamente
// al navegador, sin utilizar plugins extras
var server = {
    port: 4000,
    livereloadPort: 35729,
    basePath: path.join(config.srcDir, "www"),
    _lr: null,
    start: function() {
        var express = require('express');
        var app = express();
        app.use(require('connect-livereload')());
        app.use(express.static(this.basePath));
        app.listen(this.port);
    },
    livereload: function() {
        this._lr = require('tiny-lr')();
        this._lr.listen(this.livereloadPort);
    },
    livestart: function() {
        this.start();
        this.livereload();
    },
    notify: function(event) {
        var fileName = path.relative(this.basePath, event.path);

        this._lr.changed({
            body: {
                files: [fileName]
            }
        });
    }
};

/**
 * Clean tasks 
 */
gulp.task("clean", function() {
    return gulp.src([config.distDir, "src/www/css/main.css"]).pipe(clean());
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
    return gulp.src(["src/www/bower_components"])
            .pipe(clean());
});

gulp.task("clean:all", ["clean", "clean:init", "clean:bower"], function() {
});

/**
 * Copy tasks
 */
gulp.task("copy:web-resources", ["build:scripts", "build:style"],
        function() {
            return es.merge(
                    // copia recursos estáticos
                    gulp.src("**", {cwd: "src/www/img/"})
                    .pipe(gulp.dest("dist/www/img/")),
                    gulp.src("**", {cwd: "src/res/"})
                    .pipe(gulp.dest("dist/res/")),
                    // angular templates
                    gulp.src("**", {cwd: "src/www/views"})
                    .pipe(gulp.dest("dist/www/views")),
                    // onsenui resources 
                    gulp.src("**", {cwd: "src/www/bower_components/onsenui/build/css/font_awesome/fonts"})
                    .pipe(gulp.dest("dist/www/fonts")),
                    gulp.src("**", {cwd: "src/www/bower_components/onsenui/build/img"})
                    .pipe(gulp.dest("dist/www/img")),
                    // env_prod script
                    gulp.src("env_prod.js", {cwd: "src/www/js"})
                    .pipe(gulp.dest("dist/www/js"))
                    );

        });

gulp.task("copy:cordova-resources", [
    "copy:cordova-config"
], function(cb) {
    process.env["PWD"] = config.distDir;
    cordova.raw.platform("add", config.supportedPlatforms).then(function() {
        cordova.raw.plugin("add", config.plugins).then(function() {
            cordova.raw.prepare().then(function() {
                cb();
            });
        }); // agregar plugins después
    });
});

gulp.task("copy:cordova-config", ["build:structure", "copy:web-resources"], function() {
    /*
     return gulp.src("**", {cwd: "src/platforms"})
     .pipe(gulp.dest("dist/platforms"));
     */
    // copia configuración de cordova
    return gulp.src("config.xml", {cwd: "src/"}).pipe(gulp.dest("dist/"));

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
            //.pipe(uglify())
            .pipe(gulp.dest("dist/www/js"));
});

gulp.task("build:style", ["build:less"], function() {
    gulp.src(CSS_SOURCES)
            .pipe(concat("inver.css"))
            //.pipe(minifycss())
            .pipe(gulp.dest("dist/www/css"));
});

gulp.task("build:less", function() {
    var source = path.join(config.srcDir, "www/less/main.less");
    return gulp.src(source)
            .pipe(less().on("error", util.log))
            .pipe(rename("main.css"))
            .pipe(gulp.dest("src/www/css"));
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

gulp.task("emulate", ["copy:cordova-config", "build:web"], function() {
    process.env["PWD"] = config.distDir;
    cordova.prepare();
    cordova.emulate(device);
});

gulp.task("run", ["copy:cordova-config", "build:web"], function() {
    process.env["PWD"] = config.distDir;
    cordova.prepare();
    cordova.run(device);
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
    //process.env["PWD"] = config.srcDir;

    //cordova.raw.platform("add", config.supportedPlatforms).then(function() {
    //cordova.plugin("add", config.plugins); // agregar plugins después
    //});
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
 * Inicia un servidor web en el puerto 4000
 */
gulp.task("serve", function() {
    server.start();
});


/**
 * Debe ejecutarse en una terminal mientras se esté trabajando en el proyecto.
 * Se encarga de observar cambios en distintos archivos y al detectarlos
 * regenerar index.html de desarrollo.
 * 
 * Útil para actualizar los scripts js del proyecto y automáticamente regenerar
 * index.html para tomarlos en cuenta, así se evita la tarea manual repetitiva
 * de ejecutar el task build:template-dev.
 * 
 * Además, inicializa un servidor web y configura livereload para recargar
 * el navegador automáticamente cuando se detecta un cambio en los archivos
 * que observa gulp.
 */
gulp.task("default", ["build:less"], function() {
    // genera el index.html para desarrollo
    gulp.start("build:template-dev");

    // inicializa el servidor web y el servidor livereload
    server.livestart();

    gulp.watch([
        "src/www/js/scripts.json",
        "src/www/template/*.tpl"
    ], ["build:template-dev"]);

    gulp.watch(["src/www/less/**/*.less"], ["build:less"]);

    gulp.watch([
        "src/www/**/*.html",
        "src/www/js/**/*.js",
        "src/www/css/**/*.css",
        "src/www/partials/**/*.html"
    ], function(event) {
        server.notify(event);
    });
});

// shortcuts
gulp.task("rebuild", ["clean"], function() {
    gulp.start("build");
});

gulp.task("reinit", ["clean:init"], function() {
    gulp.start("init");
});

