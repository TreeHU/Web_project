'use strict';

// Configuring the Articles module
angular.module('app.facility.admin')
       .run(['Menus',
  function (Menus) {
    Menus.addMenuItem('sidebar', {
      title: 'Facilities',
      state: 'app.facilities',
      roles: ['admin'],
      type: 'item',
      iconClass: 'icon-settings',
      position: 15
  });
  }
]);
