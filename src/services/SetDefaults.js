/**
 * @ngdoc service
 * @name angular-ui-scheduler:SetDefaults
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('SetDefaults', function ($filter) {
        return function (scope) {
            // Set default values
            var defaultDate = new Date(),
                defaultMonth = $filter('schZeroPad')(defaultDate.getMonth() + 1, 2),
                defaultDay = $filter('schZeroPad')(defaultDate.getDate(), 2),
                defaultDateStr = defaultMonth + '/' + defaultDay + '/' + defaultDate.getFullYear();
            scope.schedulerName = '';
            scope.weekDays = [];
            scope.schedulerStartHour = '00';
            scope.schedulerStartMinute = '00';
            scope.schedulerStartSecond = '00';
            scope.schedulerStartDt = defaultDateStr;
            scope.schedulerFrequency = scope.frequencyOptions[0];
            scope.schedulerShowEvery = false;
            scope.schedulerEnd = scope.endOptions[0];
            scope.schedulerInterval = 1;
            scope.schedulerOccurrenceCount = 1;
            scope.monthlyRepeatOption = 'day';
            scope.monthDay = 1;
            scope.monthlyOccurrence = scope.occurrences[0];
            scope.monthlyWeekDay = scope.weekdays[0];
            scope.yearlyRepeatOption = 'month';
            scope.yearlyMonth = scope.months[0];
            scope.yearlyMonthDay = 1;
            scope.yearlyWeekDay = scope.weekdays[0];
            scope.yearlyOtherMonth = scope.months[0];
            scope.yearlyOccurrence = scope.occurrences[0];
            scope.weekDayMOClass = '';
            scope.weekDayTUClass = '';
            scope.weekDayWEClass = '';
            scope.weekDayTHClass = '';
            scope.weekDayFRClass = '';
            scope.weekDaySAClass = '';
            scope.weekDaySUClass = '';

            //Detail view
            scope.schedulerIsValid = false;
            scope.rrule_nlp_description = '';
            scope.rrule = '';
            scope.dateChoice = 'utc';
            scope.occurrence_list = [];
        };
    });