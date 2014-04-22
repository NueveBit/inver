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

nuevebit.inver.services.ServicioDatosSolicitud = function($rootScope){
    var service = {
        getTiposSolicitud: function() {
            return [
                {id: 1, tipo: "Información pública"},
                {id: 2, tipo: "Datos personales"},
                {id: 3, tipo: "Corrección de datos personales"}
            ]
        },
        getTiposGestion: function() {
            return ['Acceso','Actualización','Rectificación','Supresión','Mantener confidencialidad'];
        },
        getTiposSujetosObligados: function(){
            return[
                {id:1, tipoSujeto: "Poder ejecutivo"}
            ]
        }
    };
    $rootScope.$on('getTiposSolicitud', service.getTiposSolicitud);
    $rootScope.$on('getTiposGestion', service.getTiposGestion);
    return service;
};


nuevebit.inver.services.Authentication = function(){
	return{
		isAuthenticated: false,
		user:null
	}
}
var inverServices = angular.module("inverServices", []);
inverServices.factory('servicioRegistro',['$rootScope', nuevebit.inver.services.ServicioRegistro]);
inverServices.factory('servicioSolicitud',['$rootScope', nuevebit.inver.services.ServicioSolicitud]);
inverServices.factory('servicioDatosSolicitud',['$rootScope', nuevebit.inver.services.ServicioDatosSolicitud]);
inverServices.factory('Authentication',[nuevebit.inver.services.Authentication]);