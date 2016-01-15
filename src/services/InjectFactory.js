/**
 * @ngdoc service
 * @name angular-ui-scheduler:InjectFactory
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('Inject', function (scheduler_partial, $compile, $http) {
        return function (params) {

            var scope = params.scope,
                target = params.target,
                buttons = params.buttons;

            if (scope.removeHtmlReady) {
                scope.removeHtmlReady();
            }
            scope.removeHtmlReady = scope.$on('htmlReady', function (e, data) {
                var element = (angular.isObject(target)) ? target : angular.element(document.getElementById(target));
                element.html(data);
                $compile(element)(scope);
                if (buttons) {
                    $('#scheduler-buttons').show();
                }
            });

            $http({method: 'GET', url: scheduler_partial + 'angular-scheduler.html'})
                .success(function (data) {
                    scope.$emit('htmlReady', data);
                })
                .error(function (data, status) {
                    throw('Error reading ' + scheduler_partial + 'angular-scheduler.html. ' + status);
                });
        };
    });