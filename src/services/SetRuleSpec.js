describe('Service: angular-ui-scheduler.SetRule', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (_SetRule_) {
        service = _SetRule_;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
