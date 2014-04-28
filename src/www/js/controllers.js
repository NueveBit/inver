/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = nuevebit.inver.controllers || {};

nuevebit.inver.controllers.LoginController = function($scope, servicioUsuario) {
    $scope.iniciarSesion = function(usuario) {
        servicioUsuario.login(usuario)
        .success(function(data) {
            if (data.loggedIn) {
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

nuevebit.inver.controllers.PerfilController = function($scope, servicioRegistro) {
    var perfil = servicioRegistro.obtenerPerfil();
    $scope.usuario = perfil;

    $scope.modificarPerfil = function(usuario) {
        servicioRegistro.guardarUsuario($scope.usuario);
        $scope.ons.navigator.resetToPage('views/contenedor.html');
    }
};

nuevebit.inver.controllers.SolicitudInformacionController = function($scope, servicioSolicitud, solicitudService) {
    $scope.tiposSolicitud = servicioSolicitud.getTiposSolicitud();
    $scope.tiposGestion = [];
    $scope.tiposSujetosObligados = solicitudService.getTiposSujetos();

    $scope.sujetosObligados = [];

    $scope.solicitudChanged = function(solicitud) {
        if (solicitud.tipo.id != 1) {
            $scope.tiposGestion = servicioSolicitud.getTiposGestion();
        } else {
            $scope.tiposGestion = []
        }
    };
    $scope.tipoSujetoChanged = function(solicitud) {        
        $scope.sujetosObligados = solicitudService.getSujetosObligados({"idTipoSujeto": solicitud.tipoSujeto.id});
    };
    $scope.enviarSolicitud = function(solicitud) {
        if (solicitud.otraFormaNotificacion!=null){
                solicitud.formaNotificacion = solicitud.otraFormaNotificacion;
            }
            if (solicitud.tipoGestion==null){
                solicitud.tipoGestion = "";
            }
            solicitud.idUsuario=1
            $scope.resultado = solicitudService.guardarSolicitud({"solicitud":solicitud});
            if ($scope.resultado){
                $scope.ons.navigator.resetToPage('views/contenedor.html');
            }     
    };
};

nuevebit.inver.controllers.ListaSolicitudesController = function($scope, servicioSolicitud, solicitudService) {
    $scope.tiposEstados = ["En proceso", "Terminada"];
    $scope.tiposSolicitud = servicioSolicitud.getTiposSolicitud();
    $scope.buscar= function(dato){
        $scope.idUsuario = 1;
        
        if($scope.dato.fecha!=null){
            $scope.solicitudes = solicitudService.getListaByFecha({fechaInicio:$scope.dato.fecha, idUsuario:$scope.idUsuario});
            $scope.tipoBusqueda = "Por fecha.";
        }
        if ($scope.dato.estado!=null){
            $scope.solicitudes = solicitudService.getListaByStatus({status:$scope.dato.estado, idUsuario:$scope.idUsuario});
            $scope.tipoBusqueda = "Por estado de la solicitud.";
        }  
        if ($scope.dato.tipo!=null){
            $scope.solicitudes = solicitudService.getListaByTipo({tipo:$scope.dato.tipo.tipo, idUsuario:$scope.idUsuario});
            $scope.tipoBusqueda = "Por tipo de solicitud.";
        } 
    },
    $scope.verDetalle = function(solicitud){
        $scope.ons.navigator.pushPage('views/detalleSolicitud.html', {id: solicitud.id});
    }
};
nuevebit.inver.controllers.DetalleSolicitudController = function($scope, solicitudService){
    $scope.idUsuario = 1;
    $scope.idSolicitud = $scope.ons.navigator.getCurrentPage().options.id; 
    $scope.detalle = solicitudService.getDetalle({idSolicitud:$scope.idSolicitud, idUsuario:$scope.idUsuario});
}
nuevebit.inver.controllers.MenuController = function($scope) {
    $scope.pagesList = [
        {"nombre": "Home", "url": "views/home.html", "icon": "home", "isSelected": ""},
        {"nombre": "Perfil", "url": "views/perfil.html", "icon": "gear", "isSelected": ""},
        {"nombre": "Solicitud de información", "url": "views/solicitudInformacion.html", "icon": "book", "isSelected": ""},
        {"nombre": "Ver Solicitudes", "url": "views/listaSolicitudes.html", "icon": "bars", "isSelected": ""},
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
inverControllers.controller('loginController',
    ['$scope', 'servicioUsuario', nuevebit.inver.controllers.LoginController]);
//registroController
inverControllers.controller('registroController',
    ['$scope', '$location', 'servicioRegistro', nuevebit.inver.controllers.RegistroController]);
//solicitudInformacionController
inverControllers.controller('solicitudInformacionController',
    ['$scope', 'servicioSolicitud', "solicitudService", nuevebit.inver.controllers.SolicitudInformacionController]);
//perfilController
inverControllers.controller('perfilController',
    ['$scope', 'servicioRegistro', nuevebit.inver.controllers.PerfilController]);
//menucontroller
inverControllers.controller('menuController',
    ['$scope', nuevebit.inver.controllers.MenuController]);
// estadísticas controllers
inverControllers.controller("estadisticasController", [
    "$scope",
    "estadisticasService",
    nuevebit.inver.controllers.EstadisticasController
]);
//listaSolicitudesController
inverControllers.controller('listaSolicitudesController',
    ['$scope', "servicioSolicitud", "solicitudService", nuevebit.inver.controllers.ListaSolicitudesController]);
//detalleSolicitudController
inverControllers.controller('detalleSolicitudController',
    ['$scope', "solicitudService", nuevebit.inver.controllers.DetalleSolicitudController]);