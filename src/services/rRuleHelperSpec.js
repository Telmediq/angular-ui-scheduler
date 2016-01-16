describe('Service: angular-ui-scheduler.rRuleHelper', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (_rRuleHelper_) {
        service = _rRuleHelper_;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });

    var schedules = [
        {
            schedulerStartDt: moment('2013-12-12T13:00:00T').toDate(),
            schedulerFrequency: {name: 'Daily', value: 'daily'},
            schedulerInterval: 3,
            schedulerEnd: {name: 'On Day', value: 'on'},
            schedulerEndDt: moment('2014-03-28T13:00:00T').toDate(),
            rrule: "FREQ=DAILY;DTSTART=20131212T130000Z;INTERVAL=3;UNTIL=20140328T130000Z"
        },
        {
            schedulerStartDt: moment('2014-03-03T17:00:00T').toDate(),
            schedulerFrequency: {name: 'Weekly', value: 'weekly'},
            schedulerInterval: 1,
            weekDays: ["su", "mo", "sa"],
            schedulerEnd: {name: 'After', value: 'after'},
            schedulerOccurrenceCount: 5,
            rrule: "FREQ=WEEKLY;DTSTART=20140303T170000Z;INTERVAL=1;COUNT=5;BYDAY=SU,MO,SA"
        },
        {
            schedulerStartDt: moment('2014-03-13T00:00:00T').toDate(),
            schedulerFrequency: {name: 'Monthly', value: 'monthly'},
            schedulerInterval: 1,
            monthlyRepeatOption: 'day',
            monthDay: 1,
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=MONTHLY;DTSTART=20140313T000000Z;INTERVAL=1;BYMONTHDAY=1"
        },
        {
            schedulerStartDt: moment('2014-03-13T00:00:00T').toDate(),
            schedulerFrequency: {name: 'Monthly', value: 'monthly'},
            schedulerInterval: 1,
            monthlyRepeatOption: 'other',
            monthlyOccurrence: {name: 'third', value: 3},
            monthlyWeekDay: {name: 'Weekend day', value: ["sa", "su"]},
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=MONTHLY;DTSTART=20140313T000000Z;INTERVAL=1;BYSETPOS=3;BYDAY=SA,SU"
        },
        {
            schedulerStartDt: moment('2014-03-19T00:00:00T').toDate(),
            schedulerFrequency: {name: 'Yearly', value: 'yearly'},
            schedulerInterval: 5,
            yearlyRepeatOption: 'month',
            yearlyMonth: {name: 'April', value: 4},
            yearlyMonthDay: 1,
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=YEARLY;DTSTART=20140319T000000Z;INTERVAL=5;BYMONTH=4;BYMONTHDAY=1"
        },
        {
            schedulerStartDt: moment('2014-03-19T00:00:00T').toDate(),
            schedulerFrequency: {name: 'Yearly', value: 'yearly'},
            schedulerInterval: 1,
            yearlyRepeatOption: 'other',
            yearlyOccurrence: {name: 'last', value: -1},
            yearlyWeekDay: {name: 'Monday', value: 'mo'},
            yearlyOtherMonth: {name: 'July', value: 7},
            schedulerEnd: {name: 'After', value: 'after'},
            schedulerOccurrenceCount: 5,
            rrule: "FREQ=YEARLY;DTSTART=20140319T000000Z;INTERVAL=1;COUNT=5;BYSETPOS=-1;BYMONTH=7;BYDAY=MO"
        }];

    it('should correctly set values on a scope', function () {
        schedules.forEach(function (item) {
            expect(item.rrule).toBe(service.getRule(item));
        });
    });

    it('should correctly get values on a passed on object', function () {
        _.forEach(schedules, function (item) {

            var result = {};
            service.setRule(item.rrule, result);

            result.rrule = item.rrule;

            expect(result).toEqual(item);
        });
    })
});
