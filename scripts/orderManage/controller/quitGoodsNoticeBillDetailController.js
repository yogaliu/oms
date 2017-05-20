/**
 * Created by jx on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("quitGoodsNoticeBillDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","quitGoodsNoticeBillDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,quitGoodsNoticeBillDetailService) {

            //获取配货通知单id
            var id = $rootScope.params.orderId;
            //页面初始化
            quitGoodsNoticeBillDetailService.quitGoodsNoticeBillDomOperate.domInit($scope,id);

            //dom操作
            $scope.domOperate = {
                //跳到退货通知单
                backTolist : function () {
                    $rootScope.params = {};
                    var index = $('#quitGoodsNoticeBillDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/quitGoodsNoticeBill.html';
                    $scope.option[index].name = '退货通知单';
                }
            };

        }
    ]);