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
};

nuevebit.inver.services.SolicitudService = function($resource, $routeParams) {
    return $resource(URL_SERVICE + "/solicitud.php", {}, {
        getTiposSujetos: {
            method: "GET",
            params: {tiposSujetos: true},
            isArray: true
        },
        getSujetosObligados: {
            method: "GET",
            params: {idTipoSujeto: $routeParams.idTipoSujeto},
            isArray: true
        },
        guardarSolicitud: {
            method: "POST",
            params: {solicitud: $routeParams.solicitud},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            isArray: false
        },
        getListaSolicitudesByFechaStatus: {
            method: "GET",
            params: {
                fechaRangoInicio: $routeParams.fechaRangoInicio,
                fechaRangoFin: $routeParams.fechaRangoFin,
                status: $routeParams.estado,
                idUsuario: $routeParams.idUsuario
            },
            isArray: true
        },
        getListaByRangoFecha: {
            method: "GET",
            params: {
                fechaRangoInicio: $routeParams.fechaRangoInicio,
                fechaRangoFin: $routeParams.fechaRangoFin,
                idUsuario: $routeParams.idUsuario
            },
            isArray: true
        },
        getListaByStatus: {
            method: "GET",
            params: {status: $routeParams.estado,
                idUsuario: $routeParams.idUsuario
            },
            isArray: true
        },
        getListaByTipo: {
            method: "GET",
            params: {tipo: $routeParams.tipo, idUsuario: $routeParams.idUsuario},
            isArray: true
        },
        getDetalle: {
            method: "GET",
            params: {idSolicitud: $routeParams.idSolicitud, idUsuario: $routeParams.idUsuario},
            isArray: true
        }

    });
};

nuevebit.inver.services.UsuarioService = function($resource, $routeParams) {
    return $resource(URL_SERVICE + "/usuario.php", {}, {
        getPerfil: {
            method: "GET",
            params: {idUsuario: $routeParams.idUsuario},
            isArray: true
        },
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

var inverServices = angular.module("inverServices");

// servicio de registro
inverServices.factory('servicioRegistro', [
    '$rootScope',
    nuevebit.inver.services.ServicioRegistro
]);
// servicio de solicitud
inverServices.factory('servicioSolicitud', [
    '$http',
    "$resource",
    nuevebit.inver.services.ServicioSolicitud
]);
// servicio de usuario
inverServices.factory('servicioUsuario', [
    '$http',
    nuevebit.inver.services.ServicioUsuario
]);
// servicio de solicitudes con $resource
inverServices.factory("solicitudService", [
    "$resource",
    "$routeParams",
    nuevebit.inver.services.SolicitudService
]);
// servicio de estadísticas
/*
 inverServices.factory("estadisticasService", [
 "$http", 
 nuevebit.inver.services.EstadisticasService]);
 */

/**
 * Creamos un factory que contendrá un singleton con todos los servicios
 * que se utilizan como atributos del singleton. De esta manera, se simplifica
 * la inyección de servicios, ya que únicamente se necesita inyectar este
 * singleton y utilizar desde ahí los services que se requiera.
 * 
 * NOTE: Para comunicarse con un servidor, este debe presentar un API
 * REST con los recursos que se definen para cada servicio. Una implementación
 * básica que utiliza algunos de los datos provistos en los datasets de la
 * página de la TecnoCopa IVAI (http://www.ivai.org.mx/tecnocopa/datasets/), 
 * sin embargo la finalidad es que exista la infraestructura real que soporte 
 * esta idea o, en su defecto, se modifiquen los servicios para ajustarlos a 
 * las necesidades del IVAI.
 * 
 * TODO: Documentar formato json de los datos enviados y recibidos en cada
 * petición/respuesta.
 * 
 * TODO: Probablemente en el futuro deban inicializarse de manera diferida
 * (lazy initialization), para evitar cargar todos los services al inicializar
 * la aplicación. 
 * 
 * TODO: El acceso a la API REST debe estar restringido, proveer los mecanismos
 * necesarios para autorizar el acceso a los recursos.
 */
inverServices.factory("services", [
    "$resource",
    "localStorageService",
    function($resource, localStorageService) {
        var postHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return {
            /**
             * Servicio para tipos de sujetos obligados.
             */
            TipoSujeto: $resource(URL_SERVICE + "/sujetos/tipos/:tipoId"),
            /**
             * Servicio para sujetos obligados.
             */
            Sujeto: $resource(URL_SERVICE + "/sujetos/:tipoId"),
            /**
             * Servicio para tipos de indicadores
             */
            TipoIndicador: $resource(URL_SERVICE + "/indicadores/tipos/:tipoIndicadorId"),
            /**
             * Servicio para indicadores.
             */
            Indicador: $resource(URL_SERVICE + "/indicadores/:indicadorId"),
            /**
             * Servicio para tipos de solicitudes de información.
             */
            TipoSolicitud: $resource(URL_SERVICE + "/solicitudes/tipos/:tipoSolicitudId"),
            /**
             * Servicio para solicitudes de información.
             */
            Solicitud: $resource(URL_SERVICE + "/solicitudes/:solicitudId", {}, {
                search: {method: "GET", params: {search: true}, isArray: true},
                save: {method: "POST", headers: postHeaders, params: {token: localStorageService.get("token"), save: true}}
            }),
            /**
             * Servicio para usuarios del inVer.
             */
            Usuario: $resource(URL_SERVICE + "/usuarios/:usuarioId", {}, {
                save: {method: "POST", headers: postHeaders, params: {save: true}}
            }),
            /**
             * Gestor de autenticación/autorización.
             * 
             */
            AuthManager: $resource(URL_SERVICE + "/login", {}, {
                login: {method: "POST", params: {login: true}, headers: postHeaders},
                logout: {method: "POST", params: {logout: true}, headers: postHeaders}
            })
        };
    }
]);
