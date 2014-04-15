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
            "inverControllers"
        ]);

        this._mount();
        console.log("changed");
        // bind controllers
        //this._addControllers();
    },
    _mount: function() {
        this._angularApp.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                        when('/home', {
                            templateUrl: 'partials/home.html',
                            controller: 'MainController'
                        })
                        .otherwise({
                            redirectTo: '/home'
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