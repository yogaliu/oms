/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp").directive('region', function ($compile) {
    return {
        restrict: 'EA',
        replace: true,

        scope: {
            toggleExpand:'=',
            showModal:'=',
            expander: '=',
            children: '='
        },

        template: '<div class="classify" data-id="{{expander.id}}"> ' +
        '<div class="classify-bg" ng-class="{true:\'noPadding\',false:\'\'}[!!children]">' +
        '<span class="classify-text" ng-click="toggleExpand($event)">' +
        '<i class="iconfont icon-icon_zhkairenwu_default" ng-if="children"></i>{{expander.name}}</span>' +
        '<div class="classify-btn">' +
        '<span class="new" ng-click="showModal(expander,\'creat\')">新增</span>' +
        '<span class="edit" ng-click="showModal(expander,\'edit\')">修改</span>' +
        '</div></div></div>',

        link: function ($scope, elm) {
            if ($scope.expander.children) {
                var html = $compile("<region show-modal='showModal' toggle-expand='toggleExpand' expander='expander' children='expander.children' ng-repeat='expander in expander.children'></region>")($scope);
                elm.append(html);
            }
            $('.classify > .classify').addClass('hide');
        }
    };
});