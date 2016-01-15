describe('Filter: angular-ui-scheduler.schDateStrFixFilter', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var filter;

    //update the injection
    beforeEach(inject(function ($filter) {
        filter = $filter('schDateStrFix');
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(filter('filterInput')).toBe('filterInput');
    });
});
