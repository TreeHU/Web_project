/**=========================================================
 * Module: marker-event.client.directive.js
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('core')
        .directive('onSelect', onSelect);

    function onSelect () {
        var directive = {
            link: link,
            scope:{
                lastSelected:'@',
                currentSelected:'@'
            },
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            console.log(scope);
          var options = element.data();
        //   angular.element('#'+title).attr('fill','url(#onSelectedGradient)');
          // old usage support
        }
    }

})();
