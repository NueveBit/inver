/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = {};
var URL_SERVICE = "http://localhost:8080/~bdiaz";

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
    }
};
nuevebit.inver.controllers.LoginController = function($scope, servicioUsuario) {
    $scope.iniciarSesion = function(usuario) {
        servicioUsuario.login(usuario)
                .success(function(data) {
                    if (data.loggedIn) {
                        $scope.ons.navigator.resetToPage('partials/contenedor.html');
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
                    $scope.ons.navigator.resetToPage('partials/login.html');
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
        $scope.ons.navigator.resetToPage('partials/contenedor.html');
    }
};

nuevebit.inver.controllers.SolicitudInformacionController = function($scope, servicioSolicitud, solicitudService) {
    var ayuntamientos = [];
    $scope.tiposSolicitud = servicioSolicitud.getTiposSolicitud();
    $scope.tiposGestion = [];
    $scope.tiposSujetosObligados = solicitudService.getTiposSujetos();

    $scope.sujetosObligados = [];

    $scope.solicitudChanged = function(solicitud) {
        if (solicitud.tipoSolicitud.id != 1) {
            $scope.tiposGestion = servicioSolicitud.getTiposGestion();
        } else {
            $scope.tiposGestion = []
        }
    };
    $scope.tipoSujetoChanged = function(solicitud) {


    };
    $scope.enviarSolicitud = function(solicitud) {
        servicioSolicitud.guardarSolicitud(solicitud);
        $scope.ons.navigator.resetToPage('partials/contenedor.html');
    };
};

nuevebit.inver.controllers.ListaSolicitudesController = function($scope, SolicitudService) {
    $scope.solicitudes = SolicitudService.getSolicitudes({folio: "solicitudes"});
};

nuevebit.inver.controllers.MenuController = function($scope) {
    $scope.pagesList = [
        {"nombre": "Home", "url": "partials/home.html", "icon": "home", "isSelected": ""},
        {"nombre": "Perfil", "url": "partials/perfil.html", "icon": "gear", "isSelected": ""},
        {"nombre": "Solicitud de información", "url": "partials/solicitudInformacion.html", "icon": "book", "isSelected": ""}
    ]
    $scope.selectedIndex = 0;
    $scope.itemClicked = function($index) {
        $scope.selectedIndex = $index;
    };
};
// registrar controladores con angular
var inverControllers = angular.module("inverControllers", []);
//MainController
inverControllers.controller("MainController",
        ["$scope", nuevebit.inver.controllers.MainController]);
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