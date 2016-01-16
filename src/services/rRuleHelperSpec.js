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
            schedulerStartDt: '2013-12-12',
            schedulerStartHour: '13',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
            schedulerFrequency: {name: 'Daily', value: 'daily'},
            schedulerInterval: 3,
            schedulerEnd: {name: 'On Day', value: 'on'},
            schedulerEndDt: '2014-03-28',
            rrule: "FREQ=DAILY;DTSTART=20131212T130000Z;INTERVAL=3;UNTIL=20140328T130000Z"
        },
        {
            schedulerStartDt: '2014-03-03',
            schedulerStartHour: '17',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
            schedulerFrequency: {name: 'Weekly', value: 'weekly'},
            schedulerInterval: 1,
            weekDays: ["su", "mo", "sa"],
            schedulerEnd: {name: 'After', value: 'after'},
            schedulerOccurrenceCount: 5,
            rrule: "FREQ=WEEKLY;DTSTART=20140303T170000Z;INTERVAL=1;COUNT=5;BYDAY=SU,MO,SA"
        },
        {
            schedulerStartDt: '2014-03-13',
            schedulerStartHour: '00',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
            schedulerFrequency: {name: 'Monthly', value: 'monthly'},
            schedulerInterval: 1,
            monthlyRepeatOption: 'day',
            monthDay: 1,
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=MONTHLY;DTSTART=20140313T000000Z;INTERVAL=1;BYMONTHDAY=1"
        },
        {
            schedulerStartDt: '2014-03-13',
            schedulerStartHour: '00',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
            schedulerFrequency: {name: 'Monthly', value: 'monthly'},
            schedulerInterval: 1,
            monthlyRepeatOption: 'other',
            monthlyOccurrence: {name: 'third', value: 3},
            monthlyWeekDay: {name: 'Weekend day', value: ["sa", "su"]},
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=MONTHLY;DTSTART=20140313T000000Z;INTERVAL=1;BYSETPOS=3;BYDAY=SA,SU"
        },
        {
            schedulerStartDt: '2014-03-19',
            schedulerStartHour: '00',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
            schedulerFrequency: {name: 'Yearly', value: 'yearly'},
            schedulerInterval: 5,
            yearlyRepeatOption: 'month',
            yearlyMonth: {name: 'April', value: 4},
            yearlyMonthDay: 1,
            schedulerEnd: {name: 'Never', value: 'never'},
            rrule: "FREQ=YEARLY;DTSTART=20140319T000000Z;INTERVAL=5;BYMONTH=4;BYMONTHDAY=1"
        },
        {
            schedulerStartDt: '2014-03-19',
            schedulerStartHour: '00',
            schedulerStartMinute: '00',
            schedulerStartSecond: '00',
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
        _.forEach(schedules, function (item) {
            expect(item.rrule).toBe(service.getRule(item));
        });
    });

    it('should correctly get values on a scope', function () {
        _.forEach(schedules, function (item) {

            var result = {};
            service.setRule(item.rrule, result);

            result.rrule = item.rrule;

            expect(result.rrule).toBe(item.rrule);
        });
    })
});
