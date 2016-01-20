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
    .constant('angular_ui_scheduler_frequencyOptions', [
        {name: 'None (run once)', value: 'none', intervalLabel: ''},
        {name: 'Minute', value: 'minutely', intervalLabel: 'minute(s)'},
        {name: 'Hour', value: 'hourly', intervalLabel: 'hour(s)'},
        {name: 'Day', value: 'daily', intervalLabel: 'day(s)'},
        {name: 'Week', value: 'weekly', intervalLabel: 'week(s)'},
        {name: 'Month', value: 'monthly', intervalLabel: 'month(s)'},
        {name: 'Year', value: 'yearly', intervalLabel: 'year(s)'}
    ])
    .constant('angular_ui_scheduler_endOptions', [
        {name: 'Never', value: 'never'},
        {name: 'After', value: 'after'},
        {name: 'On Date', value: 'on'}
    ])
    .constant('angular_ui_scheduler_occurrences', [
        {name: 'first', value: 1},
        {name: 'second', value: 2},
        {name: 'third', value: 3},
        {name: 'fourth', value: 4},
        {name: 'last', value: -1}
    ])
    .constant('angular_ui_scheduler_weekdays', [
        {name: 'Sunday', value: 'su'},
        {name: 'Monday', value: 'mo'},
        {name: 'Tuesday', value: 'tu'},
        {name: 'Wednesday', value: 'we'},
        {name: 'Thursday', value: 'th'},
        {name: 'Friday', value: 'fr'},
        {name: 'Saturday', value: 'sa'},
        {name: 'Day', value: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']},
        {name: 'Weekday', value: ['mo', 'tu', 'we', 'th', 'fr']},
        {name: 'Weekend day', value: ['sa', 'su']}
    ])
    .constant('angular_ui_scheduler_months', [
        {name: 'January', value: 1},
        {name: 'February', value: 2},
        {name: 'March', value: 3},
        {name: 'April', value: 4},
        {name: 'May', value: 5},
        {name: 'June', value: 6},
        {name: 'July', value: 7},
        {name: 'August', value: 8},
        {name: 'September', value: 9},
        {name: 'October', value: 10},
        {name: 'November', value: 11},
        {name: 'December', value: 12}
    ])
    .directive('angularUiScheduler', function ($log) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: 'angular-ui-scheduler/src/angularUiScheduler.html',
            scope: {
                rrule: '@',
                hideStart: '=',
                startDate: '='
            },
            controller: 'angularUiSchedulerCtrl',
            link: function (scope, iElement, iAttrs, ngModelCtrl) {

                //region handle ngModelCtrl
                ngModelCtrl.$formatters.push(function (modelValue) {
                    $log.debug('angularUiSchedulerCtrl $formatters', modelValue);
                    return angular.copy(modelValue);
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    $log.debug('angularUiSchedulerCtrl $parsers', viewValue);
                    return angular.copy(viewValue);
                });

                scope.$watch('rule', function (newRule) {
                    $log.debug('angularUiSchedulerCtrl updates ngModel binding', newRule);
                    ngModelCtrl.$setViewValue(angular.copy(newRule));
                }, true);

                //ngModelCtrl.$render = function () {
                //    scope.role = ngModelCtrl.$viewValue;
                //};

                if (iAttrs.required) {
                    ngModelCtrl.$validators.required = function (modelValue, viewValue) {
                        return modelValue;
                    };
                }
                //endregion

                scope.$watch('rrule', function (newVal) {
                    if (newVal) {
                        $log.debug('setting rrule', newVal);
                        scope.setRRule(newVal);
                        if (scope.startDate) {
                            scope.setStartDate(scope.startDate);
                        }
                    }
                });

                scope.$watch('startDate', function (newVal) {
                    if (newVal && !scope.rrule) {
                        $log.debug('setting startDate', newVal);
                        scope.setStartDate(scope.startDate);
                    }
                });
            }
        };
    });