/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('transferDetailService', ["ApiService", function (ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();


        /**
         * 调拨单详情
         */
        var getTransferDetail = function (scope) {
            var url = "/Inventory/VirtualWarehouseTransferDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VirtualWarehouseTransferId",
                    "Name": "VirtualWarehouseTransferId",
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListInfo = res.data;
                    scope.skuAllId = [];
                    $.each(scope.tableListInfo, function (index, obj) {
                        //初始化可销为0
                        obj.outCanSaleQuantity = 0;
                        obj.inCanSaleQuantity = 0;
                        scope.skuAllId.push(obj.productskuid);
                    });
                    scope.skuAllId.join(',');
                }
            });
        };

        /**
         * 操作日志
         */
        var getTransferLog = function (scope) {
            var url = "/Inventory/VirtualWarehouseTransferLog/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VirtualWarehouseTransferId",
                    "Name": "VirtualWarehouseTransferId",
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListLog = res.data;
                }
            });
        };

        /**
         * 计算可销
         */
        var occupation = function (scope, id) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": scope.formData[id],
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuId",
                    "Name": "SkuId",
                    "Value": scope.skuAllId,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    if (id == 'outwarehouseid') {
                        $.each(scope.tableListInfo, function (index, obj) {
                            obj.outCanSaleQuantity = res.data[index].canUseQuantity;
                        });
                    } else if (id == 'inwarehouseid') {
                        $.each(scope.tableListInfo, function (index, obj) {
                            obj.inCanSaleQuantity = res.data[index].canUseQuantity;
                        });
                    }
                }
            });
        };

        return {
            "getTransferDetail": getTransferDetail,
            "getTransferLog": getTransferLog,
            "occupation": occupation
        };

    }]);