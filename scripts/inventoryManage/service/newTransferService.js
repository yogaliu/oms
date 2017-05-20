/**
 * Created by xs on 2017/4/10.
 */
angular.module("klwkOmsApp")
    .factory('newTransferService', ["ApiService", "toolsService", function (ApiService, toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();


        /**
         * 虚拟调拨单明细
         */
        var getDetail = function (scope) {
            var url = "/Inventory/VirtualWarehouseTransferDetail/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VirtualWarehouseTransferId",
                    "Name": "VirtualWarehouseTransferId",
                    "Value": scope.formData.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableInfoList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableInfoList, function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 调拨数量
                        obj.canquantity = obj.quantity;
                        // 可调数量
                        obj.canusequantity = 0;
                        // 计划数量
                        obj.planqty = 0;
                        // 数据默认展示
                        obj.isShow = true;
                        // 需要修改的数据
                        obj.editdata = true;
                    });
                    // 根据虚拟调拨单明细判断按钮位置
                    if (res.data.length <= 0) {
                        scope.addOrder = 'addBefore';
                    } else {
                        scope.addOrder = '';
                    }
                }
            });
        };

        /**
         * 全部仓库
         * @constructor
         */
        var warehouseGetAll = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({body: []}, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.warehouselist = klwTool.arrayToJson(res.data, 'id');
                }
            });
        };

        /**
         * 调出仓库
         */
        var getOutWarehouse = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }, {
                    "OperateType": 1,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectOutWarehouse.info = res.data;
                    if (scope.formData.type == 'edit') {
                        if (scope.formData.OutWarehouseId) {
                            scope.selectOutWarehouse.setValue({id: scope.formData.OutWarehouseId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectOutWarehouse.init();
                    }
                }
            });
        };

        /**
         * 调入仓库
         */
        var getInWarehouse = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Name": "ParentId",
                    "Value": scope.formData.ParentId,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectInWarehouse.info = res.data;
                    if (scope.formData.type == 'edit') {
                        if (scope.formData.InWarehouseId) {
                            scope.selectInWarehouse.setValue({id: scope.formData.InWarehouseId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectInWarehouse.init();
                    }
                }
            });
        };

        /**
         * 商品信息
         * @constructor
         */
        var productQuery = function (scope, PageIndex, PageSize) {
            var url = "/Product/ProductSku/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [
                        {
                            // 商品编码
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Code",
                            "Name": "skucode",
                            "Value": scope.productItem.productCode,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Status",
                            "Name": "skustatus",
                            "Value": 1,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.IsCombined",
                            "Name": "IsCombined",
                            "Value": "0",
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Status",
                            "Name": "prostatus",
                            "Value": 1,
                            "Children": []
                        }
                    ],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    //列表数据
                    scope.tableSkuList = res.data;
                    $.each(scope.tableSkuList, function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 规格编码
                        obj.productskucode = obj.code;
                        // 规格名称
                        obj.productskuname = obj.description;
                        // 计划数量,默认为1
                        obj.planqty = 1;
                        // 可调数量,默认为0
                        obj.canusequantity = 0;
                        // 初始化Id为0
                        obj.id = 0;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                    });
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    // 默认第一条仓库数量
                    getInventory(scope, res.data[0]);
                }
            });
        };

        /**
         * 查看仓库数量
         * @constructor
         */
        var getInventory = function (scope, data) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": data.code,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.inventoryNum = res.data;
                    $.each(scope.inventoryNum, function (index, obj) {
                        if (obj.warehouseid !== undefined) {
                            if(scope.warehouselist[obj.warehouseid]) {
                                obj.warehousename = scope.warehouselist[obj.warehouseid].name;
                            } else {
                                obj.warehousename = '**未知数据**';
                            }
                        }
                    });
                }
            });
        };

        /**
         * 获取可调数量
         * @constructor
         */
        var getInventoryNum = function (scope, skuId) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": scope.formData.OutWarehouseId,
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuId",
                    "Name": "SkuId",
                    "Value": skuId,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    if(res.data.length != 0) {
                        $.each(res.data, function (index, obj) {
                            // 排除可调数量为小于等于0的商品
                            obj.canusequantity = obj.canUseQuantity <= 0 ? obj.canUseQuantity = 0 : obj.canUseQuantity;
                        });
                    }
                    for (var i = 0; i < scope.activeItemList.length; i++) {
                        if(res.data.length!= 0) {
                            for (var j = 0; j < res.data.length; j++) {
                                if (scope.activeItemList[i].skuid.toLowerCase() == res.data[j].skuid.toLowerCase()) {
                                    // 获取可调数量
                                    scope.activeItemList[i].canusequantity = res.data[j].canusequantity;
                                    // 计算调拨数量,如果计划数量小于可调数量,调拨数量等于计划数量,否则等于可调数量
                                    scope.activeItemList[i].canquantity = scope.activeItemList[i].planqty <= res.data[j].canusequantity ? scope.activeItemList[i].planqty : res.data[j].canusequantity;
                                }
                            }
                        } else {
                            scope.activeItemList[i].canusequantity = 0;
                        }
                    }
                    scope.tableInfoList = scope.tableInfoList.concat(scope.activeItemList);
                    scope.activeItemList = [];
                    $.each(scope.tableInfoList, function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
                }
            });
        };

        /**
         * 保存
         */
        var save = function (scope, data) {
            var url = "/Inventory/VirtualWarehouseTransfer/Save";
            var param = $.extend({
                body: JSON.stringify({
                    "Id": data.id ? data.id : 0,
                    "InWarehouseId": data.InWarehouseId,
                    "InWarehouseName": data.InWarehouseName,
                    "OutWarehouseId": data.OutWarehouseId,
                    "OutWarehouseName": data.OutWarehouseName,
                    "Remark": data.Remark,
                    "VirtualDetails": scope.tableData,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content: res.errorCode, time: 1000});
                }
            });
        };

        return {
            "getDetail": getDetail,
            "warehouseGetAll": warehouseGetAll,
            "getOutWarehouse": getOutWarehouse,
            "getInWarehouse": getInWarehouse,
            "productQuery": productQuery,
            "getInventory": getInventory,
            "getInventoryNum": getInventoryNum,
            "save": save
        };

    }]);