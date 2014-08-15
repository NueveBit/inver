/**
 * inVer Application Module 
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {}

nuevebit.inver.Application = {
    _angularApp: null,
    _init: function() {
        angular.module("inverServices", ["ngResource"]);
        angular.module("nuevebit.directives", []); // TODO: Debería estar en otro script

        this._angularApp = angular.module("inverApp", [
            "ngRoute",
            'ngResource',
            "inverServices",
            "nuevebit.directives",
            "onsen.directives",
            "LocalStorageModule"
        ]);

        this._mount();
        //console.log("changed");
        // bind controllers
        //this._addControllers();
    },
    _mount: function() {
        this._angularApp.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                        when('/login', {
                            templateUrl: 'views/login.html',
                            //controller: 'MainController'
                        }).
                        when('/contenedor', {
                            templateUrl: 'views/contenedor.html',
                            //controller: 'MainController'
                        }).
                        when('/home', {
                            templateUrl: 'views/home.html',
                        }).
                        when('/perfil', {
                            templateUrl: 'views/perfil.html'
                        })
                        .otherwise({
                            redirectTo: '/login'
                        });
            }]);
    },
    start: function() {
        this._init();

        // cordova requiere la variable global 'app', aquí inicializamos
        if (typeof app !== "undefined") {
            app.initialize();
        } else {
            //handleOpenURL("inver://solicitud=1");
        }
    },
};

function handleOpenURL(url) {
    setTimeout(function() {
        window.location = "#/contenedor?solicitud=" + getIdFromSchemeURL(url);
    }, 0);
}

function  getIdFromSchemeURL(url) {
    // en ocasiones, la URL contiene parámetros adicionales, el scheme está
    // antes de esos parámetros
    var scheme = url.split("&")[0];
    return scheme.split("=")[1];
}

nuevebit.inver.Application.start();
