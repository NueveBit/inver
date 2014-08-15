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
    controllers.MenuController = function($scope, $location, services) {
        this.scope = $scope;
        this.services = services;
        this.location = $location;
        
        $scope.pages = [
            {nombre: "Perfil", url: "views/perfil.html", "icon": "gear", "isSelected": ""},
            {nombre: "Mis solicitudes", url: "views/listaSolicitudes.html", "icon": "bars", "isSelected": "", options: {global: false}},
            {nombre: "Estadísticas", url: "views/estadisticas.html", "icon": "book", "isSelected": ""},
            {nombre: "Buscar solicitudes", url: "views/listaSolicitudes.html", "icon": "bars", "isSelected": "", options: {global: true}},
            {nombre: "Cerrar sesión", action: "logout", "icon": "power-off", "isSelected": ""}
        ];

        $scope.selectedIndex = -1;
    };

    controllers.MenuController.prototype = {
        itemClicked: function(index) {
            this.scope.selectedIndex = index;

            var page = this.scope.pages[index];
            this.scope.ons.splitView.toggle()
            
            // maneja logout
            if (page.url) {
                if (page.options) {
                    this.services.global.options = page.options;
                } else {
                    this.services.global.options = {};
                }
                
                this.scope.ons.splitView.setMainPage(page.url);
            } else if (page.action && page.action === "logout") {
                this.services.Auth.logout();
                this.location.path("/login");
            }
        }
    };
})(nuevebit.inver.controllers);