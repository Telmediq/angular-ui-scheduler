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
    .controller('angularUiSchedulerCtrl', function($scope, $filter, $log, $timezones, useTimezone, showUTCField, InRange, GetRule, SetRule){

        //region defaults
        $scope.frequencyOptions = [
            {name: 'None (run once)', value: 'none', intervalLabel: ''},
            {name: 'Minute', value: 'minutely', intervalLabel: 'minutes'},
            {name: 'Hour', value: 'hourly', intervalLabel: 'hours'},
            {name: 'Day', value: 'daily', intervalLabel: 'days'},
            {name: 'Week', value: 'weekly', intervalLabel: 'weeks'},
            {name: 'Month', value: 'monthly', intervalLabel: 'months'},
            {name: 'Year', value: 'yearly', intervalLabel: 'years'}
        ];

        $scope.endOptions = [
            {name: 'Never', value: 'never'},
            {name: 'After', value: 'after'},
            {name: 'On Date', value: 'on'}
        ];

        $scope.occurrences = [
            {name: 'first', value: 1},
            {name: 'second', value: 2},
            {name: 'third', value: 3},
            {name: 'fourth', value: 4},
            {name: 'last', value: -1}
        ];

        $scope.weekdays = [
            {name: 'Sunday', value: 'su'},
            {name: 'Monday', value: 'mo'},
            {name: 'Tueday', value: 'tu'},
            {name: 'Wednesday', value: 'we'},
            {name: 'Thursday', value: 'th'},
            {name: 'Friday', value: 'fr'},
            {name: 'Saturday', value: 'sa'},
            {name: 'Day', value: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']},
            {name: 'Weekday', value: ['mo', 'tu', 'we', 'th', 'fr']},
            {name: 'Weekend day', value: ['sa', 'su']}
        ];

        $scope.months = [
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
        ];
        //endregion


        // region default values
        var defaultDate = new Date(),
            defaultMonth = $filter('schZeroPad')(defaultDate.getMonth() + 1, 2),
            defaultDay = $filter('schZeroPad')(defaultDate.getDate(), 2);
        $scope.schedulerName = '';
        $scope.weekDays = [];
        $scope.schedulerStartHour = 0;
        $scope.schedulerStartMinute = 0;
        $scope.schedulerStartSecond = 0;
        $scope.schedulerStartDt = defaultDate;
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
        $scope.weekDayMOClass = '';
        $scope.weekDayTUClass = '';
        $scope.weekDayWEClass = '';
        $scope.weekDayTHClass = '';
        $scope.weekDayFRClass = '';
        $scope.weekDaySAClass = '';
        $scope.weekDaySUClass = '';

        //Detail view
        $scope.schedulerIsValid = false;
        $scope.rrule_nlp_description = '';
        $scope.rrule = '';
        $scope.dateChoice = 'utc';
        $scope.occurrence_list = [];

        //endregion


        function CreateObject(scope, requireFutureST) {
            var fn = function () {

                this.scope = scope;
                this.useTimezone = useTimezone;
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
                        options.endDate = scope.schedulerEndDt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, function (match, p1, p2, p3) {
                                return p3 + '-' + p1 + '-' + p2;
                            }) + 'T' + this.scope.schedulerUTCTime.replace(/\d{2}\/\d{2}\/\d{4} /, '').replace(/ UTC/, '') + 'Z';
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

                    if (this.scope.scheduler_form && this.scope.scheduler_form.schedulerEndDt) {
                        this.scope.scheduler_form.schedulerEndDt.$setValidity('custom-error', true);
                        this.scope.scheduler_form.schedulerEndDt.$setPristine();
                        this.scope.scheduler_form.$setPristine();
                    }
                };

                // Set values for detail page
                this.setDetails = function () {
                    var rrule = this.getRRule(),
                        scope = this.scope;
                    if (rrule) {
                        scope.rrule_nlp_description = rrule.toText();
                        scope.dateChoice = 'local';
                        scope.occurrence_list = [];
                        rrule.all(function (date, i) {
                            var local, dt;
                            if (i < 10) {
                                if (useTimezone) {
                                    dt = $timezones.align(date, scope.schedulerTimeZone.name);
                                    local = $filter('schZeroPad')(dt.getMonth() + 1, 2) + '/' +
                                        $filter('schZeroPad')(dt.getDate(), 2) + '/' + dt.getFullYear() + ' ' +
                                        $filter('schZeroPad')(dt.getHours(), 2) + ':' +
                                        $filter('schZeroPad')(dt.getMinutes(), 2) + ':' +
                                        $filter('schZeroPad')(dt.getSeconds(), 2) + ' ' +
                                        dt.getTimezoneAbbreviation();
                                }
                                else {
                                    local = $filter('date')(date, 'MM/dd/yyyy HH:mm:ss Z');
                                }
                                scope.occurrence_list.push({utc: $filter('schDateStrFix')(date.toISOString()), local: local});
                                return true;
                            }
                            return false;
                        });
                        scope.rrule_nlp_description = rrule.toText().replace(/^RRule error.*$/, 'Natural language description not available');
                        scope.rrule = rrule.toString();
                    }
                };

                // Check the input form for errors
                this.isValid = function () {
                    var startDt, now, dateStr, adjNow, timeNow, timeFuture, validity = true;
                    this.clearErrors();

                    if (this.scope.schedulerFrequency.value !== 'none' && !InRange(this.scope.schedulerInterval, 1, 999, 3)) {
                        this.scope.scheduler_interval_error = true;
                        validity = false;
                    }

                    if (this.scope.schedulerEnd.value === 'after' && !InRange(this.scope.schedulerOccurrenceCount, 1, 999, 3)) {
                        this.scope.scheduler_occurrenceCount_error = true;
                        validity = false;
                    }

                    if (this.scope.schedulerFrequency.value === 'weekly' && this.scope.weekDays.length === 0) {
                        this.scope.scheduler_weekDays_error = true;
                        validity = false;
                    }

                    if (this.scope.schedulerFrequency.value === 'monthly' && this.scope.monthlyRepeatOption === 'day' && !InRange(this.scope.monthDay, 1, 31, 99)) {
                        this.scope.scheduler_monthDay_error = true;
                        validity = false;
                    }

                    if (this.scope.schedulerFrequency.value === 'yearly' && this.scope.yearlyRepeatOption === 'month' && !InRange(this.scope.yearlyMonthDay, 1, 31, 99)) {
                        this.scope.scheduler_yearlyMonthDay_error = true;
                        validity = false;
                    }
                    if (!(InRange(scope.schedulerStartHour, 0, 23, 2) && InRange(scope.schedulerStartMinute, 0, 59, 2) && InRange(scope.schedulerStartSecond, 0, 59, 2))) {
                        this.scope.scheduler_startTime_error = true;
                        validity = false;
                    }
                    if (!this.scope.scheduler_form.schedulerName.$valid) {
                        // Make sure schedulerName requird error shows up
                        this.scope.scheduler_form.schedulerName.$dirty = true;
                        $('#schedulerName').addClass('ng-dirty');
                        validity = false;
                    }
                    if (this.scope.schedulerEnd.value === 'on') {
                        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this.scope.schedulerEndDt)) {
                            this.scope.scheduler_form.schedulerEndDt.$pristine = false;
                            this.scope.scheduler_form.schedulerEndDt.$dirty = true;
                            $('#schedulerEndDt').removeClass('ng-pristine').removeClass('ng-valid').removeClass('ng-valid-custom-error')
                                .addClass('ng-dirty').addClass('ng-invalid').addClass('ng-invalid-custom-error');
                            this.scope.scheduler_endDt_error = true;
                            validity = false;
                        }
                    }
                    if (this.scope.schedulerUTCTime) {
                        try {
                            startDt = new Date(this.scope.schedulerUTCTime);
                            if (!isNaN(startDt)) {
                                timeFuture = startDt.getTime();
                                now = new Date();
                                if (this.useTimezone) {
                                    dateStr = now.getFullYear() + '-' +
                                        $filter('schZeroPad')(now.getMonth() + 1, 2) + '-' +
                                        $filter('schZeroPad')(now.getDate(), 2) + 'T' +
                                        $filter('schZeroPad')(now.getHours(), 2) + ':' +
                                        $filter('schZeroPad')(now.getMinutes(), 2) + ':' +
                                        $filter('schZeroPad')(now.getSeconds(), 2) + '.000Z';
                                    adjNow = $timezones.toUTC(dateStr, this.scope.schedulerTimeZone.name);   //Adjust to the selected TZ
                                    timeNow = adjNow.getTime();
                                }
                                else {
                                    timeNow = now.getTime();
                                }
                                if (this.requireFutureStartTime && timeNow >= timeFuture) {
                                    this.scope.startDateError('Start time must be in the future');
                                    validity = false;
                                }
                            }
                            else {
                                this.scope.startDateError('Invalid start time');
                                validity = false;
                            }
                        }
                        catch (e) {
                            this.scope.startDateError('Invalid start time');
                            validity = false;
                        }
                    }
                    else {
                        this.scope.startDateError('Provide a start time');
                        validity = false;
                    }

                    scope.schedulerIsValid = validity;
                    if (validity) {
                        this.setDetails();
                    }

                    return validity;
                };

                // Returns an rrule object
                this.getRRule = function () {
                    var options = this.getOptions();
                    return GetRule(options);
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
                    return SetRule(rule, this.scope);
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

                // Get the user's local timezone
                this.getUserTimezone = function () {
                    return $timezones.getLocal();
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
            };
            return new fn();
        }

        function Init(params) {

            var scope = params.scope,
                requireFutureStartTime = params.requireFutureStartTime || false;

            scope.schedulerShowTimeZone = useTimezone;
            scope.schedulerShowUTCStartTime = showUTCField;

            scope.setDefaults = function () {
                if (useTimezone) {
                    scope.current_timezone = $timezones.getLocal();
                    if ($.isEmptyObject(scope.current_timezone) || !scope.current_timezone.name) {
                        $log.error('Failed to find local timezone. Defaulting to America/New_York.');
                        scope.current_timezone = {name: 'America/New_York'};
                    }
                    // Set the <select> to the browser's local timezone
                    scope.schedulerTimeZone = _.find(scope.timeZones, function (x) {
                        return x.name === scope.current_timezone.name;
                    });
                }
                //LoadLookupValues(scope);
                //SetDefaults(scope);
                scope.scheduleTimeChange();
                scope.scheduleRepeatChange();
            };

            scope.scheduleTimeChange = function () {
                if (scope.schedulerStartDt === '' || scope.schedulerStartDt === null || scope.schedulerStartDt === undefined) {
                    scope.startDateError('Provide a valid start date and time');
                    scope.schedulerUTCTime = '';
                }
                else if (!(InRange(scope.schedulerStartHour, 0, 23, 2) && InRange(scope.schedulerStartMinute, 0, 59, 2) && InRange(scope.schedulerStartSecond, 0, 59, 2))) {
                    scope.scheduler_startTime_error = true;
                }
                else {
                    if (useTimezone) {
                        scope.resetStartDate();
                        try {
                            var dateStr = scope.schedulerStartDt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, function (match, p1, p2, p3) {
                                return p3 + '-' + p1 + '-' + p2;
                            });
                            dateStr += 'T' + $filter('schZeroPad')(scope.schedulerStartHour, 2) + ':' + $filter('schZeroPad')(scope.schedulerStartMinute, 2) + ':' +
                                $filter('schZeroPad')(scope.schedulerStartSecond, 2) + '.000Z';
                            scope.schedulerUTCTime = $filter('schDateStrFix')($timezones.toUTC(dateStr, scope.schedulerTimeZone.name).toISOString());
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
                        scope.schedulerUTCTime = $filter('schDateStrFix')(scope.schedulerStartDt + 'T' + scope.schedulerStartHour + ':' + scope.schedulerStartMinute +
                            ':' + scope.schedulerStartSecond + '.000Z');
                    }
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

            scope.showCalendar = function (fld) {
                $('#' + fld).focus();
            };

            scope.monthlyRepeatChange = function () {
                if (scope.monthlyRepeatOption !== 'day') {
                    $('#monthDay').spinner('disable');
                }
                else {
                    $('#monthDay').spinner('enable');
                }
            };

            scope.yearlyRepeatChange = function () {
                if (scope.yearlyRepeatOption !== 'month') {
                    $('#yearlyRepeatDay').spinner('disable');
                }
                else {
                    $('#yearlyRepeatDay').spinner('enable');
                }
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
                if (scope.scheduler_form) {
                    if (scope.scheduler_form.schedulerStartDt) {
                        scope.scheduler_form_schedulerStartDt_error = msg;
                        scope.scheduler_form.schedulerStartDt.$pristine = false;
                        scope.scheduler_form.schedulerStartDt.$dirty = true;
                    }
                    $('#schedulerStartDt').removeClass('ng-pristine').removeClass('ng-valid').removeClass('ng-valid-custom-error')
                        .addClass('ng-dirty').addClass('ng-invalid').addClass('ng-invalid-custom-error');
                }
            };

            scope.resetStartDate = function () {
                if (scope.scheduler_form) {
                    scope.scheduler_form_schedulerStartDt_error = '';
                    if (scope.scheduler_form.schedulerStartDt) {
                        scope.scheduler_form.schedulerStartDt.$setValidity('custom-error', true);
                        scope.scheduler_form.schedulerStartDt.$setPristine();
                    }
                }
            };

            scope.schedulerEndChange = function () {
                var dt = new Date(), // date adjusted to local zone automatically
                    month = $filter('schZeroPad')(dt.getMonth() + 1, 2),
                    day = $filter('schZeroPad')(dt.getDate(), 2);
                scope.schedulerEndDt = month + '/' + day + '/' + dt.getFullYear();
                scope.schedulerOccurrenceCount = 1;
            };

            // When timezones become available, use to set defaults
            if (scope.removeZonesReady) {
                scope.removeZonesReady();
            }
            scope.removeZonesReady = scope.$on('zonesReady', function () {
                scope.timeZones = JSON.parse(localStorage.zones);
                scope.setDefaults();
            });

            if (useTimezone) {
                // Build list of timezone <select> element options
                $timezones.getZoneList(scope);
            }
            else {
                scope.setDefaults();
            }

            return CreateObject(scope, requireFutureStartTime);

        }

        $scope.scheduler = Init({scope: $scope, requireFutureStartTime: false});
});
