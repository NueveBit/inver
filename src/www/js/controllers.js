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
        ];
        $rootScope.url = "";
    }
};
nuevebit.inver.controllers.LoginController = function($scope){
	$scope.login= function(nombreUsuario, password){
		$scope.ons.navigator.pushPage("partials/home.html");
	}
}
nuevebit.inver.controllers.RegistroController = function($scope){
    $scope.aceptar = function(){
        $scope.ons.screen.presentPage("partials/home.html");
    }
    $scope.cancelar = function(){
        $scope.ons.screen.presentPage("partials/login.html");
    }
}

nuevebit.inver.controllers.PerfilController = function($scope){
    $scope.aceptar = function(){
        $scope.ons.screen.presentPage("partials/home.html");
    }
    $scope.cancelar = function(){
        $scope.ons.screen.presentPage("partials/home.html");
    }
}

nuevebit.inver.controllers.SolicitudInformacionController = function($scope){
    $scope.enviar = function(){
        $scope.ons.screen.presentPage("partials/home.html");
    }
    $scope.cancelar = function(){
        $scope.ons.screen.presentPage("partials/home.html");
    }
}

nuevebit.inver.controllers.ListaSolicitudesController = function($scope, SolicitudService){
    $scope.solicitudes = SolicitudService.getSolicitudes({folio : "solicitudes"});
}

// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);
inverControllers.controller("MainController",
        ["$scope", nuevebit.inver.controllers.MainController]);
inverControllers.controller('LoginController', 
	['$scope', nuevebit.inver.controllers.LoginController]);
inverControllers.controller('RegistroController', 
    ['$scope', nuevebit.inver.controllers.RegistroController]);
inverControllers.controller('SolicitudInformacionController', 
    ['$scope', nuevebit.inver.controllers.SolicitudInformacionController]);
inverControllers.controller('PerfilController', 
    ['$scope', nuevebit.inver.controllers.PerfilController]);