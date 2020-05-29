'use strict';

// Configuring the Articles module
angular.module('users.admin')
       .run(['Menus',
  function (Menus) {
    Menus.addMenuItem('sidebar', {
      title: 'Users',
      state: 'app.users',
      roles: ['admin'],
      type: 'item',
      iconClass: 'icon-user',
      position: 14
  });
  }
]);
