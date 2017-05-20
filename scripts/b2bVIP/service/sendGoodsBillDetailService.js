/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("sendGoodsBillDetailService", ["ApiService", function (ApiService) {


        /**
         * 查询送货单明细
         * @__scope__
         * @constructor
         */
        var VipDeliveryOrderDetailQuery = function (__scope__, isInit) {
            var url = "/VipOrder/VipDeliveryOrderDetail/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DeliveryOrderId",
                "Name": "DeliveryOrderId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                $.each(__scope__.tableList1, function (i,obj) {
                    obj.waybillnumber=__scope__.params.tableList.waybillnumber;
                });

                if (isInit) {
                    //列表配置
                    __scope__.theadList1 = [
                        {name: "PO单号", tag: 'pocode'},
                        {name: "运单号", tag: 'waybillnumber'},
                        {name: "配货单号", tag: 'dispatchordercode'},
                        {name: "拣货单号", tag: 'pickingcode'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skuname'},
                        {name: "唯品规格编码", tag: 'vipskucode'},
                        {name: "出库箱码", tag: 'boxcode'},
                        {name: "通知数量", tag: 'noticeqty'},
                        {name: "出库数量", tag: 'outqty'}
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
        var VipDeliveryOrderLogQuery = function (__scope__, isInit) {
            var url = "/VipOrder/VipDeliveryOrderLog/Query ";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DeliveryOrderId",
                "Name": "DeliveryOrderId",
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
            "VipDeliveryOrderDetailQuery": VipDeliveryOrderDetailQuery,
            "VipDeliveryOrderLogQuery": VipDeliveryOrderLogQuery
        };

    }]);