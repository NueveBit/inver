/* 
 * Copyright (C) 2014 NueveBit
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = nuevebit.inver.controllers || {};

(function(controllers) {
    /**
     * 
     * @param {!angular.scope} $scope
     * @ngInject
     */
    controllers.SolicitudInformacionController = function($scope, services) {
        this.scope = $scope;
        this.services = services;

        $scope.solicitud = {};

        $scope.tiposSolicitud = services.TipoSolicitud.query();
        $scope.tiposSujetosObligados = services.TipoSujeto.query();
        // TODO: debería ser medioNotificación...
        $scope.formasNotificacion = services.Solicitud.query(
                {mediosNotificacion: true});

        $scope.tiposGestion = [];
        $scope.sujetosObligados = [];
    }

    controllers.SolicitudInformacionController.prototype = {
        tipoSujetoChanged: function(tipoSujeto) {
            var Sujeto = this.services.Sujeto;
            this.scope.sujetosObligados = Sujeto.query({tipoId: tipoSujeto.id});
        },
        tipoSolicitudChanged: function(tipoSolicitud) {
            var scope = this.scope;
            var Sujeto = this.services.Sujeto;

            // TODO: Tipos de solicitud deben tener un ID natural
            scope.tiposGestion = (tipoSolicitud.nombre !== "Información pública")
                    ? Sujeto.query({tiposGestion: true})
                    : [];
        },
        enviar: function(solicitud) {
            var scope = this.scope;
            var Solicitud = this.services.Solicitud;

            if (solicitud.formaNotificacion === "Otro medio") {
                solicitud.formaNotificacion = scope.otraFormaNotificacion;
            }

            Solicitud.save(solicitud, function(data) {
                if (data.error) {
                    scope.mensaje = data.error;
                } else {
                    scope.ons.navigator.popPage();
                }
            });
        }
    };

    /**
     * 
     * @param {!angular.scope} $scope
     */
    controllers.ListaSolicitudesController = function(
            $scope,
            services,
            localStorageService) {

        this.scope = $scope;
        this.services = services;
        var token = localStorageService.get("token");

        $scope.tiposEstados = ["En proceso", "Completado"];
        $scope.tiposSolicitud = services.TipoSolicitud.query();

        $scope.criteria = {usuarioId: token};
        this.buscar({usuarioId: token});
    };

    controllers.ListaSolicitudesController.prototype = {
        nuevaSolicitud: function() {
            this.scope.ons.navigator.pushPage("views/solicitudes/nueva.html");
        },
        buscar: function(criteria) {
            if (criteria.tipo) {
                criteria.tipoId = criteria.tipo.id;
            }

            var Solicitud = this.services.Solicitud;
            this.scope.solicitudes = Solicitud.search(criteria);
        },
        verDetalle: function(solicitud) {
            this.scope.ons.navigator.pushPage("views/solicitudes/detalles.html", {id: solicitud.id});
        }
    };


    /**
     * 
     * @param {!angular.scope} $scope
     */
    controllers.ListaCompletaSolicitudesController = function(
            $scope,
            services) {

        this.scope = $scope;
        this.services = services;

        $scope.tiposEstados = ["En proceso", "Completado"];
        $scope.tiposSolicitud = services.TipoSolicitud.query();
        $scope.criteria = {};
        this.buscar({});

    };

    controllers.ListaCompletaSolicitudesController.prototype = {
        nuevaSolicitud: function() {
            this.scope.ons.navigator.pushPage("views/solicitudes/nueva.html");
        },
        buscar: function(criteria) {
            if (criteria.tipo) {
                criteria.tipoId = criteria.tipo.id;
            }

            var Solicitud = this.services.Solicitud;
            this.scope.solicitudes = Solicitud.search(criteria);
        },
        verDetalle: function(solicitud) {
            this.scope.ons.navigator.pushPage("views/solicitudes/detalles.html", {id: solicitud.id});
        }
    };

    /**
     * 
     * @param {!angular.scope} $scope
     * @param {type} services
     * @param {type} localStorageService
     */
    controllers.DetallesSolicitudController = function(
            $scope,
            services,
            localStorageService) {

        var solicitudId = $scope.ons.navigator.getCurrentPage().options.id;

        $scope.solicitud = services.Solicitud.get({solicitudId: solicitudId});
        var token = localStorageService.get("token");
    };

    controllers.DetallesSolicitudController.prototype = {
    };
})(nuevebit.inver.controllers);

