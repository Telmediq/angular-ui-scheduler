angular.module('angular-ui-scheduler', [])
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
    .controller('angularUiSchedulerCtrl', ["$scope", "$filter", "$log", "rRuleHelper", "angular_ui_scheduler_useTimezone", "angular_ui_scheduler_frequencyOptions", "angular_ui_scheduler_endOptions", "angular_ui_scheduler_occurrences", "angular_ui_scheduler_weekdays", "angular_ui_scheduler_months", function ($scope, $filter, $log, rRuleHelper,
                                                    angular_ui_scheduler_useTimezone,
                                                    angular_ui_scheduler_frequencyOptions,
                                                    angular_ui_scheduler_endOptions,
                                                    angular_ui_scheduler_occurrences,
                                                    angular_ui_scheduler_weekdays,
                                                    angular_ui_scheduler_months) {

        //region defaults
        $scope.frequencyOptions = angular_ui_scheduler_frequencyOptions;

        $scope.endOptions = angular_ui_scheduler_endOptions;

        $scope.occurrences = angular_ui_scheduler_occurrences;

        $scope.weekdays = angular_ui_scheduler_weekdays;

        $scope.months = angular_ui_scheduler_months;
        //endregion


        // region default values

        $scope.schedulerName = '';
        $scope.weekDays = [];
        $scope.schedulerStartHour = function (value) {
            if (arguments.length) {
                $scope.schedulerUTCTime = moment($scope.schedulerUTCTime).hours(value).toDate();
            } else {
                return $scope.schedulerUTCTime.getHours();
            }
        };
        $scope.schedulerStartMinute = function (value) {
            if (arguments.length) {
                $scope.schedulerUTCTime = moment($scope.schedulerUTCTime).minutes(value).toDate();
            } else {
                return $scope.schedulerUTCTime.getMinutes();
            }
        };
        $scope.schedulerStartSecond = function (value) {
            if (arguments.length) {
                $scope.schedulerUTCTime = moment($scope.schedulerUTCTime).seconds(value).toDate();
            } else {
                return $scope.schedulerUTCTime.getSeconds();
            }
        };
        $scope.schedulerUTCTime = moment().toDate();
        $scope.schedulerFrequency = $scope.frequencyOptions[0];
        $scope.schedulerShowEvery = false;
        $scope.schedulerEnd = $scope.endOptions[0];
        $scope.schedulerInterval = 1;
        $scope.schedulerOccurrenceCount = 1;
        $scope.monthlyRepeatOption = 'day';
        $scope.monthDay = 1;
        $scope.monthlyOccurrence = $scope.occurrences[0];
        $scope.monthlyWeekDay = $scope.weekdays[0];
        $scope.yearlyRepeatOption = 'month';
        $scope.yearlyMonth = $scope.months[0];
        $scope.yearlyMonthDay = 1;
        $scope.yearlyWeekDay = $scope.weekdays[0];
        $scope.yearlyOtherMonth = $scope.months[0];
        $scope.yearlyOccurrence = $scope.occurrences[0];

        //Detail view
        $scope.schedulerIsValid = false;
        $scope.rrule_nlp_description = '';
        $scope.rrule = '';
        $scope.dateChoice = 'utc';
        $scope.occurrence_list = [];

        //endregion


        function CreateSchedulerObject(scope, requireFutureST) {
            this.scope = scope;
            this.useTimezone = angular_ui_scheduler_useTimezone;
            this.requireFutureStartTime = requireFutureST;

            // Evaluate user intput and build options for passing to rrule
            this.getOptions = function () {
                var options = {};
                options.startDate = this.scope.schedulerUTCTime;
                options.frequency = this.scope.schedulerFrequency.value;
                options.interval = this.scope.schedulerInterval;
                if (this.scope.schedulerEnd.value === 'after') {
                    options.occurrenceCount = this.scope.schedulerOccurrenceCount;
                }
                if (this.scope.schedulerEnd.value === 'on') {
                    options.endDate = moment(scope.schedulerUTCTime).add(1, 'd').toDate();
                }
                if (this.scope.schedulerFrequency.value === 'weekly') {
                    options.weekDays = this.scope.weekDays;
                }
                else if (this.scope.schedulerFrequency.value === 'yearly') {
                    if (this.scope.yearlyRepeatOption === 'month') {
                        options.month = this.scope.yearlyMonth.value;
                        options.monthDay = this.scope.yearlyMonthDay;
                    }
                    else {
                        options.setOccurrence = this.scope.yearlyOccurrence.value;
                        options.weekDays = this.scope.yearlyWeekDay.value;
                        options.month = this.scope.yearlyOtherMonth.value;
                    }
                }
                else if (this.scope.schedulerFrequency.value === 'monthly') {
                    if (this.scope.monthlyRepeatOption === 'day') {
                        options.monthDay = this.scope.monthDay;
                    }
                    else {
                        options.setOccurrence = this.scope.monthlyOccurrence.value;
                        options.weekDays = this.scope.monthlyWeekDay.value;
                    }
                }
                return options;
            };

            // Clear custom field errors
            this.clearErrors = function () {
                this.scope.scheduler_weekDays_error = false;
                this.scope.scheduler_endDt_error = false;
                this.scope.resetStartDate();
                this.scope.scheduler_endDt_error = false;
                this.scope.scheduler_interval_error = false;
                this.scope.scheduler_occurrenceCount_error = false;
                this.scope.scheduler_monthDay_error = false;
                this.scope.scheduler_yearlyMonthDay_error = false;
            };

            // Set values for detail page
            this.setDetails = function () {
                //var rrule = this.getRRule(),
                //    scope = this.scope;
                //if (rrule) {
                //    scope.rrule_nlp_description = rrule.toText();
                //    scope.dateChoice = 'local';
                //    scope.occurrence_list = [];
                //    rrule.all(function (date, i) {
                //        var local, dt;
                //        if (i < 10) {
                //            if (angular_ui_scheduler_useTimezone) {
                //                dt = $timezones.align(date, scope.schedulerTimeZone);
                //                local = $filter('schZeroPad')(dt.getMonth() + 1, 2) + '/' +
                //                    $filter('schZeroPad')(dt.getDate(), 2) + '/' + dt.getFullYear() + ' ' +
                //                    $filter('schZeroPad')(dt.getHours(), 2) + ':' +
                //                    $filter('schZeroPad')(dt.getMinutes(), 2) + ':' +
                //                    $filter('schZeroPad')(dt.getSeconds(), 2) + ' ' +
                //                    dt.getTimezoneAbbreviation();
                //            }
                //            else {
                //                local = $filter('date')(date, 'MM/dd/yyyy HH:mm:ss Z');
                //            }
                //            scope.occurrence_list.push({utc: $filter('schDateStrFix')(date.toISOString()), local: local});
                //            return true;
                //        }
                //        return false;
                //    });
                //    scope.rrule_nlp_description = rrule.toText().replace(/^RRule error.*$/, 'Natural language description not available');
                //    scope.rrule = rrule.toString();
                //}
            };

            // Returns an rrule object
            this.getRRule = function () {
                var options = this.getOptions();
                return rRuleHelper.getRule(options);
            };

            // Return object containing schedule name, string representation of rrule per iCalendar RFC,
            // and options used to create rrule
            this.getValue = function () {
                var rule = this.getRRule(),
                    options = this.getOptions();
                return {
                    name: scope.schedulerName,
                    rrule: rule.toString(),
                    options: options
                };
            };

            this.setRRule = function (rule) {
                this.clear();
                return rRuleHelper.setRule(rule, this.scope);
            };

            this.setName = function (name) {
                this.scope.schedulerName = name;
            };

            // Clear the form, returning all elements to a default state
            this.clear = function () {
                this.clearErrors();
                if (this.scope.scheduler_form && this.scope.scheduler_form.schedulerName) {
                    this.scope.scheduler_form.schedulerName.$setPristine();
                }
                this.scope.setDefaults();
            };

            // futureStartTime setter/getter
            this.setRequireFutureStartTime = function (opt) {
                this.requireFutureStartTime = opt;
            };

            this.getRequireFutureStartTime = function () {
                return this.requireFutureStartTime;
            };

            this.setShowRRule = function (opt) {
                scope.showRRule = opt;
            };
        }

        function init(params) {

            var scope = params.scope,
                requireFutureStartTime = params.requireFutureStartTime || false;

            scope.schedulerShowTimeZone = angular_ui_scheduler_useTimezone;

            scope.setDefaults = function () {
                //if (angular_ui_scheduler_useTimezone) {
                //    scope.current_timezone = `.getLocal();
                //    if ($.isEmptyObject(scope.current_timezone) || !scope.current_timezone.name) {
                //        $log.error('Failed to find local timezone. Defaulting to America/New_York.');
                //        scope.current_timezone = {name: 'America/New_York'};
                //    }
                //    // Set the <select> to the browser's local timezone
                //    scope.schedulerTimeZone = _.find(scope.timeZones, function (x) {
                //        return x.name === scope.current_timezone.name;
                //    });
                //}
                //LoadLookupValues(scope);
                //SetDefaults(scope);
                scope.scheduleTimeChange();
                scope.scheduleRepeatChange();
            };

            scope.scheduleTimeChange = function () {
                if (angular_ui_scheduler_useTimezone) {
                    scope.resetStartDate();
                    try {

                        //todo check
                        scope.schedulerUTCTime = moment(scope.schedulerUTCTime).tz(scope.schedulerTimeZone);

                        scope.scheduler_form_schedulerStartDt_error = false;
                        scope.scheduler_startTime_error = false;
                    }
                    catch (e) {
                        scope.startDateError('Provide a valid start date and time');
                    }
                }
                else {
                    scope.scheduler_startTime_error = false;
                    scope.scheduler_form_schedulerStartDt_error = false;
                }
            };

            scope.resetError = function (variable) {
                scope[variable] = false;
            };

            scope.scheduleRepeatChange = function () {
                if (scope.schedulerFrequency && scope.schedulerFrequency.value !== '' && scope.schedulerFrequency.value !== 'none') {
                    scope.schedulerInterval = 1;
                    scope.schedulerShowInterval = true;
                    scope.schedulerIntervalLabel = scope.schedulerFrequency.intervalLabel;
                }
                else {
                    scope.schedulerShowInterval = false;
                    scope.schedulerEnd = scope.endOptions[0];
                }
                scope.sheduler_frequency_error = false;
            };

            scope.setWeekday = function (event, day) {
                // Add or remove day when user clicks checkbox button
                var i = scope.weekDays.indexOf(day);
                if (i >= 0) {
                    scope.weekDays.splice(i, 1);
                }
                else {
                    scope.weekDays.push(day);
                }
                $(event.target).blur();
                scope.scheduler_weekDays_error = false;
            };

            scope.startDateError = function (msg) {
                scope.scheduler_form_schedulerStartDt_error = msg;
            };

            scope.resetStartDate = function () {
                scope.scheduler_form_schedulerStartDt_error = '';
            };

            scope.schedulerEndChange = function () {
                scope.schedulerOccurrenceCount = 1;
            };

            if (angular_ui_scheduler_useTimezone) {
                scope.timeZones = moment.tz.names();
            }
            scope.setDefaults();

            return new CreateSchedulerObject(scope, requireFutureStartTime);
        }

        $scope.scheduler = init({scope: $scope, requireFutureStartTime: false});
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
    .directive('angularUiScheduler', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular-ui-scheduler/src/angularUiScheduler.html',
            controller: 'angularUiSchedulerCtrl',
            link: function (scope, elem, attr) {

            }
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
    .factory('rRuleHelper', ["angular_ui_scheduler_useTimezone", "$log", "$filter", "angular_ui_scheduler_frequencyOptions", "angular_ui_scheduler_weekdays", function (angular_ui_scheduler_useTimezone, $log, $filter,
                                      angular_ui_scheduler_frequencyOptions,
                                      angular_ui_scheduler_weekdays) {
        return {
            //returns rrule based on current state of UI
            getRule: function (params) {
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
            setRule: function (rule) {
                if (!rule) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

                var tokens = rule.split(/;/);
                if (!angular.isArray(tokens)) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

                var params = {};

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

                function setValue(pair, set) {
                    var key = pair.split(/=/)[0].toUpperCase(),
                        value = pair.split(/=/)[1],
                        days, l, j, dt, month, day, timeString;

                    if (key === 'NAME') {
                        //name is not actually part of RRule, but we can handle it just the same
                        params.schedulerName = value;
                    }

                    if (key === 'FREQ') {
                        l = value.toLowerCase();
                        params.schedulerFrequency = _.find(angular_ui_scheduler_frequencyOptions, function (opt) {
                            params.schedulerIntervalLabel = opt.intervalLabel;
                            return opt.value === l;
                        });
                        if (!params.schedulerFrequency || !params.schedulerFrequency.name) {
                            throw 'FREQ not found in list of valid options';
                        }
                    }
                    if (key === 'INTERVAL') {
                        if (parseInt(value, 10)) {
                            params.schedulerInterval = parseInt(value, 10);
                            params.schedulerShowInterval = true;
                        }
                        else {
                            throw 'INTERVAL must contain an integer > 0';
                        }
                    }
                    if (key === 'BYDAY') {
                        if (getValue(set, 'FREQ') === 'WEEKLY') {
                            days = value.split(/,/);
                            params.weekDays = [];
                            for (j = 0; j < days.length; j++) {
                                if (_.contains(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'], days[j])) {
                                    params.weekDays.push(days[j].toLowerCase());
                                    params['weekDay' + days[j].toUpperCase() + 'Class'] = 'active'; //activate related button
                                }
                                else {
                                    throw 'BYDAY contains unrecognized day value(s)';
                                }
                            }
                        }
                        else if (getValue(set, 'FREQ') === 'MONTHLY') {
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
                    }
                    if (key === 'BYMONTHDAY') {
                        if (parseInt(value, 10) && parseInt(value, 10) > 0 && parseInt(value, 10) < 32) {
                            params.monthDay = parseInt(value, 10);
                            params.monhthlyRepeatOption = 'day';
                        }
                        else {
                            throw 'BYMONTHDAY must contain an integer between 1 and 31';
                        }
                    }
                    if (key === 'DTSTART') {
                        // The form has been reset to the local zone

                        if (/\d{8}T\d{6}.*Z/.test(value)) {
                            // date may come in without separators. add them so new Date constructor will work
                            value = value.replace(/(\d{4})(\d{2})(\d{2}T)(\d{2})(\d{2})(\d{2}.*$)/,
                                function (match, p1, p2, p3, p4, p5, p6) {
                                    return p1 + '-' + p2 + '-' + p3 + p4 + ':' + p5 + ':' + p6.substr(0, 2) + 'Z';
                                });
                        }
                        if (angular_ui_scheduler_useTimezone) {
                            dt = new Date(value); // date adjusted to local zone automatically
                            month = $filter('schZeroPad')(dt.getMonth() + 1, 2);
                            day = $filter('schZeroPad')(dt.getDate(), 2);
                            params.schedulerStartDt = month + '/' + day + '/' + dt.getFullYear();
                            params.schedulerStartHour = $filter('schZeroPad')(dt.getHours(), 2);
                            params.schedulerStartMinute = $filter('schZeroPad')(dt.getMinutes(), 2);
                            params.schedulerStartSecond = $filter('schZeroPad')(dt.getSeconds(), 2);
                            params.scheduleTimeChange();  // calc UTC
                        }
                        else {
                            // expects inbound dates to be in ISO format: 2014-04-02T00:00:00.000Z
                            params.schedulerStartDt = value.replace(/T.*$/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, function (match, p1, p2, p3) {
                                return p2 + '/' + p3 + '/' + p1;
                            });
                            timeString = value.replace(/^.*T/, '');
                            params.schedulerStartHour = $filter('schZeroPad')(timeString.substr(0, 2), 2);
                            params.schedulerStartMinute = $filter('schZeroPad')(timeString.substr(3, 2), 2);
                            params.schedulerStartSecond = $filter('schZeroPad')(timeString.substr(6, 2), 2);
                        }
                        params.scheduleTimeChange();
                    }
                    if (key === 'BYSETPOS') {
                        if (getValue(set, 'FREQ') === 'YEARLY') {
                            params.yearlRepeatOption = 'other';
                            params.yearlyOccurrence = _.find(params.occurrences, function (x) {
                                return (x.value === parseInt(value, 10));
                            });
                            if (!params.yearlyOccurrence || !params.yearlyOccurrence.name) {
                                throw 'BYSETPOS was not in the tokens of 1,2,3,4,-1';
                            }
                        }
                        else {
                            params.monthlyOccurrence = _.find(params.occurrences, function (x) {
                                return (x.value === parseInt(value, 10));
                            });
                            if (!params.monthlyOccurrence || !params.monthlyOccurrence.name) {
                                throw 'BYSETPOS was not in the tokens of 1,2,3,4,-1';
                            }
                        }
                    }

                    if (key === 'COUNT') {
                        if (parseInt(value, 10)) {
                            params.schedulerEnd = params.endOptions[1];
                            params.schedulerOccurrenceCount = parseInt(value, 10);
                        }
                        else {
                            throw 'COUNT must be a valid integer > 0';
                        }
                    }

                    if (key === 'UNTIL') {
                        if (/\d{8}T\d{6}.*Z/.test(value)) {
                            // date may come in without separators. add them so new Date constructor will work
                            value = value.replace(/(\d{4})(\d{2})(\d{2}T)(\d{2})(\d{2})(\d{2}.*$)/,
                                function (match, p1, p2, p3, p4, p5, p6) {
                                    return p1 + '-' + p2 + '-' + p3 + p4 + ':' + p5 + ':' + p6.substr(0, 2) + 'Z';
                                });
                        }
                        params.schedulerEnd = params.endOptions[2];
                        if (angular_ui_scheduler_useTimezone) {
                            dt = new Date(value); // date adjusted to local zone automatically
                            month = $filter('schZeroPad')(dt.getMonth() + 1, 2);
                            day = $filter('schZeroPad')(dt.getDate(), 2);
                            params.schedulerEndDt = month + '/' + day + '/' + dt.getFullYear();
                        }
                        else {
                            params.schedulerEndDt = value.replace(/T.*$/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, function (match, p1, p2, p3) {
                                return p2 + '/' + p3 + '/' + p1;
                            });
                        }
                    }

                    if (key === 'BYMONTH') {
                        if (getValue(set, 'FREQ') === 'YEARLY' && getValue(set, 'BYDAY')) {
                            params.yearlRepeatOption = 'other';
                            params.yearlyOtherMonth = _.find(params.months, function (x) {
                                return x.value === parseInt(value, 10);
                            });
                            if (!params.yearlyOtherMonth || !params.yearlyOtherMonth.name) {
                                throw 'BYMONTH must be an integer between 1 and 12';
                            }
                        }
                        else {
                            params.yearlyOption = 'month';
                            params.yearlyMonth = _.find(params.months, function (x) {
                                return x.value === parseInt(value, 10);
                            });
                            if (!params.yearlyMonth || !params.yearlyMonth.name) {
                                throw 'BYMONTH must be an integer between 1 and 12';
                            }
                        }
                    }

                    if (key === 'BYMONTHDAY') {
                        if (parseInt(value, 10)) {
                            params.yearlyMonthDay = parseInt(value, 10);
                        }
                        else {
                            throw 'BYMONTHDAY must be an integer between 1 and 31';
                        }
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

                for (var i = 0; i < tokens.length; i++) {
                    setValue(tokens[i], tokens);
                }
                validate();

                return params;
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