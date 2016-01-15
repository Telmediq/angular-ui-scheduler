describe('Service: angular-ui-scheduler.CreateObjectFactory', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (_CreateObject_) {
        service = _CreateObject_;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
