/**
 * @ngdoc directive
 * @name angular-ui-scheduler:angularUiScheduler
 *
 * @description
 *
 *
 * @restrict E
 * */
angular.module('angular-ui-scheduler')
    .directive('angularUiScheduler', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular-ui-scheduler/src/angularUiScheduler.html',
            controller: 'angularUiSchedulerCtrl',
            link: function (scope, elem, attr) {

            }
        };
});
