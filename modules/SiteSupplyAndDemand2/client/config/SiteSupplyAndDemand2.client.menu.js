(function() {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand2')
        .run(coreMenu);

    coreMenu.$inject = ['Menus'];
    function coreMenu(Menus){

        Menus.addMenuItem('sidebar', {
            title: '딥러닝 예측',
            state: 'app.SiteSupplyAndDemand2',
            type: 'item',
            iconClass: 'fa fa-bar-chart',
            position: 3,
            roles: ['*']
        });

    }

})();