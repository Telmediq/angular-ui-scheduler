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
});
