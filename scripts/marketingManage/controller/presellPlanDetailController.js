/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("presellPlanDetailController", ["$scope", "$rootScope","toolsService", "presellPlanDetailService","APP_MENU",
        function ($scope, $rootScope, toolsService,presellPlanDetailService,APP_MENU) {

            function init() {

                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                $scope.params.statusName=APP_MENU.marketingPlanStatus[$scope.params.status];

                // 查询数据
                presellPlanDetailService.PreSellPlanStoreGet($scope, 1, 10, 0, [], true);

                presellPlanDetailService.PreSellPlanDetailGet($scope, 1, 10, 0, [], true);

                presellPlanDetailService.PreSellPlanLogGet($scope, 1, 10, 0, [], true);

                presellPlanDetailService.PreSellPlanStoreDetailGet($scope, 1, 10, 0, [], true);

                //复选框默认不勾选
                $scope.labelSel = false;

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };

                //tab栏切换，默认为first页面
                $scope.tab = 'first';

                //tab栏切换函数
                $scope.isShow = function (content) {
                    $scope.tab = content;
                };

                //返回
                $scope.returnFun= function () {
                    var index = $('#presellPlanDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/presellPlan.html';
                    $scope.option[index].name = '预售计划';
                }
            }

            init();



        }]);