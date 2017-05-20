/**
 * Created by yoga on 2017/5/12.
 */
angular.module("klwkOmsApp")
    .service("fbpNoticeBillDetailService", ["ApiService", function (ApiService) {
        var configData = {
            columns: [
                {name: "商品编码", tag: "productcode"},
                {name: "商品名称", tag: "productname"},
                {name: "规格编码", tag: "productskuid"},
                {name: "规则名称", tag: "productskuname"},
                {name: "通知数量", tag: "noticeqty"},
                {name: "入库数量", tag: "inqty"},
                {name: "单价", tag: "price"},
                {name: "金额", tag: "amount"},
                {name: "仓库入库时间", tag: "createdate"},
            ],
            //日志头信息
            logColumns: [
                {name: "操作人", tag: "createuser"},
                {name: "操作日期", tag: "createdate"},
                //{name: "操作类型", tag: "createdate"},
                {name: "备注", tag: "remark"},
            ]
        };
        //获取通知单详情信息
        var Interface = {
            getPlanList: function (scope, callback) {
                var url = '/B2B/B2BAllocationOutDetail/Query';
                var paramObj = ApiService.getBasicParamobj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "OutCode",
                        "Name": "OutCode",
                        "Value": scope.OutCode,
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
                var url = '/B2B/B2BAllocationOutLog/Query';
                var paramObj = ApiService.getBasicParamobj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "OutCode",
                        "Name": "OutCode",
                        "Value": scope.OutCode,
                        "Children": []
                    }]

                );
                var orderlist = ApiService.postLoad(url, paramObj);
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
                    //进行一些操作
                    //scope.noticeNums = 0;
                    //scope.outNums = 0;
                    //scope.inNums = 0;
                    //scope.allPrices = 0;
                    //对数量 价格信息进行计算
                    //$.each(res.data, function (i, v) {
                    //    scope.noticeNums += v['planqty'] - 0;
                    //    scope.outNums += v['outqty'] - 0;
                    //    scope.inNums += v['inqty'] - 0;
                    //    scope.allPrices += v['price'] - 0;
                    //})
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
