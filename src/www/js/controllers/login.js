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
    controllers.LoginController = function(
            $scope,
            $location,
            services,
            localStorageService) {

        this.scope = $scope;
        this.location = $location;
        this.services = services;
        this.localStorageService = localStorageService;
    };

    controllers.LoginController.prototype = {
        login: function(valid, usuario) {
            if (!usuario) { // no se han escrito datos en los text fields
                return;
            }
            
            var AuthManager = this.services.AuthManager;
            var scope = this.scope;

            AuthManager.login({
                username: usuario.nombreUsuario,
                password: usuario.password
            }, angular.bind(this, function(data) {
                if (data.loggedIn) {
                    this.localStorageService.add("token", data.token);
                    this.location.path("/contenedor");
                    //scope.ons.navigator.resetToPage('views/contenedor.html');
                } else {
                    scope.mensaje = "Nombre de usuario o contraseña incorrecto";
                }
            }));
        },
        logout: function() {
            var AuthManager = this.services.AuthManager;
            AuthManager.logout(angular.bind(this, function(data) {
                this.scope.ons.navigator.resetToPage('views/login.html');
            }));
        }
    };
})(nuevebit.inver.controllers);
