angular.module('angular-ui-scheduler', [])
    .constant('angular_ui_scheduler_hideStart', true)
    .constant('angular_ui_scheduler_useTimezone', false);
/**
 * @ngdoc controller
 * @name angular-ui-scheduler:angularUiSchedulerCtrl
 *
 * @description
 *
 *
 * @requires $scope
 * */
angular.module('angular-ui-scheduler')
    .controller('angularUiSchedulerCtrl', ["$scope", "$filter", "$log", "rRuleHelper", "angular_ui_scheduler_useTimezone", "angular_ui_scheduler_frequencyOptions", "angular_ui_scheduler_endOptions", "angular_ui_scheduler_occurrences", "angular_ui_scheduler_weekdays", "angular_ui_scheduler_months", function ($scope, $filter, $log, rRuleHelper,
                                                    angular_ui_scheduler_useTimezone,
                                                    angular_ui_scheduler_frequencyOptions,
                                                    angular_ui_scheduler_endOptions,
                                                    angular_ui_scheduler_occurrences,
                                                    angular_ui_scheduler_weekdays,
                                                    angular_ui_scheduler_months) {

        //region lookup fields

        $scope.schedulerShowTimeZone = angular_ui_scheduler_useTimezone;

        $scope.frequencyOptions = angular_ui_scheduler_frequencyOptions;

        $scope.endOptions = angular_ui_scheduler_endOptions;

        $scope.occurrences = angular_ui_scheduler_occurrences;

        $scope.weekdays = angular_ui_scheduler_weekdays;

        $scope.months = angular_ui_scheduler_months;

        //endregion

        //region this should be moved to time edit directive
        $scope.schedulerStartHour = function (value) {
            if (arguments.length) {
                $scope.uiState.schedulerStartDt = moment($scope.uiState.schedulerStartDt).hours(value).toDate();
            } else {
                return $scope.uiState.schedulerStartDt.getHours();
            }
        };
        $scope.schedulerStartMinute = function (value) {
            if (arguments.length) {
                $scope.uiState.schedulerStartDt = moment($scope.uiState.schedulerStartDt).minutes(value).toDate();
            } else {
                return $scope.uiState.schedulerStartDt.getMinutes();
            }
        };
        $scope.schedulerStartSecond = function (value) {
            if (arguments.length) {
                $scope.uiState.schedulerStartDt = moment($scope.uiState.schedulerStartDt).seconds(value).toDate();
            } else {
                return $scope.uiState.schedulerStartDt.getSeconds();
            }
        };
        //endregion

        $scope.setWeekday = function (day) {
            // Add or remove day when user clicks checkbox button
            var i = $scope.uiState.weekDays.indexOf(day);
            if (i >= 0) {
                $scope.uiState.weekDays.splice(i, 1);
            }
            else {
                $scope.uiState.weekDays.push(day);
            }
        };

        // Set values for detail page
        //$scope.setDetails = function () {
        //    //Detail view
        //    $scope.schedulerIsValid = false;
        //    $scope.rrule_nlp_description = '';
        //    $scope.rrule = '';
        //    $scope.dateChoice = 'utc';
        //    $scope.occurrence_list = [];
        //
        //    //var rrule = this.getRRule(),
        //    //    scope = this.scope;
        //    //if (rrule) {
        //    //    scope.rrule_nlp_description = rrule.toText();
        //    //    scope.dateChoice = 'local';
        //    //    scope.occurrence_list = [];
        //    //    rrule.all(function (date, i) {
        //    //        var local, dt;
        //    //        if (i < 10) {
        //    //            if (angular_ui_scheduler_useTimezone) {
        //    //                dt = $timezones.align(date, scope.schedulerTimeZone);
        //    //                local = $filter('schZeroPad')(dt.getMonth() + 1, 2) + '/' +
        //    //                    $filter('schZeroPad')(dt.getDate(), 2) + '/' + dt.getFullYear() + ' ' +
        //    //                    $filter('schZeroPad')(dt.getHours(), 2) + ':' +
        //    //                    $filter('schZeroPad')(dt.getMinutes(), 2) + ':' +
        //    //                    $filter('schZeroPad')(dt.getSeconds(), 2) + ' ' +
        //    //                    dt.getTimezoneAbbreviation();
        //    //            }
        //    //            else {
        //    //                local = $filter('date')(date, 'MM/dd/yyyy HH:mm:ss Z');
        //    //            }
        //    //            scope.occurrence_list.push({utc: $filter('schDateStrFix')(date.toISOString()), local: local});
        //    //            return true;
        //    //        }
        //    //        return false;
        //    //    });
        //    //    scope.rrule_nlp_description = rrule.toText().replace(/^RRule error.*$/, 'Natural language description not available');
        //    //    scope.rrule = rrule.toString();
        //    //}
        //};

        // Returns an rrule object
        $scope.getRRule = function () {
            return rRuleHelper.getRule($scope.uiState);
        };

        // Return object containing schedule name, string representation of rrule per iCalendar RFC and options used to create rrule
        $scope.getValue = function () {
            var rule = $scope.getRRule(),
                options = rRuleHelper.getOptions($scope.uiState);
            return {
                rrule: $scope.getRRule().toString(),
                options: options
            };
        };

        $scope.setRRule = function (rule) {
            $scope.clear();
            rRuleHelper.setRule(rule, $scope.uiState);
        };

        $scope.setStartDate = function (startDate) {
            $scope.uiState.schedulerStartDt = startDate;
            $scope.uiState.schedulerEndDt = moment(startDate).endOf('week').toDate();
        };

        // Clear the form, returning all elements to a default state
        $scope.clear = function () {
            $scope.uiState = {
                weekDays: [],
                schedulerStartDt: new Date(),
                schedulerFrequency: $scope.frequencyOptions[0],
                schedulerEnd: $scope.endOptions[0],
                schedulerInterval: 1,
                schedulerOccurrenceCount: 1,
                monthlyRepeatOption: 'day',
                monthDay: 1,
                monthlyOccurrence: $scope.occurrences[0],
                monthlyWeekDay: $scope.weekdays[0],
                yearlyRepeatOption: 'month',
                yearlyMonth: $scope.months[0],
                yearlyWeekDay: $scope.weekdays[0],
                yearlyOtherMonth: $scope.months[0],
                yearlyOccurrence: $scope.occurrences[0],
                schedulerEndDt: moment().endOf('week').toDate()
            };

            if (angular_ui_scheduler_useTimezone) {
                $scope.timeZones = moment.tz.names();
            }
        };

        $scope.clear();

        //update role
        $scope.$watch('uiState', function (state) {
            $scope.rule = $scope.getValue();
        }, true);

        $scope.scheduleRepeatChange = function () {
            $log.debug('schedule repeat change');
            if ($scope.uiState.schedulerFrequency && $scope.uiState.schedulerFrequency.value !== '' && $scope.uiState.schedulerFrequency.value !== 'none') {
                $scope.uiState.schedulerInterval = 1;
            }
            else {
                $scope.uiState.schedulerEnd = $scope.endOptions[0];
            }
        };

        $scope.schedulerEndChange = function () {
            $scope.uiState.schedulerOccurrenceCount = 1;
        };
    }]);
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
    .directive('angularUiScheduler', ["$log", function ($log) {
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
    }]);
