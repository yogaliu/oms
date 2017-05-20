/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("quitExchangeGoodsBillDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","quitExchangeGoodsBillDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,quitExchangeGoodsBillDetailService) {

            //要获取详情的退款单号
            var id = $rootScope.params.orderId;
            //订单主Id
            var salesorderid = $rootScope.params.salesorderid;
            //退款单号
            $scope.code = $rootScope.params.code;
            //退入仓库
            $scope.wareHouse = $rootScope.params.InWareHouse;
            //页面初始化
            quitExchangeGoodsBillDetailService.quitExchangeGoodsDetailsDomOperate.domInit($scope,id,salesorderid);
            //dom操作
            $scope.domOperate = {
                //添加标签
                addLabel : function () {
                    $scope.content = '';
                    //模态框确定按钮事件
                    $scope.modal.confirm = function () {
                        quitExchangeGoodsBillDetailService.InterfaceDeal.addLabelDeal($scope,$scope.content,id,salesorderid);
                    };
                    $('.info-get-modal').modal('show');
                },
                //修改标签
                changeLabel : function (list) {
                    //模态框确定按钮事件
                    $scope.content = list.messagestring;
                    $scope.modal.confirm = function () {
                        quitExchangeGoodsBillDetailService.InterfaceDeal.modifyLabelDeal($scope,list.id,$scope.content,id,salesorderid);
                    };
                    $('.info-get-modal').modal('show');
                },
                //返回到列表页
                backTolist : function () {
                    $rootScope.params = {};
                    var index = $('#quitExchangeGoodsBillDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/quitExchangeGoodsBill.html';
                    $scope.option[index].name = '退换货单';
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                }
            };

        }]
);