/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.services = nuevebit.inver.services || {};

nuevebit.inver.services.EstadisticasService = function($http) {
    return {
        getResumenIndicadores: function() {
            return $http({
                url: URL_SERVICE + "/estadisticas.php",
                method: "GET",
                params: {resumenIndicadores: true}
            });
        }
    };
    /*
    return $resource(URL_SERVICE + "/estadisticas.php", {}, {
        getResumenIndicadores: {
            method: "GET", 
            params: {resumenIndicadores: true}, 
            isArray: true
        }
    });
    */
};

