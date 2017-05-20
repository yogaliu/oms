/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnGoodsScanController", ["$scope", "$rootScope", function ($scope, $rootScope) {

        //进入页面需要执行的方法
        function init() {
            //接收列表页的参数
            $scope.params=$rootScope.params;
        }

        init();

        //保存
        $scope.submit= function () {
            $scope.returnFun();
        };
        //返回//取消
        $scope.returnFun= function () {
            var index = $('#returnGoodsScan').closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/b2bVIP/returnGoodsBill.html';
            $scope.option[index].name = '唯品退货单';
        }
    }]);