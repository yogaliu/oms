/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addMatchGoodsBillService", ["ApiService","toolsService", function (ApiService,toolsService) {


        /**
         * 查询唯品档期
         * @param __scope__
         * @constructor
         */
        var VipScheduleGet = function (__scope__) {
            var url = "/VipOrder/VipSchedule/Get ";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Status",
                "Name": "Status",
                "Value": 1,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //列表数据
                __scope__.tableRightSideList = res.data;
            }, function (res) {

            });
        };

        /**
         * 查询唯品店铺
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
                if (res.success) {
                    __scope__.storeObj = [];
                    //唯品店铺：platformtype=25
                    $.each(res.data, function (i, obj) {
                        if (obj.platformtype == 25) {
                            __scope__.storeObj.push(obj);
                        }
                    });
                    __scope__.selectStore.info = __scope__.storeObj;
                    __scope__.selectStore.objName = {id: __scope__.modify.StoreId};
                }
            }, function (res) {

            });
        };

        /**
         * 到货仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseGet1 = function (__scope__) {
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
                "Value": 2,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 到货仓库
                __scope__.selectInHouse.info = res.data;
                __scope__.selectInHouse.objName = {id: __scope__.modify.tableList.sendwarehouseid};
            }, function (res) {

            });
        };

        /**
         * 出库仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseGet2 = function (__scope__) {
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
                if (res.success) {
                    //下拉选框插件 出库仓库
                    __scope__.selectOutHouse.info = res.data;
                    __scope__.selectOutHouse.objName = {id: __scope__.modify.tableList.warehouseid};
                }

            }, function (res) {

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


        /**
         * 新增页面保存按钮
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderSave = function (__scope__) {

            var url = "/VipOrder/VipDispatchOrder/Save";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": 0,
                "CreateDate": "0001-01-01 00:00:00",
                "PoCode": __scope__.modify.tableList.pocode,
                //拣货单号
                "PickingCode": __scope__.modify.tableList.pickingcode,
                "OrderCate": 0,
                "ScheduleId": __scope__.modify.tableList.scheduleid,
                "ScheduleName": __scope__.modify.tableList.schedulename,
                //出库仓库
                "WarehouseId": __scope__.modify.tableList.warehouseid,
                "WarehouseName": __scope__.modify.tableList.warehousename,
                //到货仓库
                "SendWarehouseId": __scope__.modify.tableList.sendwarehouseid,
                "SendWarehouseName": __scope__.modify.tableList.sendwarehousename,
                "ScheduleCode": __scope__.modify.tableList.schedulecode,
                "StoreId": __scope__.modify.tableList.storeid,
                "StoreName": __scope__.modify.tableList.storename,
                "StorageNo": __scope__.modify.tableList.storageno,//入库单号
                "Note": __scope__.modify.tableList.note,
                "Details": [{
                    "Id": 0,
                    "CreateDate": "0001-01-01 00:00:00",
                    "DispatchOrderId": 0,
                    "PoCode": "7097091029",
                    "ProductId": "a094e762-6496-4a19-adac-37739ad4ff27",
                    "ProductCode": "S5D680161LC",
                    "ProductName": "161LC",
                    "SkuId": "ffff6de6-f247-45d5-86ce-a83a2288c63f",
                    "SkuCode": "S5D680161LC-A01204",
                    "SkuName": "黑色-A01 XL-204",
                    "VipSkuCode": "S5D680161LC-A01204",
                    "NoticeQty": 1,
                    "OutQty": 0,
                    "SendQty": 0,
                    "SupplyPrice": 0.0,
                    "PickingCode": "3456789",
                    "InVirtualWarehouseId": "3820266c-a46e-4377-9e34-5f5a9d1d646e",
                    "ScheduleCode": "VS1704274991200",
                    "ScheduleId": 37,
                    "ScheduleDetailId": 0,
                    "IsAbnormal": false,
                    "InputQty": 1,
                    "CanNoticeQty": 899,
                    "IsSpecial": true,
                    "Details": [{
                        "Id": 0,
                        "DispatchOrderDetailId": 0,
                        "ScheduleDetailId": 83,
                        "WarehouseId": "3820266c-a46e-4377-9e34-5f5a9d1d646e",
                        "WarehouseName": "深圳共享仓-MQ专用",
                        "Quantity": 1,
                        "OutQuantity": 0,
                        "Deleted": false,
                        "IsNew": true,
                        "IsUpdate": true
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                }],
                "NoticeQtyTotal": 0,
                "IsCreateBhed": __scope__.modify.tableList.iscreatebhed,
                "DeliveryMethod": 0,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("新增成功");
                }
                else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipScheduleGet": VipScheduleGet,
            "StoreGet": StoreGet,
            "WarehouseGet1": WarehouseGet1,
            "WarehouseGet2": WarehouseGet2,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "VipDispatchOrderSave": VipDispatchOrderSave,
            "getWarehouse": getWarehouse
        };

    }]);