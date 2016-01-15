/**
 * @ngdoc service
 * @name angular-ui-scheduler:schDateStrFixFilter
 *
 * @description

 * $filter('schDateStrFix')(s)  where s is a date string in ISO format: yyyy-mm-ddTHH:MM:SS.sssZ. Returns string in format: mm/dd/yyyy HH:MM:SS UTC
 * */
angular.module('angular-ui-scheduler')
    .filter('schDateStrFix', function () {
        return function (dateStr) {
            return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*Z/, function (match, yy, mm, dd, hh, mi, ss) {
                return mm + '/' + dd + '/' + yy + ' ' + hh + ':' + mi + ':' + ss + ' UTC';
            });
        };
    });

