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
    .controller('angularUiSchedulerCtrl', function($scope, $filter){

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
            defaultDay = $filter('schZeroPad')(defaultDate.getDate(), 2),
            defaultDateStr = defaultMonth + '/' + defaultDay + '/' + defaultDate.getFullYear();
        $scope.schedulerName = '';
        $scope.weekDays = [];
        $scope.schedulerStartHour = '00';
        $scope.schedulerStartMinute = '00';
        $scope.schedulerStartSecond = '00';
        $scope.schedulerStartDt = defaultDateStr;
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
});
