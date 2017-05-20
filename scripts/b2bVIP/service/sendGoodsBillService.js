/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("sendGoodsBillService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {

        /**
         * 查询送货单列表数据
         * @__scope__
         * @constructor
         */
        var VipDeliveryOrderQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipDeliveryOrder/Query";
            var data = [];
            //搜索条件
            if (__scope__.searchForm.deliveryordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "DeliveryOrderCode",
                    "Name": "DeliveryOrderCode",
                    "Value": __scope__.searchForm.deliveryordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.pocode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PoCode",
                    "Name": "PoCode",
                    "Value": __scope__.searchForm.pocode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.begindate !== '') {
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "BeginDate",
                    "Value": __scope__.searchForm.begindate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.enddate !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.enddate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.productcode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.productcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.storageno !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageNo",
                    "Name": "StorageNo",
                    "Value": __scope__.searchForm.storageno,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.pickingcode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PickingCode",
                    "Name": "PickingCode",
                    "Value": __scope__.searchForm.pickingcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.sendwarehouseid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SendWarehouseId",
                    "Name": "SendWarehouseId",
                    "Value": __scope__.searchForm.sendwarehouseid,
                    "Children": []
                };
                data.push(obj);
            }

            var paramObj = ApiService.getBasicParamobj();
            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "Timespan": "00:00:00.221",
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i, obj) {
                    //状态 根据id匹配name
                    if (obj.status !== undefined) {
                        obj.statusName = APP_MENU.CITsendGoodsStatus[obj.status];
                    }
                    //配送方式 根据id匹配name
                    if (obj.deliverymethod !== undefined) {
                        obj.deliverymethodName = APP_MENU.CITshippingMethods[obj.deliverymethod];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询收货仓库
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
                if (res.success) {
                    //下拉选框插件 收货仓库
                    __scope__.selectSendWareHouse.info = res.data;
                    __scope__.selectSendWareHouse.objName = {id: __scope__.searchForm.sendwarehouseid};
                }
            }, function (res) {

            });
        };

        /**
         * 发货
         * @param __scope__
         * @constructor
         */
        var VipDeliveryOrderPlatformDelivery = function (__scope__, obj) {
            var url = "/VipOrder/VipDeliveryOrder/PlatformDelivery";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DeliveryOrderCode",
                "Value": obj.deliveryordercode,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('发货成功');
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 关闭
         * @param __scope__
         * @constructor
         */
        var VipDeliveryOrderAbolition = function (__scope__, obj) {
            var url = "/VipOrder/VipDeliveryOrder/Abolition";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(obj.deliveryordercode);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('关闭成功');
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipDeliveryOrderQuery": VipDeliveryOrderQuery,
            "WarehouseGet": WarehouseGet,
            "VipDeliveryOrderPlatformDelivery": VipDeliveryOrderPlatformDelivery,
            "VipDeliveryOrderAbolition": VipDeliveryOrderAbolition,
        };


    }]);