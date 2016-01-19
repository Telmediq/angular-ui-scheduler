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
    .controller('angularUiSchedulerCtrl', function ($scope, $filter, $log, rRuleHelper,
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

        $scope.setDefaults = function () {
            $scope.scheduleTimeChange();
            $scope.scheduleRepeatChange();
        };

        $scope.scheduleTimeChange = function () {
            if (angular_ui_scheduler_useTimezone) {
                $scope.resetStartDate();
                try {
                    $scope.scheduler_form_schedulerStartDt_error = false;
                    $scope.scheduler_startTime_error = false;
                }
                catch (e) {
                    $scope.startDateError('Provide a valid start date and time');
                }
            }
            else {
                $scope.scheduler_startTime_error = false;
                $scope.scheduler_form_schedulerStartDt_error = false;
            }
        };

        $scope.scheduleRepeatChange = function () {
            if ($scope.uiState.schedulerFrequency && $scope.uiState.schedulerFrequency.value !== '' && $scope.uiState.schedulerFrequency.value !== 'none') {
                $scope.uiState.schedulerInterval = 1;
                $scope.schedulerShowInterval = true;
                $scope.schedulerIntervalLabel = $scope.uiState.schedulerFrequency.intervalLabel;
            }
            else {
                $scope.schedulerShowInterval = false;
                $scope.uiState.schedulerEnd = $scope.endOptions[0];
            }
            $scope.sheduler_frequency_error = false;
        };

        $scope.resetError = function (variable) {
            $scope[variable] = false;
        };

        $scope.setWeekday = function (event, day) {
            // Add or remove day when user clicks checkbox button
            var i = $scope.uiState.weekDays.indexOf(day);
            if (i >= 0) {
                $scope.uiState.weekDays.splice(i, 1);
            }
            else {
                $scope.uiState.weekDays.push(day);
            }
            $(event.target).blur();
            $scope.scheduler_weekDays_error = false;
        };

        $scope.startDateError = function (msg) {
            $scope.scheduler_form_schedulerStartDt_error = msg;
        };

        $scope.resetStartDate = function () {
            $scope.scheduler_form_schedulerStartDt_error = '';
        };

        $scope.schedulerEndChange = function () {
            $scope.uiState.schedulerOccurrenceCount = 1;
        };

        // Clear custom field errors
        $scope.clearErrors = function () {
            $scope.scheduler_weekDays_error = false;
            $scope.scheduler_endDt_error = false;
            $scope.resetStartDate();
            $scope.scheduler_endDt_error = false;
            $scope.scheduler_interval_error = false;
            $scope.scheduler_occurrenceCount_error = false;
            $scope.scheduler_monthDay_error = false;
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
            $scope.scheduleRepeatChange();
        };

        $scope.setStartDate = function (startDate) {
            $scope.uiState.schedulerStartDt = startDate;
        };

        // Clear the form, returning all elements to a default state
        $scope.clear = function () {
            $scope.clearErrors();
            $scope.setDefaults();
        };

        function init() {
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
                yearlyOccurrence: $scope.occurrences[0]
                //schedulerEndDt: undefined
            };

            if (angular_ui_scheduler_useTimezone) {
                $scope.timeZones = moment.tz.names();
            }
            $scope.setDefaults();
        }

        init();

        //update role
        $scope.$watch('uiState', function (state) {
            $scope.rule = $scope.getValue();
        }, true);

    });
