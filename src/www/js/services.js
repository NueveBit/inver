var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.services = {};

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
    $rootScope.$on("guardarUsuario", servicio.guardarUsuario);
    $rootScope.$on("obtenerPerfil", servicio.obtenerPerfil);
    $rootScope.$on("restaurarEstadoLocalStorage", servicio.restaurarEstadoLocalStorage);
    return servicio;
}

nuevebit.inver.services.ServicioSolicitud = function($rootScope) {
    $rootScope.numeroSolicitud = 1;
    $rootScope.estadoSolicitud = "Pendiente";
    var servicio = {
        solicitud:{},        
        guardarSolicitud: function(solicitud){
            solicitud.numeroSolicitud = $rootScope.numeroSolicitud;
            solicitud.estadoSolicitud = $rootScope.estadoSolicitud;
            servicio.solicitud = solicitud;
            localStorage.servicioSolicitud = angular.toJson(servicio.solicitud);
            $rootScope.numeroSolicitud++;
        }
    }
    $rootScope.$on("guardarSolicitud", servicio.guardarSolicitud);
    return servicio;
};

nuevebit.inver.services.ServicioDatosSolicitud = function($rootScope, $resource){
    var service = {
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
        getFormasNotificaciones: function() {
            return ["Consulta física o directamente - Sin costo", "Consulta vía Infomex - Sin costo", "Copia certificada - Con costo", "Copia simple - Con costo", "Otro medio"];
        },

        getTiposSujetosObligados: function(){
            return[
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
            ]            
        }
    }
    return service;
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
inverServices.factory('servicioSolicitud',['$rootScope', nuevebit.inver.services.ServicioSolicitud]);
inverServices.factory('servicioDatosSolicitud',['$rootScope', '$resource', nuevebit.inver.services.ServicioDatosSolicitud]);
//inverServices.factory('servicioLogin',['$rootScope', '$resource', nuevebit.inver.services.servicioLogin]);
inverServices.factory('Authentication',[nuevebit.inver.services.Authentication]);
