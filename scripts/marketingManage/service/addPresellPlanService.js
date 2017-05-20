/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addPresellPlanService", ["ApiService", "APP_COLORS", "WAP_CONFIG", "toolsService",function (ApiService, APP_COLORS, WAP_CONFIG,toolsService) {

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
                $.each(res.data, function (i, o) {
                    o.storename = o.name;
                    o.storeid = o.id;
                });
                __scope__.storeList = res.data;

                if (__scope__.params.tableList.id) {
                    PreSellPlanStoreGet(__scope__, true);
                }

            }, function (res) {

            });
        };

        /**
         * 新增商品
         * @param __scope__
         * @constructor
         */
        var ProductSkuQuery = function (__scope__, PageIndex, PageSize, isInit) {
            var url = "/Product/ProductSku/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "SeletedCount": 0,
                "Data": [
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
                    }],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                __scope__.addActivityMessage = res.data;

                //总条数
                __scope__.paginationConf.totalItems = res.total;

                __scope__.canName = res.data[0].productname;
                __scope__.canCode = res.data[0].code;
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
        var InventoryVirtualGetOccupation = function (__scope__, code) {
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
         * 预售计划新增保存
         * @__scope__
         * @constructor
         */
        var PreSellPlanSave = function (__scope__) {
            var url = "/Product/PreSellPlan/Save";
            //复制页面
            if (__scope__.params.isCopy) {
                __scope__.modify.tableList.id = '0';
                __scope__.modify.tableList.creatdate = '0001-01-01 00:00:00';
            }

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": __scope__.modify.tableList.id,
                "CreateDate": __scope__.modify.tableList.creatdate,
                "Code": __scope__.modify.tableList.code,
                "BeginDate": __scope__.modify.tableList.begindate,
                "EndDate": __scope__.modify.tableList.enddate,
                "DeliveryDate": __scope__.modify.tableList.deliverydate,
                "Status": 0,
                "IsDynamic": __scope__.modify.tableList.isdynamic,
                "Note": __scope__.modify.tableList.note,
                "IsStoreDetail": false,
                "Detail": __scope__.modify.details,
                "Store": __scope__.modify.stores,
                "StoreDetail": [],
                "IsAutoStart": false,
                "IsListing": __scope__.modify.tableList.islisting,
                "TotalPreSellQuantity": __scope__.modify.tableList.totalpresellquantity,
                "TotalSalesQty": __scope__.modify.tableList.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false


            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    __scope__.returnFun();
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 获取店铺
         * @param __scope__
         * @constructor
         */
        var PreSellPlanStoreGet = function (__scope__) {
            var url = "/Product/PreSellPlanStore/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                if (res.data) {
                    $.each(res.data, function (i, obj) {
                        obj.Select = true;
                        obj.Deleted = false;
                        obj.IsNew = false;
                        obj.IsUpdate = false;
                    });
                    __scope__.modify.stores = res.data;
                    __scope__.storeDivName = [];
                    $.each(res.data, function (index, obj) {
                        __scope__.storeDivName += obj.storename + ';';

                        __scope__.selectStoreList.push(obj);

                        $.each(__scope__.storeList, function (index2, obj2) {
                            if (obj2.id.toLowerCase() == obj.storeid.toLowerCase()) {
                                obj2.rate = obj.rate;
                                return true;
                            }
                        })
                    })

                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 获取预售商品明细
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
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);
            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {


                $.each(res.data, function (i, obj) {
                    obj.IsNew = false;
                    obj.IsUpdate = false;
                });

                //列表数据
                __scope__.tableList1 = res.data;
                __scope__.modify.details = res.data;

                if( __scope__.tableList1.length>0){
                    __scope__.addMessage.activityBtn = false;
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        // public api
        return {
            "StoreGet": StoreGet,
            "getWarehouse": getWarehouse,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "PreSellPlanSave": PreSellPlanSave,
            "PreSellPlanStoreGet": PreSellPlanStoreGet,
            "PreSellPlanDetailGet": PreSellPlanDetailGet,
        };

    }]);