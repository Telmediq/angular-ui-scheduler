/**
 * @ngdoc service
 * @name angular-ui-scheduler:schZeroPadFilter
 *
 * @description
 * $filter('schZeroPad')(n, pad) -- or -- {{ n | afZeroPad:pad }}
 *
 * */
angular.module('angular-ui-scheduler')
    .filter('schZeroPad', function () {
        return function (n, pad) {
            var str = (Math.pow(10, pad) + '').replace(/^1/, '') + (n + '').trim();
            return str.substr(str.length - pad);
        };
    });