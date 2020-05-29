'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {

    // Menus.addMenuItem('topbar', {
    //   title: 'Admin',
    //   state: 'admin',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });

    Menus.addMenuItem('sidebar', {
      title: '홈',
      state: 'app.home',
      type: 'item',
      iconClass: 'icon-home',
      position: 1,
      roles: ['*']
    });
  }
]);
