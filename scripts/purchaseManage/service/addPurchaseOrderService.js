/**
 * Created cj dell on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('addPurchaseOrderService', ["ApiService","toolsService",
        function (ApiService,toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购订单明细
         * @constructor
         */
        var purchaseDetail = function (scope) {
            var url = "/Purchase/PurchaseOrderDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value": scope.formData.Id,
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
                    $.each(scope.tableInfoList, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 数据默认展示
                        obj.isShow = true;
                        // 需要修改的数据
                        obj.editdata = true;
                        // 计算采购总金额
                        obj.purchaseamount = obj.purchaseqty*obj.currentprice;
                    });
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
         * 供应商信息
         * @constructor
         */
        var supplierGet = function (scope, PageIndex,PageSize,data) {
            var url = "/Purchase/Supplier/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": !data?[]:[{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.supplierItem.code,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ShortName",
                        "Name": "ShortName",
                        "Value": scope.supplierItem.shortName,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableSupplierList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableSupplierList, function (index,obj) {
                        obj.isSupplierSelect = false;
                    })
                }

            });
        };

        /**
         * 仓库
         * @constructor
         */
        var warehouseGetAll = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body:[]
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.warehouselist = klwTool.arrayToJson(res.data,'id');
                }
            });
        };

        /**
         * 收货仓库
         * @constructor
         */
        var warehouseGet = function (scope) {
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
                    scope.selectWarehouse.info = res.data;
                    if(scope.formData.type == 'edit') {
                        if(scope.formData.WarehouseId) {
                            scope.selectWarehouse.setValue({id:scope.formData.WarehouseId});
                        }
                    } else if(scope.formData.type == 'new') {
                        scope.selectWarehouse.init();
                    }
                }
            });

        };


        /**
         * 商品信息
         * @constructor
         */
        var productQuery = function (scope, PageIndex, PageSize,data) {
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
                    //总条数
                    scope.paginationSkuConf.totalItems = res.total;
                    // 通过采购数量和采购单价计算采购总价
                    $.each(scope.tableSkuList, function (index,obj) {
                        obj.isSelect = false;
                        // 规格编码
                        obj.skucode = obj.code;
                        // 规格名称
                        obj.skuname = obj.description;
                        // 采购数量,默认为1
                        obj.purchaseqty = obj.purchaseqty?obj.purchaseqty:1;
                        // 采购价
                        obj.currentprice = obj.purchaseprice;
                        // 采购总金额
                        obj.purchaseamount = obj.purchaseqty*obj.currentprice;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                    });
                    // 默认关联第一条
                    scope.tableSkuList[0].isSelect = true;
                    // 默认第一条仓库数量
                    getProductInventory(scope,res.data[0]);
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
         * 保存采购订单
         * @constructor
         */
        var savePurchase = function (scope, data) {
            var url = "/Purchase/PurchaseOrder/Save ";
            var param = $.extend({
                body:JSON.stringify({
                    "Id": data.id?data.id:"00000000-0000-0000-0000-000000000000",
                    "PurchaseDate": data.purchasedate,
                    "RequestDeliveryDate": data.requestdeliverydate,
                    "SupplierCode": data.suppliercode,
                    "SupplierName": data.suppliername,
                    "WarehouseID": data.warehouseid,
                    "WarehouseName": data.warehousename,
                    "Status": data.status?data.status:0,
                    "Remark": data.remark,
                    "StockUseable": false,
                    "Details": scope.tableData,
                    "ContractNo": data.contractno,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        return {
            "supplierGet": supplierGet,
            "warehouseGet": warehouseGet,
            "warehouseGetAll": warehouseGetAll,
            "purchaseDetail": purchaseDetail,
            "productQuery": productQuery,
            "getProductInventory": getProductInventory,
            "savePurchase": savePurchase
        };

    }]);