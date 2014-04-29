/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = nuevebit.inver.controllers || {};

 nuevebit.inver.controllers.LoginController = function($scope, servicioUsuario, localStorageService) {
    $scope.iniciarSesion = function(usuario) {
        if (angular.isUndefined($scope.usuario)) {
            $scope.mensaje="Introducir datos"; 
        }
        else{
            if (angular.isUndefined(usuario.nombreUsuario) || angular.isUndefined(usuario.password)){
                $scope.mensaje = "Introducir usuario y/o contraseña";
            }else{
                servicioUsuario.login(usuario)
                .success(function(data) {
                    if (data.idUsuario) {
                        localStorageService.add("idUsuario",data.idUsuario);
                        $scope.ons.navigator.resetToPage('views/contenedor.html');
                    }
                    else {
                        $scope.mensaje = "Nombre de usuario o contraseña incorrecto";
                    }
                })
                .error(function(error, status, headers, config) {
                    $scope.mensaje = "Error inesperado";
                });
            }
        }        
    }
    $scope.logout = function() {
        servicioUsuario.logout()
                .success(function(data) {
                    $scope.ons.navigator.resetToPage('views/login.html');
                })
                .error(function() {
                    $scope.mensaje = "Error inesperado";
                });
    }
};
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

nuevebit.inver.controllers.PerfilController = function($scope, usuarioService, localStorageService) {
    $scope.idUsuario = localStorageService.get("idUsuario");
    var perfil = usuarioService.getPerfil({idUsuario:$scope.idUsuario});
    console.log(perfil);

    $scope.modificarPerfil = function(usuario) {
        
        $scope.ons.navigator.resetToPage('views/contenedor.html');
    }
};

nuevebit.inver.controllers.SolicitudInformacionController = function($scope, servicioSolicitud, solicitudService, localStorageService) {    
    $scope.tiposSolicitud = servicioSolicitud.getTiposSolicitud();
    $scope.tiposGestion = [];
    //$scope.tiposSujetosObligados = solicitudService.getTiposSujetos();
    $scope.tiposSujetosObligados = services.TipoSujeto.query();

    $scope.sujetosObligados = [];
    document.getElementById("tipoGestion").disabled = true;
    $scope.solicitudChanged = function(solicitud) {
        if (solicitud.tipo.id != 1) {
            $scope.tiposGestion = servicioSolicitud.getTiposGestion();
            document.getElementById("tipoGestion").disabled = false;
        } else {
            $scope.tiposGestion = []
        }
    };
    $scope.tipoSujetoChanged = function(solicitud) {
        $scope.sujetosObligados = services.Sujeto.get({
            tipoId: solicitud.tipoSujeto.id
        });
    };
    $scope.enviarSolicitud = function(solicitud){
        if (angular.isUndefined(solicitud)){
            $scope.mensaje="Falta proporcionar información requerida";
        }
        else {
            if (angular.isUndefined(solicitud.tipo) ||
                    angular.isUndefined(solicitud.descripcion) ||
                    angular.isUndefined(solicitud.tipoSujeto) ||
                    angular.isUndefined(solicitud.sujetoObligado) ||
                    angular.isUndefined(solicitud.formaNotificacion))
            {
                $scope.mensaje="Falta proporcionar información requerida";
            }
            else{
                solicitud.idUsuario= localStorageService.get("idUsuario");
                $scope.resultado = solicitudService.guardarSolicitud({"solicitud":solicitud});
                if ($scope.resultado){
                    $scope.ons.navigator.resetToPage('views/contenedor.html');
                }
                $scope.mensaje="La solicitud ha sido registrada";
            }
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
nuevebit.inver.controllers.MenuController = function($scope) {
    $scope.pagesList = [
        {nombre: "Home", url: "views/home.html", "icon": "home", "isSelected": ""},
        {nombre: "Perfil", url: "views/perfil.html", "icon": "gear", "isSelected": ""},
        {nombre: "Solicitud de información", url: "views/solicitudInformacion.html", "icon": "book", "isSelected": ""},
        {nombre: "Ver Solicitudes", url: "views/listaSolicitudes.html", "icon": "bars", "isSelected": ""},
        {nombre: "Estadísticas", url: "views/estadisticas.html", "icon": "book", "isSelected": ""}
    ]
    $scope.selectedIndex = 0;
    $scope.itemClicked = function($index) {
        $scope.selectedIndex = $index;
    };
};
// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);
//loginController
inverControllers.controller('loginController', [
    "$scope", 
    "servicioUsuario", 
    "localStorageService",
    nuevebit.inver.controllers.LoginController
]);
//registroController
inverControllers.controller('registroController', [
    "$scope",
    "$location",
    "servicioRegistro",
    nuevebit.inver.controllers.RegistroController
]);
//solicitudInformacionController
inverControllers.controller('solicitudInformacionController', [
    "$scope", 
    'servicioSolicitud', 
    "solicitudService", 
    "localStorageService",
    nuevebit.inver.controllers.SolicitudInformacionController
]);
//perfilController
inverControllers.controller('perfilController', [
    '$scope', 
    'usuarioService', 
    "localStorageService",
    nuevebit.inver.controllers.PerfilController
]);
//menucontroller
inverControllers.controller('menuController', [
    '$scope',
    nuevebit.inver.controllers.MenuController]);
// estadísticas controllers
/*
 inverControllers.controller("estadisticasController", [
 "$scope",
 "estadisticasService",
 nuevebit.inver.controllers.EstadisticasController
 ]);
 */
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