/**
 * @ngdoc service
 * @name angular-ui-scheduler:schZeroPadFilter
 *
 * @description
 * $filter('schZeroPad')(n, pad) -- or -- {{ n | afZeroPad:pad }}
 *
 * */
angular.module('angular-ui-scheduler')
    .filter('schZeroPad', function () {
        return function (n, pad) {
            var str = (Math.pow(10, pad) + '').replace(/^1/, '') + (n + '').trim();
            return str.substr(str.length - pad);
        };
    });
/**
 * @ngdoc service
 * @name angular-ui-scheduler:rRuleHelper
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('rRuleHelper', ["angular_ui_scheduler_useTimezone", "$log", "$filter", "angular_ui_scheduler_frequencyOptions", "angular_ui_scheduler_occurrences", "angular_ui_scheduler_endOptions", "angular_ui_scheduler_weekdays", "angular_ui_scheduler_months", function (angular_ui_scheduler_useTimezone, $log, $filter,
                                      angular_ui_scheduler_frequencyOptions,
                                      angular_ui_scheduler_occurrences,
                                      angular_ui_scheduler_endOptions,
                                      angular_ui_scheduler_weekdays,
                                      angular_ui_scheduler_months) {
        return {

            // Evaluate user intput and build options for passing to rrule
            getOptions: function (scope) {
                var options = {};
                options.startDate = scope.schedulerStartDt;
                options.frequency = scope.schedulerFrequency.value;
                options.interval = scope.schedulerInterval;
                if (scope.schedulerEnd.value === 'after') {
                    options.occurrenceCount = scope.schedulerOccurrenceCount;
                }
                if (scope.schedulerEnd.value === 'on') {
                    options.endDate = scope.schedulerEndDt;
                }
                if (scope.schedulerFrequency.value === 'weekly') {
                    options.weekDays = scope.weekDays;
                }
                else if (scope.schedulerFrequency.value === 'yearly') {
                    if (scope.yearlyRepeatOption === 'month') {
                        options.month = scope.yearlyMonth.value;
                        options.monthDay = scope.monthDay;
                    }
                    else {
                        options.setOccurrence = scope.yearlyOccurrence.value;
                        options.weekDays = scope.yearlyWeekDay.value;
                        options.month = scope.yearlyOtherMonth.value;
                    }
                }
                else if (scope.schedulerFrequency.value === 'monthly') {
                    if (scope.monthlyRepeatOption === 'day') {
                        options.monthDay = scope.monthDay;
                    }
                    else {
                        options.setOccurrence = scope.monthlyOccurrence.value;
                        options.weekDays = scope.monthlyWeekDay.value;
                    }
                }
                return options;
            },

            //returns rrule based on current state of UI
            getRule: function (scope) {

                var params = this.getOptions(scope);

                // Convert user inputs to an rrule. Returns rrule object using https://github.com/jkbr/rrule
                // **list of 'valid values' found below in LoadLookupValues

                var startDate = params.startDate,  // date object or string in yyyy-MM-ddTHH:mm:ss.sssZ format
                    frequency = params.frequency,  // string, optional, valid value from frequencyOptions
                    interval = params.interval,    // integer, optional
                    occurrenceCount = params.occurrenceCount,  //integer, optional
                    endDate = params.endDate,      // date object or string in yyyy-MM-dd format, optional
                                                   // ignored if occurrenceCount provided
                    month = params.month,          // integer, optional, valid value from months
                    monthDay = params.monthDay,    // integer, optional, between 1 and 31
                    weekDays = params.weekDays,     // integer, optional, valid value from weekdays
                    setOccurrence = params.setOccurrence, // integer, optional, valid value from occurrences
                    options = {}, i;

                if (angular.isDate(startDate)) {
                    options.dtstart = startDate;
                }
                else {
                    try {
                        options.dtstart = new Date(startDate);
                    }
                    catch (e) {
                        $log.error('Date conversion failed. Attempted to convert ' + startDate + ' to Date. ' + e.message);
                    }
                }

                if (frequency && frequency !== 'none') {
                    options.freq = RRule[frequency.toUpperCase()];
                    options.interval = interval;

                    if (weekDays && typeof weekDays === 'string') {
                        options.byweekday = RRule[weekDays.toUpperCase()];
                    }

                    if (weekDays && angular.isArray(weekDays)) {
                        options.byweekday = [];
                        for (i = 0; i < weekDays.length; i++) {
                            options.byweekday.push(RRule[weekDays[i].toUpperCase()]);
                        }
                    }

                    if (setOccurrence !== undefined && setOccurrence !== null) {
                        options.bysetpos = setOccurrence;
                    }

                    if (month) {
                        options.bymonth = month;
                    }

                    if (monthDay) {
                        options.bymonthday = monthDay;
                    }

                    if (occurrenceCount) {
                        options.count = occurrenceCount;
                    }
                    else if (endDate) {
                        if (angular.isDate(endDate)) {
                            options.until = endDate;
                        }
                        else {
                            try {
                                options.until = new Date(endDate);
                            }
                            catch (e) {
                                $log.error('Date conversion failed. Attempted to convert ' + endDate + ' to Date. ' + e.message);
                            }
                        }
                    }
                }
                else {
                    // We only want to run 1x
                    options.freq = RRule.DAILY;
                    options.interval = 1;
                    options.count = 1;
                }
                return new RRule(options);
            },

            //configures UI based on rrule
            setRule: function (rule, params) {

                // Search the tokens of RRule keys for a particular key, returning its value
                function getValue(set, key) {
                    var pair = _.find(set, function (x) {
                        var k = x.split(/=/)[0].toUpperCase();
                        return (k === key);
                    });
                    if (pair) {
                        return pair.split(/=/)[1].toUpperCase();
                    }
                    return null;
                }

                function toWeekDays(days) {
                    var darray = days.toLowerCase().split(/,/),
                        match = _.find(angular_ui_scheduler_weekdays, function (x) {
                            var warray = (angular.isArray(x.value)) ? x.value : [x.value],
                                diffA = _.difference(warray, darray),
                                diffB = _.difference(darray, warray);
                            return (diffA.length === 0 && diffB.length === 0);
                        });
                    return match;
                }

                function normalizeDate(value) {
                    if (/\d{8}T\d{6}.*Z/.test(value)) {
                        // date may come in without separators. add them so new Date constructor will work
                        value = value.replace(/(\d{4})(\d{2})(\d{2}T)(\d{2})(\d{2})(\d{2}.*$)/,
                            function (match, p1, p2, p3, p4, p5, p6) {
                                return p1 + '-' + p2 + '-' + p3 + p4 + ':' + p5 + ':' + p6.substr(0, 2) + 'Z';
                            });
                    }
                    return value;
                }

                function setValue(token, tokens) {

                    var key = token[0].toUpperCase(),
                        value = token[1];

                    switch (key) {
                        case 'FREQ':
                            var l = value.toLowerCase();
                            params.schedulerFrequency = _.find(angular_ui_scheduler_frequencyOptions, function (opt) {
                                params.schedulerIntervalLabel = opt.intervalLabel;
                                return opt.value === l;
                            });
                            if (!params.schedulerFrequency || !params.schedulerFrequency.name) {
                                throw 'FREQ not found in list of valid options';
                            }
                            break;

                        case 'INTERVAL' :
                            if (parseInt(value, 10)) {
                                params.schedulerInterval = parseInt(value, 10);
                                params.schedulerShowInterval = true;
                            }
                            else {
                                throw 'INTERVAL must contain an integer > 0';
                            }
                            break;

                        case 'BYDAY':
                            if (getValue(tokens, 'FREQ') === 'WEEKLY') {
                                var days = value.split(/,/);
                                params.weekDays = [];
                                for (var j = 0; j < days.length; j++) {
                                    if (_.contains(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'], days[j])) {
                                        params.weekDays.push(days[j].toLowerCase());
                                    }
                                    else {
                                        throw 'BYDAY contains unrecognized day value(s)';
                                    }
                                }
                            }
                            else if (getValue(tokens, 'FREQ') === 'MONTHLY') {
                                params.monthlyRepeatOption = 'other';
                                params.monthlyWeekDay = toWeekDays(value);
                                if (!params.monthlyWeekDay) {
                                    throw 'BYDAY contains unrecognized day value(s)';
                                }
                            }
                            else {
                                params.yearlyRepeatOption = 'other';
                                params.yearlyWeekDay = toWeekDays(value);
                                if (!params.yearlyWeekDay) {
                                    throw 'BYDAY contains unrecognized day value(s)';
                                }
                            }
                            break;

                        case 'BYMONTHDAY':
                            if (parseInt(value, 10) && parseInt(value, 10) > 0 && parseInt(value, 10) < 32) {
                                params.monthDay = parseInt(value, 10);
                                params.monhthlyRepeatOption = 'day';
                            }
                            else {
                                throw 'BYMONTHDAY must contain an integer between 1 and 31';
                            }
                            break;

                        case 'DTSTART':
                            // The form has been reset to the local zone
                            value = normalizeDate(value);
                            var tmpDate = moment(value);
                            if (!tmpDate.isValid()) {
                                throw 'Invalid DTSTART: ' + value;
                            }
                            params.schedulerStartDt = tmpDate.toDate();
                            break;

                        case 'BYSETPOS':
                            if (getValue(tokens, 'FREQ') === 'YEARLY') {
                                params.yearlRepeatOption = 'other';
                                params.yearlyOccurrence = _.find(angular_ui_scheduler_occurrences, function (x) {
                                    return (x.value === parseInt(value, 10));
                                });
                                if (!params.yearlyOccurrence || !params.yearlyOccurrence.name) {
                                    throw 'BYSETPOS was not in the tokens of 1,2,3,4,-1';
                                }
                            }
                            else {
                                params.monthlyOccurrence = _.find(angular_ui_scheduler_occurrences, function (x) {
                                    return (x.value === parseInt(value, 10));
                                });
                                if (!params.monthlyOccurrence || !params.monthlyOccurrence.name) {
                                    throw 'BYSETPOS was not in the tokens of 1,2,3,4,-1';
                                }
                            }
                            break;

                        case 'COUNT':
                            if (parseInt(value, 10)) {
                                params.schedulerEnd = angular_ui_scheduler_endOptions[1];
                                params.schedulerOccurrenceCount = parseInt(value, 10);
                            }
                            else {
                                throw 'COUNT must be a valid integer > 0';
                            }
                            break;

                        case 'UNTIL':
                            value = normalizeDate(value);
                            params.schedulerEnd = angular_ui_scheduler_endOptions[2];
                            params.schedulerEndDt = new Date(value);
                            break;

                        case 'BYMONTH':
                            if (getValue(tokens, 'FREQ') === 'YEARLY' && getValue(tokens, 'BYDAY')) {
                                params.yearlRepeatOption = 'other';
                                params.yearlyOtherMonth = _.find(angular_ui_scheduler_months, function (x) {
                                    return x.value === parseInt(value, 10);
                                });
                                if (!params.yearlyOtherMonth || !params.yearlyOtherMonth.name) {
                                    throw 'BYMONTH must be an integer between 1 and 12';
                                }
                            }
                            else {
                                params.yearlyOption = 'month';
                                params.yearlyMonth = _.find(angular_ui_scheduler_months, function (x) {
                                    return x.value === parseInt(value, 10);
                                });
                                if (!params.yearlyMonth || !params.yearlyMonth.name) {
                                    throw 'BYMONTH must be an integer between 1 and 12';
                                }
                            }
                            break;
                        default:
                            $log.warn('rrule key `' + key + '` is invalid');
                    }
                }

                function validate() {
                    // Check what was put into params vars, and see if anything is
                    // missing or not quite right.
                    if (params.schedulerFrequency.name === 'weekly' && params.weekDays.length === 0) {
                        throw 'Frequency is weekly, but BYDAYS value is missing.';
                    }
                    if (!params.schedulerStartDt) {
                        throw 'Warning: start date was not provided';
                    }
                }

                if (!rule) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

                var tokens = rule.split(/;/);
                if (!angular.isArray(tokens)) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

                tokens.forEach(function (token) {
                    setValue(token.split(/=/), tokens);
                });
                validate();

                return params;
            }
        };
    }]);
