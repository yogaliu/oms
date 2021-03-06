/**
 * Created by yoga on 2017/5/19.
 */
angular.module("klwkOmsApp")
    .service("fbpQuitGoodsBillDetailService", ["ApiService", function (ApiService) {
        var configData = {
            columns: [
                {name: "商品编码", tag: "productcode"},
                {name: "商品名称", tag: "productname"},
                {name: "规格编码", tag: "skucode"},
                {name: "规则名称", tag: "skuname"},
                {name: "退货数量", tag: "returnqty"},
                {name: "签收数量", tag: ""},
                {name: "差异数量", tag: ""},
                {name: "单价", tag: "price"},
                {name: "金额", tag: "amount"},
            ],
            //日志头信息
            logColumns: [
                {name: "操作人", tag: "operateuser"},
                {name: "操作日期", tag: "createdate"},
                {name: "备注", tag: "remark"},
            ]
        };
        //获取通知单详情信息
        var Interface = {
            getPlanList: function (scope, callback) {
                var url = '/B2B/B2BReturnOrderDetail/Get';
                var paramObj = ApiService.getBasicParamobj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ReturnOrderId",
                        "Name": "ReturnOrderId",
                        "Value": scope.returnorderid,
                        "Children": []
                    }]
                );
                var orderlist = ApiService.post(url, paramObj);
                orderlist.then(function (res) {
                    callback(res);
                }, function (mes) {
                    console.log(mes)
                });
            },
            getLogList: function (scope, callback) {
                var url = '/B2B/B2BReturnOrderLog/Get';
                var paramObj = ApiService.getBasicParamobj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ReturnOrderId",
                        "Name": "ReturnOrderId",
                        "Value": scope.returnorderid,
                        "Children": []
                    }]

                );
                var orderlist = ApiService.post(url, paramObj);
                orderlist.then(function (res) {
                    callback(res);
                }, function (mes) {
                    console.log(mes)
                });
            }
        };

        //调用接口
        var ListInterface = {
            getPlanList: function (scope) {
                Interface.getPlanList(scope, function (res) {
                    //表体信息
                    scope.planListTbody = res.data;
                })
            },
            getLogList: function (scope) {
                Interface.getLogList(scope, function (res) {
                    //表体信息
                    scope.logListTbody = res.data;
                    //进行一些操作
                })
            },
        }
        return {
            configData: configData,
            ListInterface: ListInterface
        }
    }]
)
