/**
 * @ngdoc service
 * @name angular-ui-scheduler:SchedulerInit
 *
 * @description
 *
 * Initialize supporting scope variables and functions. Returns a scheduler object with getString(),
 * setString() and inject() methods.
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('SchedulerInit', function ($log, $filter, $timezones, LoadLookupValues, SetDefaults, CreateObject, useTimezone, showUTCField, InRange) {
            return function (params) {

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
                    LoadLookupValues(scope);
                    SetDefaults(scope);
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

            };
        });