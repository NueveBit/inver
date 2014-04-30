/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = nuevebit.inver.controllers || {};

nuevebit.inver.controllers.RegistroController = function($scope, $location, servicioRegistro) {
    $scope.crearCuenta = function(usuario) {
        if (angular.isUndefined($scope.usuario)) {
            $scope.mensaje = 'Se debe llenar el formulario';
        }
        else {            
            servicioRegistro.guardarUsuario($scope.usuario);
            $scope.ons.navigator.popPage();
            $location.path('/login');
        }
    }
};

// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);

//registroController
inverControllers.controller('registroController', [
    "$scope",
    "$location",
    "servicioRegistro",
    nuevebit.inver.controllers.RegistroController
]);