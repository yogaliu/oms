/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnGoodsBillDetailController", ["$scope", "$rootScope","returnGoodsBillDetailService", function ($scope, $rootScope,returnGoodsBillDetailService) {

        function init(){
            //接收参数
            $scope.params = $.extend(true,{},$rootScope.params);

            //查询信息
            returnGoodsBillDetailService.VipReturnOrderDetailGet($scope,true);
            //查询操作记录
            returnGoodsBillDetailService.VipReturnOrderLogGet($scope,true);

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
            var index = $('#returnGoodsBillDetail').closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/b2bVIP/returnGoodsBill.html';
            $scope.option[index].name = '唯品退货单';
        }

    }]);