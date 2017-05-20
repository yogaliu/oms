/**
 *
 * */
angular.module("klwkOmsApp")
    .controller("createRefundBillController", ["$scope","$rootScope" ,"createRefundBillService",
        function($scope,$rootScope,createRefundBillService) {

            //订单id
            $scope.orderid = $rootScope.params.orderid;
            //从哪个页面来的来源信息
            $scope.sourceHtml = $rootScope.params.from;

            //dom数据初始化
            createRefundBillService.refundDomOperate.domInit($scope);

            $scope.domOperate = {
                //取消生成退款单
                cancleCreate : function (title,url){
                    $rootScope.params = {
                        order : $scope.order
                    };
                    var index = $('#creatRefund').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //保存生成的数据
                save : function (title,url){
                    createRefundBillService.InterfaceDeal.createReturnGoodsBillDeal($scope, function () {
                        $rootScope.params = {
                            order : $scope.order
                        };
                        var index = $('#creatRefund').closest('[data-index]').attr('data-index');
                        $scope.option[index].url = '../template/orderManage/'+$scope.sourceHtml.url;
                        $scope.option[index].name = $scope.sourceHtml.title;
                    });
                }
            };

        }
    ]);
