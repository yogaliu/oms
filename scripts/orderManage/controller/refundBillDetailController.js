/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("refundBillDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","refundBillDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,refundBillDetailService) {

            //要获取详情的退款单号
            var id = $rootScope.params.orderId;
            //订单主Id
            var salesorderid = $rootScope.params.salesorderid;
            //退款单号
            $scope.code = $rootScope.params.code;
            //页面初始化
            refundBillDetailService.refoundBillDetailsDomOperate.domInit($scope,id,salesorderid);

            //dom操作
            $scope.domOperate = {
                //添加标签
                addLabel : function () {
                    //模态框确定按钮事件
                    $scope.modal.confirm = function () {
                        refundBillDetailService.refundBillInterfaceDeal.addLabelDeal($scope,$scope.content,id,salesorderid);
                    };
                    $('.info-get-modal').modal('show');
                },
                //修改标签
                changeLabel : function (list) {
                    //模态框确定按钮事件
                    $scope.content = list.messagestring;
                    $scope.modal.confirm = function () {
                        refundBillDetailService.refundBillInterfaceDeal.modifyLabelDeal($scope,list.id,$scope.content,id,salesorderid);
                    };
                    $('.info-get-modal').modal('show');
                },
                //返回到退款单列表页面
                backTolist : function () {
                    $rootScope.params = {};
                    var index = $('#refundBillDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/refundBill.html';
                    $scope.option[index].name = '退款单';
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                },
                //tab切换
                isShow : function (content) {
                    $scope.tab = content;
                }
            };

        }]
);