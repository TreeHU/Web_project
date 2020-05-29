(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['Menus'];
    function SidebarLoader(Menus ) {
        this.getMenu = getMenu;
        this.open = open;
        

        ////////////////

        function getMenu(onReady, onError) {
          onError = onError || function() { alert('Failure loading menu'); };

          var menu = Menus.getMenu('sidebar');
          if( menu )
            onReady( menu );
          else
            onError();

        }
        // function open() {
        //     //   $scope.type=type;
        //     /* div 태그 안으로 수정*/
        //     ngDialog.open({
        //         template: 'firstDialogId',
        //         controller: 'FacilitiesPopupController'

        //     });
        // };
    }
})();