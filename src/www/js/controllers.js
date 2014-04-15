/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = {};

nuevebit.inver.controllers.MainController = function($scope) {
    this._init($scope);
};

nuevebit.inver.controllers.MainController.prototype = {
    _init: function($scope) {
        $scope.phones = [
            {name: "uno"},
            {name: "dos"},
            {name: "tres"}
        ]
    }
};

// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);
inverControllers.controller("MainController",
        ["$scope", nuevebit.inver.controllers.MainController]);