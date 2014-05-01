/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {};
nuevebit.inver.directives = nuevebit.inver.directives || {};

(function(directives) {
    directives.Chart = function(id, values, options) {
        if (!id) {
            throw new Error("id is required");
        }

        this.id = id;
        this.labels = options.labels || [];
        this.title = options.title;
        this.values = values || [];

        this._chart = this._createChart();
    };
    
    directives.Chart.prototype = {
        _createChart: function() {
            var r = Raphael(this.id);
            var pie = r.piechart(150, 150, 100, this.values, {
                legend: this.labels,
                legendpos: "east"
            });

            if (this.title) {
                r.text(340, 10, this.title).attr({font: "20px sans-serif"});
            }
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

            return r;
        },
        repaint: function() {
            // to repaint, simply remove the old svg and create a new one
            if (this._chart) {
                this._chart.remove();
            }

            this._chart = this._createChart();
        },
        destroy: function() {
            if (this._chart) {
                this._chart.remove();
            }
        }
    };
})(nuevebit.inver.directives);

var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length - 1].src;

angular.module("nuevebit.directives").directive("nuevebitChart",
        function() {
            var directives = nuevebit.inver.directives;
            var chart;

            return {
                restrict: "E",
                replace: true,
                scope: {
                    values: "=",
                    labels: "="
                },
                link: function(scope, element, attrs) {
                    if (!attrs.id) {
                        throw new Error("id must be set ");
                    }

                    chart = new directives.Chart(attrs.id, scope.values, {
                        title: attrs.title,
                        labels: scope.labels
                    });

                    scope.$watch("values", function(values) {
                        if (!values || chart.values === values) {
                            return;
                        }

                        chart.labels = scope.labels;
                        chart.values = values;
                        chart.repaint();
                    });

                    element.on("$destroy", function() {
                        chart.destroy();
                    });
                },
                template: "<div></div>"
            };
        });
