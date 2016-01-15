/**
 * @ngdoc service
 * @name angular-ui-scheduler:InRangeFactory
 *
 * @description
 *
 *
 * */
angular.module('angular-ui-scheduler')
    .factory('InRange', function () {
        return function (x, min, max, length) {
            var rx = new RegExp('\\d{1,' + length + '}');
            if (!rx.test(x)) {
                return false;
            }
            if (x < min || x > max) {
                return false;
            }
            return true;
        };
    });
