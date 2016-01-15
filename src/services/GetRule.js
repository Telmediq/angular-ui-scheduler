/**
 * @ngdoc service
 * @name angular-ui-scheduler:GetRule
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('GetRule',  function ($log) {
        return function (params) {
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
        };
    });