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
    controllers.MainController = function($scope) {
        this.scope = $scope;

        var solicitudId = this._getSolicitudId();
        if (solicitudId) {
            $scope.ons.navigator.pushPage("views/solicitudes/detalles.html", {id: solicitudId});
        }
    };

    controllers.MainController.prototype = {
        _getSolicitudId: function() {
            var parts = window.location.hash.split("=");
            return (parts.length > 1) ? parts[1] : -1;
        }
    };
})(nuevebit.inver.controllers);