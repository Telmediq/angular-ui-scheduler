/**
 * @ngdoc service
 * @name angular-ui-scheduler:CreateObjectFactory
 *
 * @description
 * Return an AngularScheduler object we can use to get the RRule result from user input, check if
 * user input is valid, reset the form, etc. All the things we need to access and manipulate the
 * scheduler widget
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('CreateObject', function (useTimezone, $filter, GetRule, Inject, InjectDetail, SetDefaults, $timezones, SetRule, InRange) {
        return function (scope, requireFutureST) {
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

                // Read in the HTML partial, compile and inject it into the DOM.
                // Pass in the target element's id attribute value or an angular.element()
                // object.
                this.inject = function (element, showButtons) {
                    return Inject({scope: this.scope, target: element, buttons: showButtons});
                };

                this.injectDetail = function (element, showRRule) {
                    return InjectDetail({scope: this.scope, target: element, showRRule: showRRule});
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
        };
    });