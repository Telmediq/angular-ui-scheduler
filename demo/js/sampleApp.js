angular.module('sampleApp', ['angular-ui-scheduler'])
    .constant('angular_ui_scheduler_useTimezone', false)
    .controller('ctrl', function ($scope) {
        $scope.rule = {asd:'asd'};

        $scope.hideStart = true;
    });
