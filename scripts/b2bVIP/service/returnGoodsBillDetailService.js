/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("returnGoodsBillDetailService", ["ApiService", function (ApiService) {


        /**
         * 查询退货单明细
         * @__scope__
         * @constructor
         */
        var VipReturnOrderDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipReturnOrderDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ReturnOrderId",
                "Name": "ReturnOrderId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                $.each(res.data, function (i, obj) {
                    obj.differentqty=Math.abs(obj.returnqty-obj.inqty);
                });
                __scope__.tableList1 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList1 = [
                        {name: "PO单号", tag: 'pocode'},
                        {name: "箱码", tag: 'boxno'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skuname'},
                        {name: "唯品规格编码", tag: 'vipskucode'},
                        {name: "退货数量", tag: 'returnqty'},
                        {name: "签收数量", tag: 'inqty'},
                        {name: "差异数量", tag: 'differentqty'}
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
        var VipReturnOrderLogGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipReturnOrderLog/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ReturnOrderId",
                "Name": "ReturnOrderId",
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
            "VipReturnOrderDetailGet": VipReturnOrderDetailGet,
            "VipReturnOrderLogGet": VipReturnOrderLogGet
        };

    }]);