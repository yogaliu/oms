/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("adjustBillDetailService", ["ApiService", function (ApiService) {


        /**
         * 查询调整单明细
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipStockAdjustOrderDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StockAdjustOrderId",
                "Name": "StockAdjustOrderId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                //判断调整差异（计划调整数量与实际调整数量不符且为已审核时）
                $.each(res.data, function (i, obj) {
                    if(obj.adjustqty!=obj.actualqty && __scope__.params.tableList.status==3){
                        obj.adjustdifferent=true;
                    }else{
                        obj.adjustdifferent=false;
                    }
                });

                __scope__.tableList1 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList1 = [
                        {name: "明细状态", tag: 'detailstatus'},
                        {name: "调整差异", tag: 'adjustdifferent'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skuname'},
                        {name: "唯品规格编码", tag: 'vipskucode'},
                        {name: "供货价（含税）", tag: 'supplyprice'},
                        {name: "计划调整数量", tag: 'adjustqty'},
                        {name: "实际调整数量", tag: 'actualqty'},
                        {name: "上传错误信息", tag: 'message'}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询操作日志
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderLogGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipStockAdjustOrderLog/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StockAdjustOrderId",
                "Name": "StockAdjustOrderId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList2 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList2 = [
                        {name: "操作人", tag: 'operateuser'},
                        {name: "操作日期", tag: 'createdate'},
                        {name: "日志信息", tag: 'remark'}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "VipStockAdjustOrderDetailGet": VipStockAdjustOrderDetailGet,
            "VipStockAdjustOrderLogGet": VipStockAdjustOrderLogGet
        };

    }]);