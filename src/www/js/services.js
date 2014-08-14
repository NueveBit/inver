var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.services = nuevebit.inver.services || {};

var inverServices = angular.module("inverServices");

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
        var getToken = function() {
            return localStorageService.get("token");
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
                save: {method: "POST", headers: postHeaders, params: {token:getToken, save: true}},
                seguir: {method: "GET", params: {seguir: true}, isArray: true}
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
            }),
            Auth: {
                logout: function() {
                    localStorageService.remove("token");
                }
            }
        };
    }
]);
