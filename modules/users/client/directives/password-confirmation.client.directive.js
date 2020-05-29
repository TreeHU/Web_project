angular.module('users')
    .directive('valueMatches', ['$parse', function ($parse) {
        return {
        require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
            var originalModel = $parse(attrs.valueMatches),
                secondModel = $parse(attrs.ngModel);
            // Watch for changes to this input
            scope.$watch(attrs.ngModel, function (newValue) {
                ngModel.$setValidity(attrs.name, newValue === originalModel(scope));
            });
            // Watch for changes to the value-matches model's value
            scope.$watch(attrs.valueMatches, function (newValue) {
                ngModel.$setValidity(attrs.name, newValue === secondModel(scope));
            });
            }
        };
    }]);