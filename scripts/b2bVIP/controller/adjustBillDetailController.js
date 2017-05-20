/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("adjustBillDetailController", ["$scope", "$rootScope", "adjustBillDetailService",function ($scope, $rootScope,adjustBillDetailService) {

        function init(){
            //接收参数
            $scope.params = $.extend(true,{},$rootScope.params);

            //查询活动商品信息
            adjustBillDetailService.VipStockAdjustOrderDetailGet($scope,true);
            //查询操作记录
            adjustBillDetailService.VipStockAdjustOrderLogGet($scope,true);

            //tab栏切换，默认为first页面
            $scope.tab = 'first';
        }
        init();

        //tab栏切换函数
        $scope.isShow= function (content) {
            $scope.tab = content;
        };

        //返回
        $scope.returnFun= function () {
            var index = $('#adjustBillDetail').closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/b2bVIP/adjustBill.html';
            $scope.option[index].name = '唯品调整单';
        }

    }]);