'use strict';

/* jasmine specs for controllers go here */
describe('inVer controllers', function() {

    beforeEach(module('inverApp'));
    //beforeEach(module('phonecatServices'));

    var controllers = nuevebit.inver.controllers;

    describe('MainController', function() {
        var scope = {};
        var mainController = new controllers.MainController(scope);

        it("debe haber una cadena de prueba", function() {
            expect(scope.testText).toBe("test String");
        });
    });
});
