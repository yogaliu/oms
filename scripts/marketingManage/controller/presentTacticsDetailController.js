/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("presentTacticsDetailController", ["$scope", "$rootScope", "presentTacticsDetailService",
        function ($scope, $rootScope, presentTacticsDetailService) {
            function init() {
                //接收列表页的参数
                $scope.params= $.extend(true,{},$rootScope.params);

                //查询所有店铺
                presentTacticsDetailService.StoreGet($scope);

                //查询活动商品
                presentTacticsDetailService.ActivityStrategyProductGet($scope,true);
                //查询赠送商品
                presentTacticsDetailService.ActivityStrategySendProductGet($scope,true);
                //查询操作日志
                presentTacticsDetailService.SystemLogGetById($scope,true);

                //tab栏切换，默认为first页面
                $scope.tab = 'first';

                //tab栏切换函数
                $scope.isShow = function (content) {
                    $scope.tab = content;
                };

                $scope.isBagObj={
                    content:'赠品商品',
                    isBagShow:true
                };

                //福袋类型
                if($scope.params.type==3){
                    $scope.isBagObj={
                        content:'福袋商品',
                        isBagShow:false
                    }
                }

                //返回
                $scope.returnFun= function () {
                    var index = $('#presentTacticsDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/presentTactics.html';
                    $scope.option[index].name = '赠品策略';
                }
            }

            init();




        }]);