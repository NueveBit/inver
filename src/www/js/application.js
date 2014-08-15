/**
 * inVer Application Module 
 */

var nuevebit = nuevebit || {};
nuevebit.inver = nuevebit.inver || {}

nuevebit.inver.Application = {
    _angularApp: null,
    _init: function() {
        angular.module("inverServices", ["ngResource"]);
        angular.module("nuevebit.directives", []); // TODO: Debería estar en otro script

        this._angularApp = angular.module("inverApp", [
            "ngRoute",
            'ngResource',
            "inverServices",
            "nuevebit.directives",
            "onsen.directives",
            "LocalStorageModule"
        ]);

        this._mount();
        //console.log("changed");
        // bind controllers
        //this._addControllers();
    },
    _mount: function() {
        this._angularApp.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                        when('/login', {
                            templateUrl: 'views/login.html',
                            //controller: 'MainController'
                        }).
                        when('/contenedor', {
                            templateUrl: 'views/contenedor.html',
                            //controller: 'MainController'
                        }).
                        when('/home', {
                            templateUrl: 'views/home.html',
                        }).
                        when('/perfil', {
                            templateUrl: 'views/perfil.html'
                        })
                        .otherwise({
                            redirectTo: '/login'
                        });
            }]);
    },
    start: function() {
        this._init();

        // cordova requiere la variable global 'app', aquí inicializamos
        if (typeof app !== "undefined") {
            app.initialize();
        } else {
            //handleOpenURL("inver://solicitud=1");
        }
    }
};

// por el momento deshabilitamos el soporte para el botón "atrás" del dispositivo
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(e) {
    e.preventDefault();
}

function handleOpenURL(url) {
    setTimeout(function() {
        // cada vez que se cambia window.location, la última dirección que
        // se haya establecido permanecerá ahí, esto tiene el problema
        // de evitar que se muestre una solicitud si previamente ya se
        // ha mostrado, por lo tanto necesitamos agregar un parámetro
        // adicional que siempre cambie, para evitar esto.
        window.location = "#/contenedor?solicitud=" + getIdFromSchemeURL(url)
                + "&date=" + new Date().getTime();
    }, 0);
}

function  getIdFromSchemeURL(url) {
    // en ocasiones, la URL contiene parámetros adicionales, el scheme está
    // antes de esos parámetros
    var scheme = url.split("?")[0];
    return scheme.split("=")[1];
}

nuevebit.inver.Application.start();
