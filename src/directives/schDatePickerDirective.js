/**
 * @ngdoc directive
 * @name angular-ui-scheduler:schDatePickerDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('angular-ui-scheduler')
    .directive('schDatePicker', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs) {
                var options = {},
                    variable = attrs.ngModel,
                    defaultDate = new Date();
                options.dateFormat = attrs.dateFormat || 'mm/dd/yy';
                options.defaultDate = scope[variable];
                options.minDate = (attrs.minToday) ? defaultDate : null;
                options.maxDate = (attrs.maxDate) ? new Date(attrs('maxDate')) : null;
                options.changeMonth = (attrs.changeMonth === 'false') ? false : true;
                options.changeYear = (attrs.changeYear === 'false') ? false : true;
                options.beforeShow = function () {
                    setTimeout(function () {
                        $('.ui-datepicker').css('z-index', 9999);
                    }, 100);
                };
                $(element).datepicker(options);
            }
        };
    });