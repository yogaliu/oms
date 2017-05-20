/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('addReturnRequisitionService', ["ApiService","APP_MENU", function (ApiService,APP_MENU) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购退货单明细
         * @constructor
         */
        var purchaseDetail = function (scope) {
            var url = "/Purchase/PurchaseReturnOrderDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseReturnOrderId",
                    "Name": "PurchaseReturnOrderId",
                    "Value": scope.formData.Id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableInfoList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableInfoList, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 不需要修改的数据
                        obj.editdata = true;
                        // 数据默认展示
                        obj.isShow = true;
                    });
                    // 根据采购退货单明细判断按钮位置
                    if (res.data.length <= 0) {
                        scope.addOrder = 'addBefore';
                    } else {
                        scope.addOrder = '';
                    }
                }
            });

        };

        /**
         * 退货仓库
         * @constructor
         */
        var returnWarehouse = function (scope) {
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
            var promise = ApiService.post(url, param);
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
         * 占用仓库
         * @constructor
         */
        var occupyWarehouseGet = function (scope) {
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
                    "Field": "ParentId",
                    "Name": "ParentId",
                    "Value": scope.formData.WarehouseId,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectVirtualWarehouse.info = res.data;
                    if(scope.formData.type == 'edit') {
                        if(scope.formData.VirtualWarehouseId) {
                            scope.selectVirtualWarehouse.setValue({id:scope.formData.VirtualWarehouseId});
                        }
                    } else if(scope.formData.type == 'new') {
                        scope.selectVirtualWarehouse.init();
                    }
                }
            });

        };

        /**
         * 供应商信息
         * @constructor
         */
        var supplierGet = function (scope, PageIndex, PageSize) {
            var url = "/Purchase/Supplier/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [{
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
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.tableSupplierList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                }

            });
        };

        /**
         * 采购订单号
         * @constructor
         */
        var purchaseGet = function (scope, PageIndex, PageSize) {
            var url = "/Purchase/PurchaseOrder/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [{
                        // 开始时间
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "BeginDate",
                        "Name": "PurchaseDate",
                        "Value": scope.purchaseItem.BeginDate,
                        "Children": []
                    }, {
                        // 结束时间
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "EndDate",
                        "Name": "PurchaseDate",
                        "Value": scope.purchaseItem.EndDate,
                        "Children": []
                    }, {
                        // 采购单号
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.purchaseItem.Code,
                        "Children": []
                    },{
                        // 合同号
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ContractNo",
                        "Name": "ContractNo",
                        "Value": scope.purchaseItem.ContractNo,
                        "Children": []
                    }, {
                        // 收货仓库
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseID",
                        "Name": "WarehouseID",
                        "Value": scope.purchaseItem.WarehouseID,
                        "Children": []
                    },{
                        // 商品编码
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductCode",
                        "Name": "ProductCode",
                        "Value": scope.purchaseItem.ProductCode,
                        "Children": []
                    }, {
                        // 供应商编码
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "SupplierCode",
                        "Name": "SupplierCode",
                        "Value": scope.purchaseItem.SupplierCode,
                        "Children": []
                    }, {
                        // 供应商名称
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "SupplierName",
                        "Name": "SupplierName",
                        "Value": scope.purchaseItem.SupplierName,
                        "Children": []
                    }, {
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
                })
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {

                if (res.success) {
                    //列表数据
                    scope.tablePurchaseList = res.data;
                    //总条数
                    scope.paginationNumConf.totalItems = res.total;
                    // 默认第一条采购订单明细
                    purchaseOrderDetail(scope,res.data[0]);
                    $.each(scope.tablePurchaseList,function (index,obj) {
                        //状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.purchaseOrderStatus[obj.status];
                        }
                        // 退货金额
                        obj.purchasereturnamount = obj.purchasereturnamount?obj.purchasereturnamount:0;
                        // 可退数量,默认为0
                        obj.returnqty = 0;
                    });
                }
            });

        };

        /**
         * 采购订单明细
         * @constructor
         */
        var purchaseOrderDetail = function (scope,data) {
            var url = "/Purchase/PurchaseOrderDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value": data.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.purchaseDetailData = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.purchaseDetailData, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                        // 默认将detailId置为0
                        obj.detailid = 0;
                    });
                }
            });

        };

        /**
         * 退货原因
         * @constructor
         */
        var returnReason = function (scope) {
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
                    "Value": 26,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectReason.info = res.data;
                    if(scope.formData.type == 'edit') {
                        if(scope.formData.TypeName) {
                            var curId = '';
                            $.each(res.data, function (index,obj) {
                                if(obj.name == scope.formData.TypeName) {
                                    curId = obj.id;
                                }
                            });
                            scope.selectReason.setValue({id:curId});
                        }
                    } else if(scope.formData.type == 'new') {
                        scope.selectReason.init();
                    }
                }
            });

        };

        /**
         * 保存采购退货单
         * @constructor
         */
        var savePurchase = function (scope, data) {
            var url = "/Purchase/PurchaseReturnOrder/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id":data.Id?data.Id:0,
                    "CreateDate": data.CreateDate?data.CreateDate:"0001-01-01 00:00:00",
                    "SupplierCode": data.SupplierCode,
                    "SupplierName": data.SupplierName,
                    "WarehouseID": data.WarehouseId,
                    "WarehouseName": data.WarehouseName,
                    "TypeCode": data.TypeCode,
                    "TypeName": data.TypeName,
                    "Remark":data.Remark,
                    "Details": scope.tableData,
                    "VirtualWarehouseId": data.VirtualWarehouseId,
                    "VirtualWarehouseName": data.VirtualWarehouseName,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                })
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                }
            });
        };


        return {
            "purchaseDetail":purchaseDetail,
            "purchaseGet": purchaseGet,
            "purchaseOrderDetail":purchaseOrderDetail,
            "returnWarehouse": returnWarehouse,
            "occupyWarehouseGet": occupyWarehouseGet,
            "supplierGet": supplierGet,
            "returnReason": returnReason,
            "savePurchase": savePurchase
        };

    }]);