(function() {
    'use strict';

    angular
        .module('app.totalsite')
        .run(coreMenu);

    coreMenu.$inject = ['Menus'];
    function coreMenu(Menus){

        Menus.addMenuItem('sidebar', {
            title: "전체사이트수급현황상세",
            state: 'app.dash',
            type: 'dropdown',
            iconClass: 'fa fa-line-chart',
            position: 2,
            roles: ['*']
        });

        Menus.addSubMenuItem('sidebar', 'app.dash', {
            title: '전체사이트 수급현황 상세',//'Dashboard v1',
            state: 'app.totalsite_v2'
        });
        // Menus.addSubMenuItem('sidebar', 'app.dash', {
        //     title: '에너지 소비 예측',//'Dashboard v2',
        //     state: 'app.totalsite_v2'
        // });
        // Menus.addSubMenuItem('sidebar', 'app.dash', {
        //     title: 'Dashboard v3',
        //     state: 'app.dashboard_v3'
        // });

    }

})();