/**
 * @ngdoc service
 * @name angular-ui-scheduler:rRuleHelper
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('rRuleHelper', function (angular_ui_scheduler_useTimezone, $log, $filter,
                                      angular_ui_scheduler_frequencyOptions,
                                      angular_ui_scheduler_occurrences,
                                      angular_ui_scheduler_endOptions,
                                      angular_ui_scheduler_weekdays,
                                      angular_ui_scheduler_months) {
        return {

            // Evaluate user intput and build options for passing to rrule
            getOptions: function (scope) {
                var options = {};
                options.startDate = scope.schedulerUTCTime;
                options.frequency = scope.schedulerFrequency.value;
                options.interval = scope.schedulerInterval;
                if (scope.schedulerEnd.value === 'after') {
                    options.occurrenceCount = scope.schedulerOccurrenceCount;
                }
                if (scope.schedulerEnd.value === 'on') {
                    options.endDate = moment(scope.schedulerUTCTime).add(1, 'd').toDate();
                }
                if (scope.schedulerFrequency.value === 'weekly') {
                    options.weekDays = scope.weekDays;
                }
                else if (scope.schedulerFrequency.value === 'yearly') {
                    if (scope.yearlyRepeatOption === 'month') {
                        options.month = scope.yearlyMonth.value;
                        options.monthDay = scope.yearlyMonthDay;
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
                if (!rule) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

                var tokens = rule.split(/;/);
                if (!angular.isArray(tokens)) {
                    throw 'No rule entered. Provide a valid RRule string.';
                }

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

                function setValue(pair, set) {
                    var key = pair.split(/=/)[0].toUpperCase(),
                        value = pair.split(/=/)[1],
                        days, l, j, dt, month, day, timeString;

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
                        value = normalizeDate(value);
                        params.schedulerStartDt = new Date(value);
                    }
                    if (key === 'BYSETPOS') {
                        if (getValue(set, 'FREQ') === 'YEARLY') {
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
                    }

                    if (key === 'COUNT') {
                        if (parseInt(value, 10)) {
                            params.schedulerEnd = angular_ui_scheduler_endOptions[1];
                            params.schedulerOccurrenceCount = parseInt(value, 10);
                        }
                        else {
                            throw 'COUNT must be a valid integer > 0';
                        }
                    }

                    if (key === 'UNTIL') {
                        value = normalizeDate(value);
                        params.schedulerEnd = angular_ui_scheduler_endOptions[2];
                        params.schedulerEndDt = new Date(value);
                    }

                    if (key === 'BYMONTH') {
                        if (getValue(set, 'FREQ') === 'YEARLY' && getValue(set, 'BYDAY')) {
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
    });
