describe('Service: angular-ui-scheduler.SetDefaults', function () {

    // load the service's module
    beforeEach(module('angular-ui-scheduler'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (_SetDefaults_) {
        service = _SetDefaults_;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
