/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnGoodsNoticeBillDetailController", ["$scope", "$rootScope","returnGoodsNoticeBillDetailService", function ($scope, $rootScope,returnGoodsNoticeBillDetailService) {
        function init(){
            //接收参数
            $scope.params = $.extend(true,{},$rootScope.params);

            //查询活动商品信息
            returnGoodsNoticeBillDetailService.VipReturnOrderNoticeDetailGet($scope,true);
            //查询操作记录
            returnGoodsNoticeBillDetailService.VipReturnOrderNoticeLogGet($scope,true);

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
            var index = $('#returnGoodsNoticeBillDetail').closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/b2bVIP/returnGoodsNoticeBill.html';
            $scope.option[index].name = '唯品退货通知单';
        }

    }]);