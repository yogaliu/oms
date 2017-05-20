/**
 * Created by zgh on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("allocationNoticeBillDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","allocationNoticeBillDetailService","toolsService",
        function($scope,$rootScope, $state, WAP_CONFIG,allocationNoticeBillDetailService,toolsService) {

            //获取订单id
            var id = $rootScope.params.orderId;
            allocationNoticeBillDetailService.noticeBillDetailsDomOperate.domInit($scope,id);
            
            $scope.domOperate = {
                //取消明细
                cancleDetails : function (list) {
                    //只有待发货的才可以取消明细
                    if(list.status != 0){
                        toolsService.alertMsg('只有待发货的才可以取消明细');
                        return false;
                    }else{
                        //配置填写取消原因的模态框
                        $scope.modal = {
                            title : '请输入取消原因',
                            confirm : function (content) {
                                allocationNoticeBillDetailService.interfaceDeal.cancleAllocationNoticeDetails($scope,list.id,list.dispatchorderid,content);
                                $('.info-get-modal').modal('hide');
                                $scope.content = '';
                            }
                        };
                        $('.info-get-modal').modal('show');
                    }
                },
                //返回到列表
                returnBack : function () {
                    $rootScope.params = {};
                    var index = $('#allocationNoticeBillDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/allocationNoticeBill.html';
                    $scope.option[index].name = '配货通知单';
                },
                //模态框消失
                modalDismiss : function () {
                    $('.modal').modal('hide');
                }
            };

        }]
);