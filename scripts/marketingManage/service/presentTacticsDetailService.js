/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("presentTacticsDetailService", ["ApiService", function (ApiService) {
        /**
         * 查询所有店铺
         * @__scope__
         * @constructor
         */
        var StoreGet = function (__scope__) {
            var url = "/BasicInformation/Store/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {

                __scope__.allStore=klwTool.arrayToJson(res.data,'id');

                //查询店铺记录
                ActivityStrategyStoreGet(__scope__);

            }, function (res) {

            });
        };

        /**
         * 查询店铺记录
         * @__scope__
         * @constructor
         */
        var ActivityStrategyStoreGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyStore/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.params.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                __scope__.tableList = res.data;

                //将id匹配店铺的name
                $.each(__scope__.tableList, function (i, obj) {
                    obj.storename=__scope__.allStore[obj.storeid].name;
                })

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询活动商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategyProductGet = function (__scope__,isInit) {
            var url = "/ActivityStrategy/ActivityStrategyProduct/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.params.id,
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
                        {name: "套装", tag: 'iscombproduct'},
                        {name: "购买数量", tag: 'quantity'}
                    ];

                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询赠送商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategySendProductGet = function (__scope__,isInit) {
            var url = "/ActivityStrategy/ActivityStrategySendProduct/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.params.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {


                __scope__.tableList2 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList2 = [
                        {name: "序号", tag: 'seq'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skudescription'},
                        {name: "赠送数量", tag: 'quantity'},
                        {name: "计划送数量", tag: 'plansendqty'},
                        //{name: "预警数量", tag: 'quantity'},
                        {name: "已赠送数量", tag: 'alreadysendqty'}
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
        var SystemLogGetById = function (__scope__,isInit) {
            var url = "/BasicInformation/SystemLog/GetById";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify(__scope__.params.id);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList3 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList3 = [
                        {name: "操作人", tag: 'username'},
                        {name: "操作日期", tag: 'createdate'},
                        {name: "日志信息", tag: 'note'}
                    ];

                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "ActivityStrategyStoreGet": ActivityStrategyStoreGet,
            "ActivityStrategyProductGet": ActivityStrategyProductGet,
            "ActivityStrategySendProductGet": ActivityStrategySendProductGet,
            "SystemLogGetById": SystemLogGetById
        };

    }]);