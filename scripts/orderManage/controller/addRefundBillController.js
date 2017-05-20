/**
 * Created by zgh on 2017/5/9.
 */
angular.module("klwkOmsApp")
    .controller("addRefundBillController", ["$scope","$rootScope","addRefundBillService","validateService"
        ,function($scope,$rootScope,addRefundBillService,validateService) {

            //退款单id(修改退款单或生成退款单)
            if($rootScope.params.refundId !== undefined){
                $scope.orderid = $rootScope.params.orderid;
                $scope.refundId = $rootScope.params.refundId;
            }

            //页面来源信息
            $scope.from = $rootScope.params.from;

            //页面初始化
            addRefundBillService.refundDomOperate.domInit($scope);

            //dom操作
            $scope.domOperate = {
                //点击订单号，显示订单列表信息
                orderDetailsShow : function () {
                    addRefundBillService.InterfaceDeal.getOrderList($scope, function () {
                        //模态框显示
                        $('.order-list-chose').modal('show');
                    });
                },
                //确认搜索订单信息
                searchConfirm : function () {
                    addRefundBillService.InterfaceDeal.getOrderList($scope, function () {});
                },
                //订单列表搜索条件取消
                searchCancle : function (){
                    $scope.formData = [];
                    addRefundBillService.InterfaceDeal.getOrderList($scope, function () {});
                },
                //选中一条订单信息
                orderChose : function (list) {
                    $('.order-list-chose').modal('hide');
                    addRefundBillService.InterfaceDeal.getOrderDetails($scope,list.orderid);
                },
                //保存新增退款单数据
                saveOptions : function () {
                    //检测必填项是否填完
                    if(!validateService.validateAll('#addRefundBill','.jxOutDivContent')) return false;
                    var obj = $scope.orderDetails.details;
                    var details = [];
                    var data = {};
                    for(var i = 0,j = obj.length;i < j;i++){
                        details.push({
                            "Id": 0,
                            "RefundOrderId": 0,
                            "ProductId": obj[i]['productid'],
                            "ProductCode": obj[i]['productcode'],
                            "ProductName": obj[i]['productname'],
                            "SkuId": obj[i]['productskuid'],
                            "SkuCode": obj[i]['skucode'],
                            "SkuName": obj[i]['skuname'],
                            "Quantity": obj[i]['quantity'],
                            "ActualAmount": obj[i]['amountactual'],
                            "OffsetAmount": obj[i]['discountamount'],
                            "ShouldAmount": obj[i]['distributionamount'],
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    data = {
                        "SalesOrderCode": $scope.orderChosed.code,
                        "Id": $scope.refundId ? $scope.refundId : 0,
                        "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                        "IsLocked": false,
                        "ActualAmount": $scope.orderChosed.ActualAmount,
                        "OffsetAmount": 0,
                        "CustomerCode": $scope.orderChosed.customercode,
                        "CustomerName": $scope.orderChosed.customername,
                        "StoreId": $scope.orderChosed.storeid,
                        "StoreName": $scope.orderChosed.storename,
                        "Status": 0,
                        "RefundWay": $scope.orderChosed.RefundWay,
                        "SalesOrderId": $scope.orderChosed.orderid,
                        "TradeId": $scope.orderChosed.tradeid,
                        "ReturnType": $scope.orderChosed.returntype,
                        "RefundType": $scope.orderChosed.refundtype,
                        "Mobile": $scope.orderChosed.subOrder.mobile,
                        "Consignee": $scope.orderChosed.subOrder.consignee,
                        "IsCod": false,
                        "IsQuickRefund": false,
                        "IsRefund": false,
                        "Note": $scope.orderChosed.note,
                        "Details": details,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //确定添加退款单数据
                    addRefundBillService.InterfaceDeal.addRefundBill($scope,data, function () {
                        $rootScope.params = {};
                        var index = $('#addRefundBill').closest('[data-index]').attr('data-index');
                        $scope.option[index].url = '../template/orderManage/refundBill.html';
                        $scope.option[index].name = '退款单';
                    });
                },
                //取消新增退款单数据
                clearOptions : function () {
                    $rootScope.params = {
                        orderid : $scope.orderid
                };
                    var index = $('#addRefundBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/'+$scope.from.url;
                    $scope.option[index].name = $scope.from.title;
                },
                //返回到退款单列表页
                backTolist : function () {
                    $rootScope.params = {
                        orderid : $scope.orderid
                    };
                    var index = $('#addRefundBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/'+$scope.from.url;
                    $scope.option[index].name = $scope.from.title;
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                }
            };

        }
    ]);
