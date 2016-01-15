/**
 * @ngdoc directive
 * @name angular-ui-scheduler:schTooltipDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('angular-ui-scheduler')
    .directive('schTooltip', function () {
        return {
            link: function (scope, element, attrs) {
                var placement = (attrs.placement) ? attrs.placement : 'top';
                $(element).tooltip({
                    html: true,
                    placement: placement,
                    title: attrs.afTooltip,
                    trigger: 'hover',
                    container: 'body'
                });
            }
        };
    });
