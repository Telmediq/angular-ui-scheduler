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
    .controller('angularUiSchedulerCtrl', function ($scope, $filter, $log, rRuleHelper,
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
                return rRuleHelper.getRule(this.scope);
            };

            // Return object containing schedule name, string representation of rrule per iCalendar RFC,
            // and options used to create rrule
            this.getValue = function () {
                var rule = this.getRRule(),
                    options = rRuleHelper.getOptions(this.scope);
                return {
                    name: this.scope.schedulerName,
                    rrule: this.getRRule().toString(),
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
    });
