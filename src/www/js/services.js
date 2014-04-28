var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};

nuevebit.inver.services = nuevebit.inver.services || {};

nuevebit.inver.services.ServicioRegistro = function($rootScope) {
    var servicio = {
        usuario: {},
        guardarUsuario: function(usuario) {
            servicio.usuario = usuario;
            localStorage.servicioRegistro = angular.toJson(servicio.usuario);
        },
        obtenerPerfil: function() {
            var perfil = angular.fromJson(localStorage.servicioRegistro);
            return perfil;
        },
        restaurarEstadoLocalStorage: function() {
            servicio.usuario = angular.fromJson(localStorage.servicioRegistro);
        }
    }
    return servicio;
}

nuevebit.inver.services.ServicioUsuario = function($http) {
    return{
        isLoggedIn: function() {
            return $http({
                url: URL_SERVICE + "/login.php",
                params: {isLoggedIn: true},
                method: "GET"
            });
        },
        login: function(usuario) {
            return $http({
                url: URL_SERVICE + "/login.php",
                params: {username: usuario.nombreUsuario, password: usuario.password},
                method: "GET"
            });
        },
        logout: function() {
            return $http({
                url: URL_SERVICE + "/login.php",
                method: "POST"
            });
        }
    };
}

nuevebit.inver.services.SolicitudService = function($resource, $routeParams) {
    return $resource(URL_SERVICE + "/solicitud.php", {}, {
        getTiposSujetos: {method: "GET", params: {tiposSujetos: true}, isArray: true},
        getSujetosObligados: {method:"GET", params: {idTipoSujeto:$routeParams.idTipoSujeto}, isArray:true},
        guardarSolicitud: {method:"POST", 
            params:{solicitud:$routeParams.solicitud}, 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}, isArray:false},
        getListaByFecha: {method:"GET", params:{fechaInicio:$routeParams.fechaInicio, idUsuario: $routeParams.idUsuario}, isArray:true},
        getListaByStatus: {method:"GET", params:{status:$routeParams.estado, idUsuario: $routeParams.idUsuario}, isArray:true},
        getListaByTipo: {method:"GET", params:{tipo:$routeParams.tipo, idUsuario: $routeParams.idUsuario}, isArray:true},
        getDetalle:{method:"GET", params:{idSolicitud:$routeParams.idSolicitud, idUsuario: $routeParams.idUsuario}, isArray:true}
    });
};

nuevebit.inver.services.ServicioSolicitud = function($http, $resource) {
    return {
        guardarSolicitud: function(solicitud) {
            var datos = {
                "tipo": solicitud.tipoSolicitud["tipo"],
                "tipoGestion": solicitud.tipoGestion
            };

            return $http({
                url: URL_SERVICE + "/solicitud.php",
                data: datos,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        getTiposSolicitud: function() {
            return [
                {id: 1, tipo: "Información Pública"},
                {id: 2, tipo: "Datos Personales"},
                {id: 3, tipo: "Corrección de Datos Personales"} 
            ];
        },
        getTiposGestion: function() {
            return [
                "Acceso",
                "Actualización",
                "Rectificación",
                "Supresión",
                "Mantener confidencialidad"
            ];
        }
    };

};

nuevebit.inver.services.Authentication = function() {
    return{
        isAuthenticated: false,
        user: null
    };
};

var inverServices = angular.module("inverServices", ['ngResource']);

inverServices.factory('servicioRegistro', ['$rootScope', nuevebit.inver.services.ServicioRegistro]);
inverServices.factory('servicioSolicitud', ['$http', "$resource", nuevebit.inver.services.ServicioSolicitud]);
inverServices.factory('Authentication', [nuevebit.inver.services.Authentication]);
inverServices.factory('servicioUsuario', ['$http', nuevebit.inver.services.ServicioUsuario]);
inverServices.factory("solicitudService", ["$resource", "$routeParams", nuevebit.inver.services.SolicitudService]);
// servicio de estadísticas
inverServices.factory("estadisticasService", [
    "$http", 
    nuevebit.inver.services.EstadisticasService]);