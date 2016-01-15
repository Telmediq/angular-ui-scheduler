/**
 * @ngdoc factory
 * @name angular-ui-scheduler:InjectDetail
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('InjectDetail', function (scheduler_partial, $compile, $http) {
        return function (params) {

            var scope = params.scope,
                target = params.target,
                showRRule = params.showRRule;

            scope.showRRule = showRRule || false;

            if (scope.removeHtmlDetailReady) {
                scope.removeHtmlDetailReady();
            }
            scope.removeHtmlDetailReady = scope.$on('htmlDetailReady', function (e, data) {
                var element = (angular.isObject(target)) ? target : angular.element(document.getElementById(target));
                element.html(data);
                $compile(element)(scope);
            });

            $http({method: 'GET', url: scheduler_partial + 'angular-scheduler-detail.html'})
                .success(function (data) {
                    scope.$emit('htmlDetailReady', data);
                })
                .error(function (data, status) {
                    throw('Error reading ' + scheduler_partial + 'angular-scheduler-detail.html. ' + status);
                    //$log.error('Error calling ' + scheduler_partial + '. ' + status);
                });
        };
    });
