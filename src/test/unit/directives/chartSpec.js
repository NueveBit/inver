'use strict';

describe('Directive: nuevebitChart', function() {
    var scope;
    var compile;

    function compileDirective(template) {
        // devuelve la referencia a la función link() de la directiva
        return compile(template)(scope);
    }

    function linkDirective(template) {
        compileDirective(template)(scope);
    }

    beforeEach(function() {
        module('inverApp');
        // Inject in angular constructs otherwise,
        //  you would need to inject these into each test
        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;
        });
    });
    //beforeEach(module('phonecatServices'));

    var directives = nuevebit.inver.directives;

    describe('when created', function() {

        // por ahora necesitamos el id... en una futura versión se debería
        // generar automáticamente.
        it("show throw error when id not set", function() {
            var invalidTemplate = function() {
                linkDirective("<nuevebit-chart></nuevebit-chart>");
            };

            expect(invalidTemplate).toThrow();
        });
    });
});
