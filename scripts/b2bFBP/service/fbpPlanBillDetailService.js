/**
 * Created by yoga on 2017/5/12.
 */
angular.module("klwkOmsApp")
    .service("fbpPlanBillDetailService", ["ApiService", function (ApiService) {
        configData = {
            getParamObj: function () {
                return {
                    'TimeStamp': '2017-05-10 11:54:40',
                    'Sign': '282DAE8EF665158EAB38799BA4B09ADD',
                    'Version': '2.5.1.9',
                    'SessionId': '',
                    'UserId': '8d4082c4-b85c-4696-b238-f0239bd20dbf',
                    'UserName': 'liushudong',
                    'Token': '',
                    'CompanyId': '',
                    'LoginKey': '278411d0-c38e-4a11-b8fd-cff31bd3d95c'
                }
            },
            columns: [
                {name: "商品编码", tag: "productcode"},
                {name: "商品名称", tag: "productname"},
                {name: "规格编码", tag: "productskucode"},
                {name: "规则名称", tag: "productskuname"},
                {name: "通知数量", tag: "planqty"},
                {name: "锁定数量", tag: "lockedqty"},
                {name: "出库数量", tag: "outqty"},
                {name: "入库数量", tag: "inqty"},
                {name: "单价", tag: "price"},
                {name: "金额", tag: "price"},
                {name: "仓库出库时间", tag: "audituser"},
            ]
            ,
            //日志头信息
            logColumns: [
                {name: "操作人", tag: "createuser"},
                {name: "操作日期", tag: "createdate"},
                {name: "备注", tag: "remark"},
            ]
        };
        //获取通知单详情信息
        var Interface = {
            getPlanList: function (scope, callback) {
                var url = '/B2B/B2BAllocationPlanDetail/Query';
                var paramObj = configData.getParamObj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "PlanCode",
                        "Name": "PlanCode",
                        "Value": scope.plancode,
                        "Children": []
                    }]
                );
                var orderlist = ApiService.postLoad(url, paramObj);
                orderlist.then(function (res) {
                    callback(res);
                }, function (mes) {
                    console.log(mes)
                });
            },
            getLogList: function (scope, callback) {
                var url = '/B2B/B2BAllocationPlanLog/Get';
                var paramObj = configData.getParamObj();
                paramObj['body'] = JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "PlanCode",
                        "Name": "PlanCode",
                        "Value": scope.plancode,
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
                    scope.checkAll = false;
                    //表体信息
                    scope.planListTbody = res.data;
                    //进行一些操作
                    scope.noticeNums = 0;
                    scope.outNums = 0;
                    scope.inNums = 0;
                    scope.allPrices = 0;
                    //对数量 价格信息进行计算
                    $.each(res.data, function (i, v) {

                        scope.noticeNums += v['planqty'] - 0;
                        scope.outNums += v['outqty'] - 0;
                        scope.inNums += v['inqty'] - 0;
                        scope.allPrices += v['price'] - 0;
                    })
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