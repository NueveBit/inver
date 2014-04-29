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
            "inverControllers",
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
                    templateUrl: 'views/perfil.html',
                    controller: 'PerfilController'
                })                
                .otherwise({
                    redirectTo: '/login'
                });
            }]);
},
_addControllers: function() {
    var controllers = nuevebit.inver.controllers;

        this._angularApp.controller("MainController", ["$scope",
            controllers.MainController]);
    },
    start: function() {
        this._init();

        // cordova requiere la variable global 'app', aquí inicializamos
        if (typeof (app) !== "undefined") {
            app.initialize();
        }
    }
};

nuevebit.inver.Application.start();
