/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addTacticsBuyService", ["ApiService","APP_MENU", function (ApiService,APP_MENU ) {


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
                __scope__.allStore = klwTool.arrayToJson(res.data, 'id');

                ActivityStrategyStoreGet(__scope__);

            }, function (res) {

            });
        };


        /**
         * 快递信息
         */
        var ExpressQuery = function (__scope__) {
            var url = "/BasicInformation/Express/Query";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": 1,
                "PageSize": 50,
                "SeletedCount": 0,
                "Data": [],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 快递信息
                __scope__.selectExpress.info = res.data;
                __scope__.selectExpress.setValue({id: __scope__.modify.tableList.expressid});

            }, function (res) {

            });
        };


        /**
         * 区域信息
         * @param __scope__
         * @constructor
         */

        var RegionQuery = function (__scope__) {
            var url = "/BasicInformation/Region/Query";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "RegionLevel",
                "Name": "RegionLevel",
                "Value": 2,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {

                __scope__.addressList = res.data;

            }, function (res) {

            });
        };


        /**
         * 新增活动商品/赠送商品
         * @param __scope__
         * @constructor
         */
        var ProductSkuQuery = function (__scope__, PageIndex, PageSize, isInit, content) {
            var url = "/Product/ProductSku/Query";

            var paramObj = ApiService.getBasicParamobj();
            var data = '';
            if (content == 'activity') {
                data = [
                    {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Description",
                        "Name": "prodes",
                        "Value": __scope__.messageForm.goodsName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Code",
                        "Name": "procode",
                        "Value": __scope__.messageForm.goodsNum,
                        "Children": []
                    }, {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Description",
                        "Name": "skudes",
                        "Value": __scope__.messageForm.skuName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Code",
                        "Name": "skucode",
                        "Value": __scope__.messageForm.skuNum,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Status",
                        "Name": "skustatus",
                        "Value": 1,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.IsCombined",
                        "Name": "IsCombined",
                        "Value": "0",
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Status",
                        "Name": "prostatus",
                        "Value": 1,
                        "Children": []
                    }]
            } else {
                data = [
                    {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Description",
                        "Name": "prodes",
                        "Value": __scope__.messageForm3.goodsName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Code",
                        "Name": "procode",
                        "Value": __scope__.messageForm3.goodsNum,
                        "Children": []
                    }, {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Description",
                        "Name": "skudes",
                        "Value": __scope__.messageForm3.skuName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Code",
                        "Name": "skucode",
                        "Value": __scope__.messageForm3.skuNum,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Status",
                        "Name": "skustatus",
                        "Value": 1,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.IsCombined",
                        "Name": "IsCombined",
                        "Value": "0",
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Status",
                        "Name": "prostatus",
                        "Value": 1,
                        "Children": []
                    }]
            }

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "SeletedCount": 0,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                if (content == 'activity') {
                    if(res.data && res.data.length>0){
                        __scope__.addActivityMessage = res.data;
                        __scope__.canName1 = res.data[0].productname;
                        __scope__.canCode1 = res.data[0].code;
                    }

                    //总条数
                    __scope__.paginationConf1.totalItems = res.total;

                } else {
                    if(res.data && res.data.length>0) {
                        __scope__.addSendMessage = res.data;
                        __scope__.canName2 = res.data[0].productname;
                        __scope__.canCode2 = res.data[0].code;
                    }
                    //总条数
                    __scope__.paginationConf3.totalItems = res.total;

                }
                InventoryVirtualGetOccupation(__scope__, res.data[0].code, true);
            }, function (res) {

            });
        };

        /**
         * 获取所有仓库
         */
        var getWarehouse = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";

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
                if (res.success) {
                    __scope__.allWarehouse = klwTool.arrayToJson(res.data, 'id');
                }
            });
        };

        /**
         * 商品对应的仓库数据
         * @param __scope__
         * @constructor
         */
        var InventoryVirtualGetOccupation = function (__scope__, code, isInit) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Code",
                "Name": "Code",
                "Value": code,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                $.each(res.data, function (i, obj) {
                    if (__scope__.allWarehouse[obj.warehouseid]) {
                        obj.warename = __scope__.allWarehouse[obj.warehouseid].name
                    }
                });
                __scope__.addActivityMessage2 = res.data;

            }, function (res) {

            });
        };

        /**
         * 新增套装商品
         * @param __scope__
         * @constructor
         */
        var CombinedProductQuery = function (__scope__, PageIndex, PageSize, isInit) {
            var url = "/Product/CombinedProduct/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Status",
                        "Name": "Status",
                        "Value": 1,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                }
            );


            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                __scope__.addCombinedMessage = res.data;

                //总条数
                __scope__.paginationConf2.totalItems = res.total;

            }, function (res) {

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

            if(__scope__.modify.tableList.seq){
                __scope__.modify.tableList.issuperposition=true;
            }
            if(__scope__.modify.tableList.issuperposition){
                __scope__.modify.tableList.seq=0;
            }
            paramObj['body'] = JSON.stringify({
                "BeginDate": __scope__.modify.tableList.begindate,
                "Id": __scope__.modify.tableList.id,
                "CreateDate": __scope__.modify.tableList.createdate,
                "Name": __scope__.modify.tableList.name,
                "ActivityStrategyType": __scope__.modify.tableList.activitystrategytype,
                "EndDate": __scope__.modify.tableList.enddate,
                "IsSuperposition": __scope__.modify.tableList.issuperposition,
                "CreateUser": __scope__.modify.tableList.createuser,
                "Code": __scope__.modify.tableList.code,
                "Status": 0,
                //排序
                "Seq": __scope__.modify.tableList.seq,
                "AlertMobile": __scope__.modify.tableList.alertmobile,
                "Stores": __scope__.modify.stores,
                "Products": __scope__.modify.products,
                "SendProducts": __scope__.modify.sendProducts,
                "Condition": {
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "StrategyId": "00000000-0000-0000-0000-000000000000",
                    "BuyQtyBegin": __scope__.modify.condition.buyqtybegin,
                    "BuyQtyEnd": __scope__.modify.condition.buyqtyend,
                    "BuyAmtBegin": __scope__.modify.condition.buyamtbegin,
                    "BuyAmtEnd": __scope__.modify.condition.buyamtend,
                    //是否翻倍赠送
                    "IsDoubleSend": __scope__.modify.condition.isdoublesend,
                    //翻倍类型 1: 按赠送款数, 2：按赠品赠送数量
                    "DoubleType": __scope__.modify.condition.doubletype,
                    //件数递增条件
                    "BuyMoreQtyDouble": __scope__.modify.condition.buymoreqtydouble,
                    //金额倍增条件
                    "BuyMoreAmtDouble": __scope__.modify.condition.buymoreamtdouble,
                    //最多送多少倍
                    "MaxSend": __scope__.modify.condition.maxsend,
                    //来源类型, 0:所有 1: PC, 2: 移动
                    "OrderFrom": __scope__.modify.condition.orderfrom,
                    //匹配地区　匹配订单省ID
                    "OrderProvince": __scope__.modify.condition.orderprovince,
                    //预售订单送 0: 非预售订单送, 1: 预售订单送
                    "IsPreSellSend": __scope__.modify.condition.ispresellsend,
                    //货到付款送 0: 非货到付款订单送, 1: 货到付款订单送
                    "IsCodOrderSend": __scope__.modify.condition.iscodordersend,
                    //匹配尺码
                    "IsMatchSize": __scope__.modify.condition.ismatchsize,
                    //是否预付款订单送
                    "IsPrePaySend": __scope__.modify.condition.isprepaysend,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },
                //活动范围 0: 所有款, 1: 包含活动商品 2: 排除活动商品
                "ActivityProductRange": __scope__.modify.tableList.activityproductrange,
                //赠送类型 0: 仅送赠品, 1: 仅指定快递, 2: 指定赠品+快递
                "ActivitySendType": __scope__.modify.tableList.activitysendtype,
                //策略类型 0: 买款送, 1:买款满金额送, 2: 满件送, 3: 满金额送, 4: 满件满金额送
                "StrategyType": __scope__.modify.tableList.strategytype,
                //赠送款数
                "SendProductQty": __scope__.modify.tableList.sendproductqty,
                //发货快递
                "ExpressId": __scope__.modify.tableList.expressid,
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
                    //将res.data的isdoublesend
                    var data = res.data[0];
                    if(data.doubletype){
                        data.isdoublesend=true;
                        //下拉选框插件 翻倍赠送类型选择
                        __scope__.selectDoubleType.objName={id: data.doubletype.toString()};
                    }
                    __scope__.modify.condition = $.extend(true, {}, data);

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
                if (res.success) {
                    __scope__.modify.stores = res.data;
                    __scope__.storeName = [];
                    $.each(res.data, function (index, obj) {
                        __scope__.storeName += __scope__.allStore[obj.storeid].name + ';';
                    })
                    if (__scope__.storeName.length <= 0) {
                        __scope__.storeName = '请选择活动店铺';
                    }
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询是否有活动商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategyProductGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyProduct/Get";

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

                if (res.success) {
                    $.each(res.data,function(i,obj){
                        obj.isUpdate=true;
                    });
                    __scope__.tableList1 = res.data;
                    __scope__.modify.products = res.data;

                    if( __scope__.tableList1.length>0){
                        __scope__.addMessage.activityBtn = false;
                    }
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询是否有赠送商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategySendProductGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategySendProduct/Get";

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
                if (res.success) {
                    __scope__.tableList2 = res.data;
                    __scope__.modify.sendProducts = res.data;

                    if( __scope__.tableList2.length>0){
                        __scope__.addMessage.sendBtn = false;
                    }
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 商品导入
         * @__scope__
         * @constructor
         */
        var ProductQueryProduct = function (__scope__, isInit) {
            var url = "/Product/Product/QueryProduct";

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
                        {name: "计划赠送数量", tag: 'plansendqty'},
                        {name: "预警数量", tag: 'alertquantity'},
                        {name: "已赠送数量", tag: 'alreadysendqty'}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "getWarehouse": getWarehouse,
            "ExpressQuery": ExpressQuery,
            "RegionQuery": RegionQuery,
            "ActivityStrategySave": ActivityStrategySave,
            "ActivityStrategyConditionGet": ActivityStrategyConditionGet,
            "ActivityStrategyStoreGet": ActivityStrategyStoreGet,
            "ActivityStrategyProductGet": ActivityStrategyProductGet,
            "ActivityStrategySendProductGet": ActivityStrategySendProductGet,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "CombinedProductQuery": CombinedProductQuery,
            "ProductQueryProduct": ProductQueryProduct,
        };

    }
    ])
;