'use strict';

describe('inVer App', function() {

    describe("lista de teléfonos de prueba", function() {
        beforeEach(function() {
            browser.get('src/www/index.html');
        });

        it("debe filtrar los resultados", function() {
            var phones = element.all(by.repeater("phone in phones"));
            var query = element(by.model("query"));

            expect(phones.count()).toBe(3);
            
            query.sendKeys("uno");
            expect(phones.count()).toBe(1);
        });
    });
});
