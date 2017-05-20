/**
 * Created by xs on 2017/4/10.
 */
angular.module("klwkOmsApp")
    .factory('newMaterialService', ["ApiService","toolsService",
        function (ApiService,toolsService) {

        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 实物调拨单明细
         */
        var transferDetail = function (scope) {
            var url = "/Inventory/AllocationPlanDetail/Query ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "AllocationPlanCode",
                    "Name": "AllocationPlanCode",
                    "Value": scope.formData.Code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableInfoList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    var skuId = [];
                    $.each(scope.tableInfoList, function (index, obj) {
                        //录入数量
                        obj.inputqty = obj.inputQty;
                        // 可调数量,默认为0
                        obj.canallocationquantity = 0;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 数据默认展示
                        obj.isShow = true;
                        // 需要修改的数据
                        obj.editdata = true;
                        skuId.push(obj.productskuid);
                    });
                    // 获取可调数量
                    getInventoryNum(scope,skuId.join(',').toLowerCase(),'get');
                    // 根据商品明细判断按钮位置
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
            var param = $.extend({body:[]},paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.warehouselist = klwTool.arrayToJson(res.data,'id');
                }
            });
        };


        /**
         * 仓库
         */
        var getWarehouse = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body:JSON.stringify([{
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
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 调出仓库
                    scope.selectOutWarehouse.info = res.data;
                    if (scope.formData.type == 'edit') {
                        if (scope.formData.OutWarehouseId) {
                            scope.selectOutWarehouse.setValue({id: scope.formData.OutWarehouseId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectOutWarehouse.init();
                    }
                    // 调入仓库
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
         * 占用仓库
         */
        var getVirtualWarehouse = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Name": "ParentId",
                    "Value": scope.formData.OutWarehouseId,
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
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectVirtualWarehouse.info = res.data;
                    if (scope.formData.type == 'edit') {
                        if (scope.formData.VirtualWarehouseId) {
                            scope.selectVirtualWarehouse.setValue({id: scope.formData.VirtualWarehouseId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectVirtualWarehouse.init();
                    }
                }
            });
        };

        /**
         * 调拨类型
         */
        var transferType = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Get";
            var param = $.extend({
                body:JSON.stringify([{
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
                    "Value": 17,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectType.info = res.data;
                    if (scope.formData.type == 'edit') {
                        var curId = '';
                        if (scope.formData.AllocationTypeName) {
                            $.each(res.data, function (index,obj) {
                                if(obj.name == scope.formData.AllocationTypeName) {
                                    curId = obj.id;
                                }
                            });
                            scope.selectType.setValue({id:curId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectType.init();
                    }
                }
            });
        };

        /**
         * 获取商品信息
         * @constructor
         */
        var getProduct = function (scope, PageIndex, PageSize,data) {
            var url = "/Product/ProductSku/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": !data?[]:[
                        {
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
            },paramObj);
            var promise = ApiService.postLoad(url,param);
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
                        obj.productskucode =  obj.code;
                        // 规格名称
                        obj.productskuname = obj.description;
                        // 计划数量,默认为0
                        obj.planqty = 0;
                        // 录入数量,默认为1
                        obj.inputqty = 1;
                        // 可调数量,默认为0
                        obj.canallocationquantity = 0;
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
                    getProductInventory(scope, res.data[0]);
                }
            });
        };

        /**
         * 查看仓库数量
         * @constructor
         */
        var getProductInventory = function (scope, data) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": data.code,
                    "Children": []
                }])
            },paramObj);
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
        var getInventoryNum = function (scope,skuId,type) {
            var url = "/Inventory/InventoryVirtual/GetVirtualWarehouseCanAllocation";
            var param = $.extend({
                body: JSON.stringify([
                    {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseId",
                        "Name": "WarehouseId",
                        "Value": scope.formData.VirtualWarehouseId,
                        "Children": []
                    },
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "SkuId",
                        "Name": "SkuId",
                        "Value": skuId,
                        "Children": []
                    }
                ])
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        // 排除可调数量为小于等于0的商品
                        obj.canAllocationQuantity = obj.canAllocationQuantity <= 0 ? 0:obj.canAllocationQuantity;
                    });
                    if(type == 'create') {
                        for(var i = 0; i < scope.activeItemList.length; i++) {
                            for(var j = 0; j < res.data.length; j++) {
                                if(scope.activeItemList[i].skuid == res.data[j].skuid) {
                                    // 获取可调数量
                                    scope.activeItemList[i].canallocationquantity = res.data[j].canAllocationQuantity;
                                    // 计算计划数量,如果录入数量小于可调数量,计划数量等于录入数量,否则等于可调数量
                                    scope.activeItemList[i].planqty = scope.activeItemList[i].inputqty <= res.data[j].canAllocationQuantity?scope.activeItemList[i].inputqty:res.data[j].canAllocationQuantity;
                                }
                            }
                        }
                        scope.tableInfoList = scope.tableInfoList.concat(scope.activeItemList);
                        scope.activeItemList = [];
                    } else if(type == 'get') {
                        for(var k = 0; k < scope.tableInfoList.length; k++) {
                            for(var z = 0; z < res.data.length; z++) {
                                if(scope.tableInfoList[k].productskuid == res.data[z].skuid.toLowerCase()) {
                                    // 获取可调数量
                                    scope.tableInfoList[k].canallocationquantity = res.data[z].canAllocationQuantity;
                                }
                            }
                        }
                    }
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableInfoList, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
                }
            });
        };

        /**
         * 保存实物调拨
         */
        var save = function (scope, data) {
            var url = "/Inventory/AllocationPlan/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id": data.Id?data.Id:0,
                    "OutWarehouseId": data.OutWarehouseId,
                    "OutWarehouseName": data.OutWarehouseName,
                    "InWarehouseId": data.InWarehouseId,
                    "InWarehouseName": data.InWarehouseName,
                    "VirtualWarehouseId": data.VirtualWarehouseId,
                    "VirtualWarehouseName": data.VirtualWarehouseName,
                    "Remark":data.Remark,
                    "AllocationTypeCode": data.AllocationTypeCode,
                    "AllocationTypeName": data.AllocationTypeName,
                    "Details": scope.tableData,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                })
            },paramObj);
            var promise = ApiService.post(url, param);
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
            "transferDetail": transferDetail,
            "warehouseGetAll":warehouseGetAll,
            "getWarehouse": getWarehouse,
            "getVirtualWarehouse": getVirtualWarehouse,
            "transferType": transferType,
            "save": save,
            "getProduct": getProduct,
            "getProductInventory": getProductInventory,
            "getInventoryNum":getInventoryNum
        };

    }]);
