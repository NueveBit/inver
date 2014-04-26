var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.services = {};
var URL_SERVICE = "http://localhost:8080/~bdiaz/inver/src/server";

nuevebit.inver.services.ServicioRegistro = function($rootScope) {
	var servicio = {
        usuario: {},
        guardarUsuario: function (usuario) {
        	servicio.usuario = usuario;
            localStorage.servicioRegistro = angular.toJson(servicio.usuario);
        },
        obtenerPerfil: function(){
        	var perfil = angular.fromJson(localStorage.servicioRegistro);
            return perfil;
        },
        restaurarEstadoLocalStorage: function () {
            servicio.usuario = angular.fromJson(localStorage.servicioRegistro);
        }
    }
    return servicio;
}

nuevebit.inver.services.ServicioUsuario = function($http){
    return{
        isLoggedIn: function(){
            return $http({
                url: URL_SERVICE+"/login.php",
                params: {isLoggedIn:true},
                method: "GET"
            });
        },

        login: function(usuario){
            return $http({
                url: URL_SERVICE+"/login.php",
                params: {username:usuario.nombreUsuario, password: usuario.password},
                method: "GET"
            });
        },

        logout: function(){
            return $http({
                url: URL_SERVICE+"/login.php",
                method:"POST"
            });
        }
    };
}

nuevebit.inver.services.ServicioSolicitud = function($http) {
    return{
        guardarSolicitud: function(solicitud){
            var datos={
                "tipo":solicitud.tipoSolicitud["tipo"], 
                "tipoGestion":solicitud.tipoGestion
            }
            return $http({
                url: URL_SERVICE+"/solicitud.php",
                data: datos,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    };
};

nuevebit.inver.services.ServicioDatosSolicitud = function($http){
    return {
        getTiposSolicitud: function() {
            return [
            {id: 1, tipo: "Información Pública"},
            {id: 2, tipo: "Datos Personales"},
            {id: 3, tipo: "Corrección de Datos Personales"}
            ]
        },
        getTiposGestion: function() {
            return ["Acceso", "Actualización", "Rectificación", "Supresión", "Mantener confidencialidad"];
        },
        getTiposSujetosObligados: function(){
            /*return[
            {id:1, tipoSujeto: "Asociaciones Políticas"},
            {id:2, tipoSujeto: "Ayuntamientos"},
            {id:3, tipoSujeto: "Entidades Paraestatales"},
            {id:4, tipoSujeto: "Entidades Paramunicipales"},
            {id:5, tipoSujeto: "Organismos Autónomos"},
            {id:6, tipoSujeto: "Organismos Descentralizados"},
            {id:7, tipoSujeto: "Partidos Políticos"},
            {id:8, tipoSujeto: "Poder Ejecutivo - Administración Pública Centralizada"},
            {id:9, tipoSujeto: "Poder Judicial"},
            {id:10, tipoSujeto: "Poder Legislativo"}
            ] */
            return $http({
                url:URL_SERVICE+"/solicitud.php",
                method:"POST"
            });           
        }
    }
};
/*
nuevebit.inver.services.ServicioLogin = function($rootScope, $resource){
    var service = {
        login: function(usuario){
            //este debera usar $resource
        }
    }
    return service;
}
*/

nuevebit.inver.services.Authentication = function(){
 return{
  isAuthenticated: false,
  user:null
}
}
var inverServices = angular.module("inverServices", ['ngResource']);
inverServices.factory('servicioRegistro',['$rootScope', nuevebit.inver.services.ServicioRegistro]);
inverServices.factory('servicioSolicitud',['$http', nuevebit.inver.services.ServicioSolicitud]);
inverServices.factory('servicioDatosSolicitud',['$http', nuevebit.inver.services.ServicioDatosSolicitud]);
inverServices.factory('Authentication',[nuevebit.inver.services.Authentication]);
inverServices.factory('servicioUsuario', ['$http', nuevebit.inver.services.ServicioUsuario]);
