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
    controllers.PerfilController = function(
            $scope,
            services,
            localStorageService) {

        this.scope = $scope;
        this.services = services;
        $scope.usuario = services.Usuario.get({usuarioId: localStorageService.get("token")});
    };

    controllers.PerfilController.prototype = {
        guardar: function(usuario) {
            var scope = this.scope;
            usuario.$save(function() {
                console.log(usuario);
                //scope.ons.navigator.resetToPage('views/contenedor.html');
            });
        }
    };
})(nuevebit.inver.controllers);