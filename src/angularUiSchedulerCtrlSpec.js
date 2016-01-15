describe('Controller: angular-ui-scheduler.angularUiSchedulerCtrl', function () {

    // load the controller's module
    beforeEach(module('angular-ui-scheduler'));

    var ctrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('angularUiSchedulerCtrl', {
            $scope: scope
        });
    }));

    it('should be defined', function () {
        expect(ctrl).toBeDefined();
    });
});
