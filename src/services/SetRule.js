/**
 * @ngdoc service
 * @name angular-ui-scheduler:SetRule
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('SetRule', function (useTimezone, $log, $timezones, $filter) {
        return function (rule, scope) {
            var set, result = '', i,
                setStartDate = false;

            // Search the set of RRule keys for a particular key, returning its value
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
                    match = _.find(scope.weekdays, function (x) {
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
                    scope.schedulerName = value;
                }

                if (key === 'FREQ') {
                    l = value.toLowerCase();
                    scope.schedulerFrequency = _.find(scope.frequencyOptions, function (opt) {
                        scope.schedulerIntervalLabel = opt.intervalLabel;
                        return opt.value === l;
                    });
                    if (!scope.schedulerFrequency || !scope.schedulerFrequency.name) {
                        result = 'FREQ not found in list of valid options';
                    }
                }
                if (key === 'INTERVAL') {
                    if (parseInt(value, 10)) {
                        scope.schedulerInterval = parseInt(value, 10);
                        scope.schedulerShowInterval = true;
                    }
                    else {
                        result = 'INTERVAL must contain an integer > 0';
                    }
                }
                if (key === 'BYDAY') {
                    if (getValue(set, 'FREQ') === 'WEEKLY') {
                        days = value.split(/,/);
                        scope.weekDays = [];
                        for (j = 0; j < days.length; j++) {
                            if (_.contains(['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'], days[j])) {
                                scope.weekDays.push(days[j].toLowerCase());
                                scope['weekDay' + days[j].toUpperCase() + 'Class'] = 'active'; //activate related button
                            }
                            else {
                                result = 'BYDAY contains unrecognized day value(s)';
                            }
                        }
                    }
                    else if (getValue(set, 'FREQ') === 'MONTHLY') {
                        scope.monthlyRepeatOption = 'other';
                        scope.monthlyWeekDay = toWeekDays(value);
                        if (!scope.monthlyWeekDay) {
                            result = 'BYDAY contains unrecognized day value(s)';
                        }
                    }
                    else {
                        scope.yearlyRepeatOption = 'other';
                        scope.yearlyWeekDay = toWeekDays(value);
                        if (!scope.yearlyWeekDay) {
                            result = 'BYDAY contains unrecognized day value(s)';
                        }
                    }
                }
                if (key === 'BYMONTHDAY') {
                    if (parseInt(value, 10) && parseInt(value, 10) > 0 && parseInt(value, 10) < 32) {
                        scope.monthDay = parseInt(value, 10);
                        scope.monhthlyRepeatOption = 'day';
                    }
                    else {
                        result = 'BYMONTHDAY must contain an integer between 1 and 31';
                    }
                }
                if (key === 'DTSTART') {
                    // The form has been reset to the local zone
                    setStartDate = true;
                    if (/\d{8}T\d{6}.*Z/.test(value)) {
                        // date may come in without separators. add them so new Date constructor will work
                        value = value.replace(/(\d{4})(\d{2})(\d{2}T)(\d{2})(\d{2})(\d{2}.*$)/,
                            function (match, p1, p2, p3, p4, p5, p6) {
                                return p1 + '-' + p2 + '-' + p3 + p4 + ':' + p5 + ':' + p6.substr(0, 2) + 'Z';
                            });
                    }
                    if (useTimezone) {
                        dt = new Date(value); // date adjusted to local zone automatically
                        month = $filter('schZeroPad')(dt.getMonth() + 1, 2);
                        day = $filter('schZeroPad')(dt.getDate(), 2);
                        scope.schedulerStartDt = month + '/' + day + '/' + dt.getFullYear();
                        scope.schedulerStartHour = $filter('schZeroPad')(dt.getHours(), 2);
                        scope.schedulerStartMinute = $filter('schZeroPad')(dt.getMinutes(), 2);
                        scope.schedulerStartSecond = $filter('schZeroPad')(dt.getSeconds(), 2);
                        scope.scheduleTimeChange();  // calc UTC
                    }
                    else {
                        // expects inbound dates to be in ISO format: 2014-04-02T00:00:00.000Z
                        scope.schedulerStartDt = value.replace(/T.*$/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, function (match, p1, p2, p3) {
                            return p2 + '/' + p3 + '/' + p1;
                        });
                        timeString = value.replace(/^.*T/, '');
                        scope.schedulerStartHour = $filter('schZeroPad')(timeString.substr(0, 2), 2);
                        scope.schedulerStartMinute = $filter('schZeroPad')(timeString.substr(3, 2), 2);
                        scope.schedulerStartSecond = $filter('schZeroPad')(timeString.substr(6, 2), 2);
                    }
                    scope.scheduleTimeChange();
                }
                if (key === 'BYSETPOS') {
                    if (getValue(set, 'FREQ') === 'YEARLY') {
                        scope.yearlRepeatOption = 'other';
                        scope.yearlyOccurrence = _.find(scope.occurrences, function (x) {
                            return (x.value === parseInt(value, 10));
                        });
                        if (!scope.yearlyOccurrence || !scope.yearlyOccurrence.name) {
                            result = 'BYSETPOS was not in the set of 1,2,3,4,-1';
                        }
                    }
                    else {
                        scope.monthlyOccurrence = _.find(scope.occurrences, function (x) {
                            return (x.value === parseInt(value, 10));
                        });
                        if (!scope.monthlyOccurrence || !scope.monthlyOccurrence.name) {
                            result = 'BYSETPOS was not in the set of 1,2,3,4,-1';
                        }
                    }
                }

                if (key === 'COUNT') {
                    if (parseInt(value, 10)) {
                        scope.schedulerEnd = scope.endOptions[1];
                        scope.schedulerOccurrenceCount = parseInt(value, 10);
                    }
                    else {
                        result = 'COUNT must be a valid integer > 0';
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
                    scope.schedulerEnd = scope.endOptions[2];
                    if (useTimezone) {
                        dt = new Date(value); // date adjusted to local zone automatically
                        month = $filter('schZeroPad')(dt.getMonth() + 1, 2);
                        day = $filter('schZeroPad')(dt.getDate(), 2);
                        scope.schedulerEndDt = month + '/' + day + '/' + dt.getFullYear();
                    }
                    else {
                        scope.schedulerEndDt = value.replace(/T.*$/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, function (match, p1, p2, p3) {
                            return p2 + '/' + p3 + '/' + p1;
                        });
                    }
                }

                if (key === 'BYMONTH') {
                    if (getValue(set, 'FREQ') === 'YEARLY' && getValue(set, 'BYDAY')) {
                        scope.yearlRepeatOption = 'other';
                        scope.yearlyOtherMonth = _.find(scope.months, function (x) {
                            return x.value === parseInt(value, 10);
                        });
                        if (!scope.yearlyOtherMonth || !scope.yearlyOtherMonth.name) {
                            result = 'BYMONTH must be an integer between 1 and 12';
                        }
                    }
                    else {
                        scope.yearlyOption = 'month';
                        scope.yearlyMonth = _.find(scope.months, function (x) {
                            return x.value === parseInt(value, 10);
                        });
                        if (!scope.yearlyMonth || !scope.yearlyMonth.name) {
                            result = 'BYMONTH must be an integer between 1 and 12';
                        }
                    }
                }

                if (key === 'BYMONTHDAY') {
                    if (parseInt(value, 10)) {
                        scope.yearlyMonthDay = parseInt(value, 10);
                    }
                    else {
                        result = 'BYMONTHDAY must be an integer between 1 and 31';
                    }
                }
            }

            function isValid() {
                // Check what was put into scope vars, and see if anything is
                // missing or not quite right.
                if (scope.schedulerFrequency.name === 'weekly' && scope.weekDays.length === 0) {
                    result = 'Frequency is weekly, but BYDAYS value is missing.';
                }
                if (!setStartDate) {
                    result = 'Warning: start date was not provided';
                }
            }

            if (rule) {
                set = rule.split(/;/);
                if (angular.isArray(set)) {
                    for (i = 0; i < set.length; i++) {
                        setValue(set[i], set);
                        if (result) {
                            break;
                        }
                    }
                    if (!result) {
                        isValid();
                    }
                }
                else {
                    result = 'No rule entered. Provide a valid RRule string.';
                }
            }
            else {
                result = 'No rule entered. Provide a valid RRule string.';
            }
            if (result) {
                $log.error(result);
            }
            return result;
        };
    });