/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("sendGoodsBillDetailController", ["$scope", "$rootScope","sendGoodsBillDetailService", function ($scope, $rootScope,sendGoodsBillDetailService) {

        function init(){
            //接收列表页的参数
            $scope.params= $.extend(true,{},$rootScope.params);

            //查询信息
            sendGoodsBillDetailService.VipDeliveryOrderDetailQuery($scope,true);
            //查询操作记录
            sendGoodsBillDetailService.VipDeliveryOrderLogQuery($scope,true);

            //tab栏切换，默认为first页面
            $scope.tab = 'first';

            //tab栏切换函数
            $scope.isShow= function (content) {
                $scope.tab = content;
            };

            //返回
            $scope.returnFun= function () {
                var index = $('#sendGoodsBillDetail').closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/b2bVIP/sendGoodsBill.html';
                $scope.option[index].name = '唯品送货单';
            }
        }
        init();



    }]);