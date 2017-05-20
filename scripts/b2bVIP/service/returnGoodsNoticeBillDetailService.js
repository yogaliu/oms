/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("returnGoodsNoticeBillDetailService", ["ApiService", function (ApiService) {


        /**
         * 查询退货通知单明细
         * @__scope__
         * @constructor
         */
        var VipReturnOrderNoticeDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipReturnOrderNoticeDetail/Get";

            var paramObj = ApiService.getBasicParamobj();


            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ReturnOrderNoticeId",
                "Name": "ReturnOrderNoticeId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList1 = [
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skuname'},
                        {name: "唯品规格编码", tag: 'vipskucode'},
                        {name: "通知数量", tag: 'noticeqty'},
                        {name: "入库数量", tag: 'inqty'},
                        {name: "仓库入库时间", tag: ''}
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
        var VipReturnOrderNoticeLogGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipReturnOrderNoticeLog/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ReturnOrderNoticeId",
                "Name": "ReturnOrderNoticeId",
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
            "VipReturnOrderNoticeDetailGet": VipReturnOrderNoticeDetailGet,
            "VipReturnOrderNoticeLogGet": VipReturnOrderNoticeLogGet
        };

    }]);