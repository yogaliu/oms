/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("presellPlanDetailService", ["ApiService", "APP_COLORS","APP_MENU", function (ApiService, APP_COLORS,APP_MENU ) {

        /**
         * 查询预售店铺名称
         * @__scope__
         * @constructor
         */
        var PreSellPlanStoreGet = function (__scope__, isInit) {
            var url = "/Product/PreSellPlanStore/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": __scope__.params.PreSellPlanId,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList1 = res.data;

                //列表配置
                __scope__.theadList1 = [
                    {name: "店铺名称", tag: 'storename'},
                    {name: "上传比例", tag: 'rate'}
                ];
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询预售商品明细
         * @__scope__
         * @constructor
         */
        var PreSellPlanDetailGet = function (__scope__, isInit) {
            var url = "/Product/PreSellPlanDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": __scope__.params.PreSellPlanId,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList2 = res.data;

                $.each(__scope__.tableList2, function (i, obj) {
                        obj.cansalesqty = obj.presellquantity - obj.salesqty;
                    }
                );
                //列表配置
                __scope__.theadList2 = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "预售数量", tag: 'presellquantity'},
                    {name: "在途数量", tag: 'onthewayquantity'},
                    {name: "销售数量", tag: 'salesqty'},
                    {name: "剩余数量", tag: 'cansalesqty'},
                    {name: "颜色备注", tag: 'colorstatus'}
                ];

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询所有店铺预售明细
         * @__scope__
         * @constructor
         */
        var PreSellPlanStoreDetailGet = function (__scope__, isInit) {
            var url = "/Product/PreSellPlanStoreDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": __scope__.params.PreSellPlanId,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList3 = res.data;

                $.each(__scope__.tableList3, function (i, obj) {
                    obj.statusName=APP_MENU.marketingPlanStatus[obj.status];
                });

                if (isInit) {
                    //列表配置
                    __scope__.theadList3 = [
                        {name: "店铺名称", tag: 'productname'},
                        {name: "预售状态", tag: 'statusName'},
                        {name: "颜色状态", tag: 'colorstatus'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "开始时间", tag: 'begindate'},
                        {name: "结束时间", tag: 'enddate'},
                        {name: "库存上传失败信息", tag: 'uploadresult'},
                        {name: "颜色修改失败信息", tag: 'updatecolorresult'}
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
        var PreSellPlanLogGet = function (__scope__, isInit) {
            var url = "/Product/PreSellPlanLog/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": __scope__.params.PreSellPlanId,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList4 = res.data;

                //总条数
                //__scope__.paginationConf.totalItems = res.total;

                if (isInit) {
                    //列表配置
                    __scope__.theadList4 = [
                        {name: "操作人", tag: 'createusername'},
                        {name: "操作日期", tag: 'createdate'},
                        {name: "日志信息", tag: 'message'}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "PreSellPlanStoreGet": PreSellPlanStoreGet,
            "PreSellPlanDetailGet": PreSellPlanDetailGet,
            "PreSellPlanLogGet": PreSellPlanLogGet,
            "PreSellPlanStoreDetailGet": PreSellPlanStoreDetailGet
        };

    }]);