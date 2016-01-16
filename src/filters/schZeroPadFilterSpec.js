describe('Filter: angular-ui-scheduler.schZeroPadFilter', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var filter;

    //update the injection
    beforeEach(inject(function ($filter) {
        filter = $filter('schZeroPad');
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(filter(4, 5)).toBe('00004');
        expect(filter(0, 2)).toBe('00');
        expect(filter(1, 2)).toBe('01');
        expect(filter(10, 2)).toBe('10');
    });
});
