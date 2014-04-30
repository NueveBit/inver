/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
    controllers.ResumenEstadisticasController = function(
            $scope,
            services) {

        this.services = services;
        this.scope = $scope;

        services.Indicador.query({resumenIndicadores: true}, function(data) {

            var nombres = [];
            var valores = [];
            angular.forEach(data, function(indicador) {
                valores.push(indicador.promedio);
                nombres.push(indicador.promedio.toFixed(2) + " - " + indicador.nombre);
            });

            $scope.labels = nombres;
            $scope.values = valores;
        });
    };

    controllers.ResumenEstadisticasController.prototype = {
    };

    controllers.IndicadoresEstadisticasController = function(
            $scope,
            services) {

        this.scope = $scope;
        this.scope.tiposSujetos
                = services.TipoSujeto.query(angular.bind(this, function(data) {
                    $scope.tipoSujeto = data[1];

                    var Sujeto = services.Sujeto;
                    $scope.sujetosObligados = Sujeto.query({tipoId: $scope.tipoSujeto.id});

                    // retrasa hasta este punto la carga de indicadores para
                    // mostrar sólo las estadísticas de 1 tipo de indicador a la vez
                    this.scope.tiposIndicadores = services.TipoIndicador.query(
                            angular.bind(this, function(data) {
                                $scope.indicador = data[0];
                                this.updateChart();
                            }));
                }));
        this.scope.sujetosObligados = [];

        this.services = services;
    };

    controllers.IndicadoresEstadisticasController.prototype = {
        tipoSujetoChanged: function(tipoSujeto) {
            var Sujeto = this.services.Sujeto;
            this.scope.sujetosObligados = Sujeto.query({tipoId: tipoSujeto.id});

            this.updateChart();
        },
        updateChart: function() {
            var Indicador = this.services.Indicador;
            var scope = this.scope;
            var params = {
                tipoSujeto: scope.tipoSujeto.id,
                indicador: scope.indicador.id
            };
            if (scope.sujetoObligado) {
                params.sujetoObligado = scope.sujetoObligado.id;
            }

            Indicador.query(params, function(data) {
                var labels = [];
                var values = [];

                if (!data.length) {
                    // handle errors!
                }

                var indicadores = data[0]["indicadores"];
                angular.forEach(indicadores, function(indicador) {
                    labels.push(indicador.valor.toFixed(2) + " - " + indicador.nombre);
                    values.push(indicador.valor);
                });

                scope.chartLabels = labels;
                scope.chartValues = values;
            });
        },
    };
})(nuevebit.inver.controllers);

