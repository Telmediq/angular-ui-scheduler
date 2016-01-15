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
    });
});
