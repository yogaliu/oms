/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addRunScheduleService", ["ApiService", function (ApiService) {


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
                //下拉选框插件 店铺
                __scope__.selectStore.info = res.data;
                __scope__.selectStore.setValue({id: __scope__.modify.tableList.storeid});

            }, function (res) {

            });
        };

        /**
         * 出库仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseQuery = function (__scope__) {
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
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "WarehouseType",
                "Name": "WarehouseType",
                "Value": 1,
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StorageType",
                "Name": "StorageType",
                "Value": 0,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 出库仓库
                __scope__.selectOutHouse.info = res.data;
                __scope__.selectOutHouse.setValue({id: __scope__.modify.tableList.warehouseid});

            }, function (res) {

            });
        };

        /**
         * 出库虚拟仓
         * @param __scope__
         * @constructor
         */
        var WarehouseGet = function (__scope__) {
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
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ParentId",
                "Name": "ParentId",
                "Value": __scope__.modify.tableList.warehouseid,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                $.each(res.data, function (i, obj) {
                    if (obj.warehousetype == 2) {
                        __scope__.modify.tableList.outvirtualwarehousename = obj.name;
                        __scope__.modify.tableList.outvirtualwarehouseid = obj.id;
                        return false;
                    }
                });
            }, function (res) {

            });
        };

        /**
         * 新增页面保存按钮  修改保存
         * @param __scope__
         * @constructor
         */
        var VipScheduleSave = function (__scope__) {
            var url = "/VipOrder/VipSchedule/Save";


            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": __scope__.modify.tableList.id,
                "CreateDate": __scope__.modify.tableList.creatdate,
                "Status": 0,
                "ScheduleType": __scope__.modify.tableList.scheduletype,
                "ScheduleName": __scope__.modify.tableList.schedulename,
                "WarehouseId": __scope__.modify.tableList.warehouseid,
                "WarehouseName": __scope__.modify.tableList.warehousename,
                "OutVirtualWarehouseId": __scope__.modify.tableList.outvirtualwarehouseid,
                "OutVirtualWarehouseName": __scope__.modify.tableList.outvirtualwarehousename,
                "ScheduleBeginDate": __scope__.modify.tableList.schedulebegindate,
                "ScheduleEndDate": __scope__.modify.tableList.scheduleenddate,
                "GoodsValue": __scope__.modify.tableList.goodsvalue,
                "StoreId": __scope__.modify.tableList.storeid,
                "StoreName": __scope__.modify.tableList.storename,
                //需上传
                "IsNeedUpload": __scope__.modify.tableList.isneedupload,
                "Note": __scope__.modify.tableList.note,
                "Detail": __scope__.modify.details,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
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
         * 查询是否有档期明细
         * @__scope__
         * @constructor
         */
        var VipScheduleDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipScheduleDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ScheduleId",
                "Name": "ScheduleId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.modify.details = res.data;
                __scope__.tableList1 = res.data;

                __scope__.addMessage.activityBtn = false;

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 新增活动商品列表
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
                //新增商品模块总数据
                __scope__.addActivityMessage = res.data;

                //总条数
                __scope__.paginationConf.totalItems = res.total;

                InventoryVirtualGetOccupation(__scope__, res.data[0].code, true);
                __scope__.canName = res.data[0].productname;
                __scope__.canCode = res.data[0].code;


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


        // public api
        return {
            "StoreGet": StoreGet,
            "WarehouseQuery": WarehouseQuery,
            "WarehouseGet": WarehouseGet,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "VipScheduleSave": VipScheduleSave,
            "VipScheduleDetailGet": VipScheduleDetailGet,
            "getWarehouse": getWarehouse
        };

    }]);