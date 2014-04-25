/**
 * inVer Application Module 
 */

 var nuevebit = nuevebit || {};
 nuevebit.inver = nuevebit.inver || {}

 nuevebit.inver.Application = {
    _angularApp: null,
    _init: function() {
        this._angularApp = angular.module("inverApp", [
            "ngRoute",
            'ngResource',
            "inverControllers",
            "inverServices",
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
                    templateUrl: 'partials/login.html',
                    //controller: 'MainController'
                }).
                when('/contenedor', {
                    templateUrl: 'partials/contenedor.html',
                    //controller: 'MainController'
                    }).
                when('/home', {
                    templateUrl: 'partials/home.html',
                }).
                when('/perfil', {
                    templateUrl: 'partials/perfil.html',
                    controller: 'PerfilController'
                })
                
                .otherwise({
                    redirectTo: '/login'
                });
            }]);
        /*this._angularApp.run(function(Authentication, $rootScope, $location) {
          $rootScope.$on('$routeChangeStart', function(evt) {
            if(!Authentication.isAuthenticated){ 
              $location.url("/login");
          }
          event.preventDefault();
      });
});*/
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