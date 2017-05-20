/**
 * Created by zgh on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("sendOrderAbnormalDetailController", ["$scope","$rootScope","sendOrderAbnormalDetailService"
        ,function($scope,$rootScope,sendOrderAbnormalDetailService) {

            // 订单id
            var orderid = $rootScope.params.orderid;

            sendOrderAbnormalDetailService.domOperate.domInit($scope,orderid);

            //dom操作
            $scope.domOperate = {
                //返回到发货异常订单
                returnTolist : function () {
                    $rootScope.params = {};
                    var index = $('#sendOrderAbnormalDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/sendOrderAbnormal.html';
                    $scope.option[index].name = '发货异常订单';
                }
            };
        }
    ]);