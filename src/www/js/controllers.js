/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 var nuevebit = nuevebit || {};
 nuevebit.inver = nuevebit.inver || {};
 nuevebit.inver.controllers = {};
 var URL_SERVICE= "http://localhost:8080/~bdiaz";

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
nuevebit.inver.controllers.LoginController = function($scope, $http){
    $scope.iniciarSesion= function(usuario){
        $http.get(URL_SERVICE + "/service/login.php?username="
            + $scope.usuario.nombreUsuario + "&password=" + $scope.usuario.password)
        
        .success(function(data){
            if (data.isLoggedIn) {
                $scope.ons.navigator.resetToPage('partials/contenedor.html');
            }
            else{
                $scope.mensaje="Nombre de usuario o contraseña incorrecto";
            }
        })
        .error(function(error, status, headers, config){
          $scope.mensaje ="Error inesperado"; 
        });

    }
    /*$scope.iniciarSesion= function(usuario) {
        var user = servicioRegistro.obtenerPerfil();
        if ($scope.usuario.nombreUsuario === user.nombreUsuario && $scope.usuario.password === user.password) {          
          $scope.ons.navigator.resetToPage('partials/contenedor.html');
      } else {
          $scope.mensaje = "Nombre de usuario o contraseña invalido";
      };
      $scope.usuario = null
  }*/
};
nuevebit.inver.controllers.RegistroController = function($scope, $location, servicioRegistro){    
    $scope.crearCuenta = function(usuario){
        if (angular.isUndefined($scope.usuario)){
            $scope.mensaje = 'Se debe llenar el formulario';
        }
        else{
            servicioRegistro.guardarUsuario($scope.usuario);            
            $scope.ons.navigator.popPage();
            $location.path('/login');
        }
    }
};

nuevebit.inver.controllers.PerfilController = function($scope, servicioRegistro){
    var perfil = servicioRegistro.obtenerPerfil();
    $scope.usuario = perfil;

    $scope.modificarPerfil = function(usuario){
        servicioRegistro.guardarUsuario($scope.usuario);
        $scope.ons.navigator.resetToPage('partials/contenedor.html');
    }
};

nuevebit.inver.controllers.SolicitudInformacionController = function($scope, $rootScope, servicioSolicitud, servicioDatosSolicitud){
    var ayuntamientos= [];
    $scope.tiposSolicitud = servicioDatosSolicitud.getTiposSolicitud();
    $scope.tiposGestion = [];
    $scope.tiposSujetosObligados = servicioDatosSolicitud.getTiposSujetosObligados();
    $scope.sujetosObligados = [];
    $scope.formasNotificaciones = servicioDatosSolicitud.getFormasNotificaciones();
    $scope.solicitudChanged = function(solicitud) {
      /*  if (solicitud.tipoSolicitud.id == 2) {
          //  $scope.tiposGestion = servicioDatosSolicitud.getTiposGestion();    
        } else {
            $scope.tiposGestion = []
        }*/
    };  
    $scope.tipoSujetoChanged = function(solicitud) {
        $scope.sujetosObligados = servicioDatosSolicitud.getSujetosObligados(solicitud.tipoSujeto.id);
    };    
    $scope.enviarSolicitud = function(solicitud){
        servicioSolicitud.guardarSolicitud(solicitud);
        $scope.ons.navigator.resetToPage('partials/contenedor.html');
    };
};

nuevebit.inver.controllers.ListaSolicitudesController = function($scope, SolicitudService){
    $scope.solicitudes = SolicitudService.getSolicitudes({folio : "solicitudes"});
};

nuevebit.inver.controllers.MenuController= function($scope){
    $scope.pagesList = [  
    {"nombre": "Home", "url":"partials/home.html", "icon":"home", "isSelected": ""},  
    {"nombre": "Perfil", "url":"partials/perfil.html", "icon":"gear", "isSelected": ""},
    {"nombre": "Solicitud de información", "url":"partials/solicitudInformacion.html", "icon":"book", "isSelected": ""}
    ]
    $scope.selectedIndex = 0;
    $scope.itemClicked = function ($index) {
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
	['$scope', '$http', nuevebit.inver.controllers.LoginController]);
//registroController
inverControllers.controller('registroController', 
    ['$scope', '$location','servicioRegistro',nuevebit.inver.controllers.RegistroController]);
//solicitudInformacionController
inverControllers.controller('solicitudInformacionController', 
    ['$scope', '$rootScope', 'servicioSolicitud', 'servicioDatosSolicitud', nuevebit.inver.controllers.SolicitudInformacionController]);
//perfilController
inverControllers.controller('perfilController', 
    ['$scope', 'servicioRegistro',nuevebit.inver.controllers.PerfilController]);
//menucontroller
inverControllers.controller('menuController', 
    ['$scope', nuevebit.inver.controllers.MenuController]);