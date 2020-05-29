(function() {
    'use strict';

    angular
        .module('app.sites')
        .run(coreMenu);

    coreMenu.$inject = ['Menus'];
    function coreMenu(Menus){

        Menus.addMenuItem('sidebar', {
            title: '사이트별 현황',
            // state: ('' | 'app.sites') ,
            state: 'app.sites',
            // type: 'item',
            type: 'dropdown',
            iconClass: 'icon-chart',
            position: 3,
            roles: ['*']
            // class: 'siteMenu'
        });
        //각 state의 숫자들은 시설의 facil_Id를 나타냄
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '대전에너지사업단', state: 'app.sites3' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '무지개 초등학교', state: 'app.sites26' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '아산에너지 사업단', state: 'app.sites20' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '연화 마을 7단지', state: 'app.sites19' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '강원지역본부', state: 'app.sites1' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '광주전남지역본부', state: 'app.sites2' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(고양삼송A16)', state: 'app.sites23' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(서울서초A3)', state: 'app.sites21' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(아산배방1)', state: 'app.sites25' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(평택소사벌A3)', state: 'app.sites22' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(화성향남A2)', state: 'app.sites24' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '경기본부', state: 'app.sites6' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '경남본부', state: 'app.sites9' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '대구경북본부', state: 'app.sites11' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '대전연수원', state: 'app.sites16' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '대전충남본부', state: 'app.sites4' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '본사', state: 'app.sites18' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '부산울산본부', state: 'app.sites5' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '서울본부', state: 'app.sites7' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '속초연수원', state: 'app.sites8' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '인천본부', state: 'app.sites13' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '전북본부', state: 'app.sites14' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '제주본부', state: 'app.sites10' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(강릉포남1)', state: 'app.sites15' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(대전도안1B)', state: 'app.sites12' });
        Menus.addSubMenuItem('sidebar', 'app.sites', { title: '주택(세종1-3생활권)', state: 'app.sites17' });


    }

})();