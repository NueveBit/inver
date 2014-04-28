/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.controllers = nuevebit.inver.controllers || {};

nuevebit.inver.controllers.EstadisticasController = function(
        $scope,
        estadisticasService) {

    this._init($scope, estadisticasService);
};

nuevebit.inver.controllers.EstadisticasController.prototype = {
    // construct
    _init: function($scope, estadisticasService) {
        this._scope = $scope;
        this._estadisticasService = estadisticasService;

        var that = this;

        //this._searchCriteria = {};
        $scope.resumenIndicadores = estadisticasService.getResumenIndicadores()
                .success(function(data) {
                    that._newResumenIndicadoresChart(data);
                });
    },
    _newResumenIndicadoresChart: function(data) {
        var nombres = [];
        var valores = [];
        for (var i in data) {
            var indicador = data[i];
            valores.push(indicador.promedio);
            nombres.push(indicador.promedio.toFixed(2)+ " - " + indicador.nombre);
        }
        
        var r = Raphael("holder"),
                pie = r.piechart(320, 240, 100, valores, {legend: nombres, legendpos: "west"});
        r.text(320, 100, "Resumen indicadores").attr({font: "20px sans-serif"});
        pie.hover(function() {
            this.sector.stop();
            this.sector.scale(1.1, 1.1, this.cx, this.cy);
            if (this.label) {
                this.label[0].stop();
                this.label[0].attr({r: 7.5});
                this.label[1].attr({"font-weight": 800});
            }
        }, function() {
            this.sector.animate({transform: 's1 1 ' + this.cx + ' ' + this.cy}, 500, "bounce");
            if (this.label) {
                this.label[0].animate({r: 5}, 500, "bounce");
                this.label[1].attr({"font-weight": 400});
            }
        });
    }
};

