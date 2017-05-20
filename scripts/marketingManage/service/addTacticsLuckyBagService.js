/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addTacticsLuckyBagService", ["ApiService", function (ApiService) {

        /**
         * 查询店铺
         * @param __scope__
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
                __scope__.storeList = res.data;
                __scope__.allStore =klwTool.arrayToJson(res.data,'id');

                ActivityStrategyStoreGet(__scope__);
            }, function (res) {

            });
        };


        /**
         * 导入福袋商品成功，获取到福袋商品
         */
        var ProductSkuQueryProductSku = function (__scope__) {
            var url = " /Product/ProductSku/QueryProductSku";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 6,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "sku.Code",
                "Name": "skucode",
                "Value": "2260243485160,12",
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "sku.Status",
                "Name": "skustatus",
                "Value": 1,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {

            }, function (res) {

            });
        };


        /**
         * 修改时获取新增时填写的内容
         * @param __scope__
         * @constructor
         */
        var ActivityStrategyConditionGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyCondition/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.data) {
                    __scope__.modify.condition = $.extend(true, {}, res.data[0]);
                }
            }, function (res) {

            });
        };

        /**
         * 获取活动店铺
         * @param __scope__
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
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    __scope__.modify.stores = res.data;
                    __scope__.storeName = [];
                    $.each(res.data, function (index, obj) {
                        __scope__.storeName += __scope__.allStore[obj.storeid].name + ';';
                    });
                    if(__scope__.storeName.length<=0){
                        __scope__.storeName = '请选择活动店铺';
                    }
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询是否有福袋
         * @__scope__
         * @constructor
         */
        var ActivityStrategySendProductGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategySendProduct/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    var data = res.data;
                    __scope__.modify.sendProducts = data;
                    __scope__.tableList1 = data;

                    if( __scope__.tableList1.length>0){
                        __scope__.bagBtn = false;
                    }

                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 新增页面保存按钮  修改保存
         * @param __scope__
         * @constructor
         */
        var ActivityStrategySave = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategy/Save";


            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "BeginDate": __scope__.modify.tableList.begindate,
                "Id": __scope__.modify.tableList.id,
                //记录日期
                "CreateDate": __scope__.modify.tableList.createdate,
                "Name": __scope__.modify.tableList.name,
                "Code": __scope__.modify.tableList.code,
                //策略类型　1: 买就送 2: 满就送 3: 福袋
                "ActivityStrategyType": 3,
                "EndDate": __scope__.modify.tableList.enddate,
                //是否叠加
                "IsSuperposition": false,
                //排序
                "Seq":-1,
                "Note": __scope__.modify.tableList.note,
                "CreateUser": __scope__.modify.tableList.createuser,
                "Status": 0,
                "Stores": __scope__.modify.stores,
                "Products": [],
                "SendProducts": __scope__.modify.sendProducts,
                "Condition": {
                    "Id": __scope__.modify.condition.id,
                    "CreateDate": __scope__.modify.condition.createdate,
                    "StrategyId": __scope__.modify.condition.strategyid,
                    "IsDoubleSend": __scope__.modify.condition.isdoublesend,
                    "OrderFrom": __scope__.modify.condition.orderfrom,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },
                //活动范围 0: 所有款, 1: 包含活动商品 2: 排除活动商品
                "ActivityProductRange": 0,
                //赠送类型 0: 仅送赠品, 1: 仅指定快递, 2: 指定赠品+快递
                "ActivitySendType": 0,
                //赠送款数
                "SendProductQty": __scope__.modify.tableList.sendproductqty,
                //匹配时间类型 1: 付款时间, 2: 平台制单时间
                "DateType": __scope__.modify.tableList.datetype,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.returnFun();
                } else {

                }
            }, function (res) {

            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "ProductSkuQueryProductSku": ProductSkuQueryProductSku,
            "ActivityStrategyConditionGet": ActivityStrategyConditionGet,
            "ActivityStrategyStoreGet": ActivityStrategyStoreGet,
            "ActivityStrategySendProductGet": ActivityStrategySendProductGet,
            "ActivityStrategySave": ActivityStrategySave
        };

    }]);