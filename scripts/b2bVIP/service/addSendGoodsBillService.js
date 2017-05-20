/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addSendGoodsBillService", ["ApiService", "toolsService", function (ApiService, toolsService) {

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
         * 查询唯品档期
         * @param __scope__
         * @constructor
         */
        var VipScheduleGet = function ( __scope__) {
            var url = "/VipOrder/VipSchedule/Get";

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
         * 查询品牌
         * @param __scope__
         * @constructor
         */
        var GeneralClassiFicationGet3 = function (__scope__) {
            var url = "/BasicInformation/GeneralClassiFication/Get";

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
                "Field": "ClassiFicationType",
                "Name": "ClassiFicationType",
                "Value": 2,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 品牌
                __scope__.selectBrand.info = res.data;
                __scope__.selectBrand.objName = {id: __scope__.modify.BrandId};

            }, function (res) {

            });
        };


        /**
         * 查询承运商
         * @param __scope__
         * @constructor
         */
        var GeneralClassiFicationGet = function (__scope__) {
            var url = "/BasicInformation/GeneralClassiFication/Get";

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
                "Field": "ClassiFicationType",
                "Name": "ClassiFicationType",
                "Value": 29,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 承运商
                __scope__.selectCarrierName.info = res.data;
                __scope__.selectCarrierName.objName = {id: __scope__.modify.CarrierId};

            }, function (res) {

            });
        };

        /**
         * 查询到货时间 字段
         * @param __scope__
         * @constructor
         */
        var GeneralClassiFicationGet2 = function (__scope__) {
            var url = "/BasicInformation/GeneralClassiFication/Get";

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
                "Field": "ClassiFicationType",
                "Name": "ClassiFicationType",
                "Value": 31,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 到货时间
                __scope__.selectVipArrivalTime.info = res.data;
                __scope__.selectVipArrivalTime.objName = {id: __scope__.modify.VipArrivalTimeId};

            }, function (res) {

            });
        };

        /**
         * 查询到货仓库
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
                    //下拉选框插件 到货仓库
                    __scope__.selectSendWareHouse.info = res.data;
                    __scope__.selectSendWareHouse.objName = {id: __scope__.modify.SendWarehouseId};
                }
            }, function (res) {

            });
        };

        /**
         * 保存
         * @param __scope__
         * @constructor
         */
        var VipDeliveryOrderSave = function (__scope__) {
            var url = "/VipOrder/VipDeliveryOrder/Save";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PoCode": __scope__.modify.PoCode,
                "Id": __scope__.modify.id,
                "CreateDate": __scope__.modify.createDate,
                "Status": 0,
                "ScheduleId": __scope__.modify.ScheduleId,
                "ScheduleCode": __scope__.modify.ScheduleCode,
                "ScheduleName": __scope__.modify.ScheduleName,
                //到货仓库
                "SendWarehouseId": __scope__.modify.SendWarehouseId,
                "SendWarehouseName": __scope__.modify.SendWarehouseName,
                //承运商
                "CarrierName": __scope__.modify.CarrierName,
                "CarrierCode": __scope__.modify.CarrierCode,
                //配送方式
                "DeliveryMethod": __scope__.modify.DeliveryMethod,
                //到货时间
                "ArrivalTime": __scope__.modify.ArrivalTime,
                //送货时间
                "DeliveryTime": __scope__.modify.DeliveryTime,
                //运单号
                "WaybillNumber": __scope__.modify.WaybillNumber,
                "Note": __scope__.modify.Note,
                "StoreId": __scope__.modify.StoreId,
                "StoreName": __scope__.modify.StoreName,
                //品牌
                "BrandCode": __scope__.modify.BrandCode,
                "BrandName": __scope__.modify.BrandName,
                "VipArrivalTime": __scope__.modify.VipArrivalTime,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true

            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.returnFun();
                } else {
                    toolsService.alertError(res.errorMessage);
                }

            }, function (res) {

            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "VipScheduleGet": VipScheduleGet,
            "VipDeliveryOrderSave": VipDeliveryOrderSave,
            "GeneralClassiFicationGet": GeneralClassiFicationGet,
            "GeneralClassiFicationGet2": GeneralClassiFicationGet2,
            "GeneralClassiFicationGet3": GeneralClassiFicationGet3,
            "WarehouseGet": WarehouseGet,
        };

    }]);