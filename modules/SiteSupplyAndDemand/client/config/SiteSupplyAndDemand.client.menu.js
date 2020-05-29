(function() {
    'use strict';

    angular
        .module('app.SiteSupplyAndDemand')
        .run(coreMenu);

    coreMenu.$inject = ['Menus'];
    function coreMenu(Menus){

        Menus.addMenuItem('sidebar', {
            title: '용도별 수급현황',
            state: 'app.SiteSupplyAndDemand',
            type: 'item',
            iconClass: 'fa fa-bar-chart',
            position: 3,
            roles: ['*']
        });

    }

})();