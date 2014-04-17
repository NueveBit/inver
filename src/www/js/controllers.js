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
nuevebit.inver.controllers.LoginController = function($scope){
	$scope.login= function(nombreUsuario, password){
		$scope.ons.screen.presentPage("partials/home.html");
	}
    $scope.registro = function(){
        $scope.ons.screen.presentPage("partials/registro.html");
    }
}

// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);
inverControllers.controller("MainController",
        ["$scope", nuevebit.inver.controllers.MainController]);
inverControllers.controller('LoginController', 
	['$scope', nuevebit.inver.controllers.LoginController])