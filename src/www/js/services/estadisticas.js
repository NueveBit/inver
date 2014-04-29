/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.services = nuevebit.inver.services || {};

(function(services) {
    services.EstadisticasService = function($http) {
        this._init($http);
    };

    services.EstadisticasService.prototype = {
        _init: function($http) {
            this._http = $http;
        },
        getResumenIndicadores: function() {
            return this._http({
                url: URL_SERVICE + "/estadisticas.php",
                method: "GET",
                params: {resumenIndicadores: true}
            });
        },
        getIndicadores: function(searchCriteria) {
            return this._http({
                url: URL_SERVICE + "/estadisticas.php",
                method: "GET",
                params: searchCriteria
            });
        }
    };
})(nuevebit.inver.services);

angular.module("inverServices").service("estadisticasService", [
    "$http",
    nuevebit.inver.services.EstadisticasService
]);