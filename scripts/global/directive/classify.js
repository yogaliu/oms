/**
 * Created by cj on 2017/4/7.
 */
angular.module("klwkOmsApp").directive('classify', function ($compile) {
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
                '<span class="classify-text" ng-click="toggleExpand($event,expander)">' +
                '<i class="iconfont icon-icon_zhkairenwu_default" ng-if="children"></i>{{expander.name}}' +
                '</span>'+
                '<div class="classify-btn">' +
                '<span class="new" ng-click="showModal(expander,\'classifyModal\',\'classify\',\'new\')">新增</span>' +
                ' <span class="edit" ng-click="showModal(expander,\'classifyModal\',\'classify\',\'edit\')">修改</span>' +
                ' </div>' +
                ' </div>' +
                ' </div>',

        link: function ($scope, elm) {
            if ($scope.expander.children) {
                var html = $compile("<classify show-modal='showModal' toggle-expand='toggleExpand' expander='expander' children='expander.children' ng-repeat='expander in expander.children'></classify>")($scope);
                elm.append(html);
            }
            $('.classify > .classify').addClass('hide');
        }
    };
});