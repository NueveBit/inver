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

nuevebit.inver.controllers.ListaSolicitudesController = function($scope, servicioSolicitud, solicitudService, localStorageService) {
    $scope.tiposEstados = ["En proceso", "Terminada"];
    $scope.tiposSolicitud = servicioSolicitud.getTiposSolicitud();
    $scope.idUsuario =localStorageService.get("idUsuario");
    $scope.buscar= function(dato){
        if(dato.fechaRangoInicio && dato.fechaRangoFin){
            $scope.solicitudes = solicitudService.getListaByRangoFecha({fechaRangoInicio:$scope.dato.fechaRangoInicio, fechaRangoFin:$scope.dato.fechaRangoFin, idUsuario:$scope.idUsuario});
        }
        if (dato.estado){
            $scope.solicitudes = solicitudService.getListaByStatus({status:$scope.dato.estado, idUsuario:$scope.idUsuario});
        } 
        if(dato.fechaRangoInicio && dato.fechaRangoFin && dato.estado){
            $scope.solicitudes = solicitudService.getListaSolicitudesByFechaStatus({fechaRangoInicio:$scope.dato.fechaRangoInicio, fechaRangoFin:$scope.dato.fechaRangoFin, status:$scope.dato.estado, idUsuario:$scope.idUsuario});
        }
        if (dato.tipo){
            $scope.solicitudes = solicitudService.getListaByTipo({tipo:$scope.dato.tipo.tipo, idUsuario:$scope.idUsuario});
        } 
    },
            $scope.verDetalle = function(solicitud) {
                $scope.ons.navigator.pushPage('views/detalleSolicitud.html', {id: solicitud.id});
            }
};
nuevebit.inver.controllers.DetalleSolicitudController = function($scope, solicitudService, localStorageService){
    $scope.idUsuario =localStorageService.get("idUsuario");
    $scope.idSolicitud = $scope.ons.navigator.getCurrentPage().options.id; 
    $scope.detalle = solicitudService.getDetalle({idSolicitud:$scope.idSolicitud, idUsuario:$scope.idUsuario});
}
// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);

//registroController
inverControllers.controller('registroController', [
    "$scope",
    "$location",
    "servicioRegistro",
    nuevebit.inver.controllers.RegistroController
]);
//listaSolicitudesController
inverControllers.controller('listaSolicitudesController', [
    '$scope', 
    "servicioSolicitud", 
    "solicitudService", 
    "localStorageService",
    nuevebit.inver.controllers.ListaSolicitudesController
]);
//detalleSolicitudController
inverControllers.controller('detalleSolicitudController', [
    "$scope", 
    "solicitudService", 
    "localStorageService",
    nuevebit.inver.controllers.DetalleSolicitudController
]);
