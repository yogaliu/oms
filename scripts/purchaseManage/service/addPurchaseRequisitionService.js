/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('addPurchaseRequisitionService', ["ApiService","APP_MENU","toolsService",
        function (ApiService,APP_MENU,toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购通知单明细
         * @constructor
         */
        var purchaseDetail = function (scope) {
            var url = "/Purchase/PurchaseNoticeOrderDetail/Query ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseNoticeOrderId",
                    "Name": "PurchaseNoticeOrderId",
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
                        obj.deleted = false;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 不需要修改的数据
                        obj.editdata = true;
                        // 数据默认展示
                        obj.isShow = true;
                        // 可通知数量等于到货数量
                        obj.cannoticeqty = obj.purchaseqty;
                        // 计算通知超额数量,如果通知数量大于可通知数量,通知超额数量等于通知数量-可通知数量,否则为0
                        if(obj.noticeqty >= obj.cannoticeqty) {
                            obj.cannoticediff = obj.noticeqty - obj.cannoticeqty;
                        } else {
                            obj.cannoticediff = 0;
                        }
                    });
                    // 根据采购通知单明细判断按钮位置
                    if (res.data.length <= 0) {
                        scope.addOrder = 'addBefore';
                    } else {
                        scope.addOrder = '';
                    }
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
         * 入库仓库
         * @constructor
         */
        var VirtualWarehouseGet = function (scope) {
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
            var promise = ApiService.post(url, param);
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
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tablePurchaseList = res.data;
                    //总条数
                    scope.paginationNumConf.totalItems = res.total;
                    // 默认第一条采购订单明细
                    purchaseOrderDetail(scope,res.data[0]);
                    $.each(scope.tablePurchaseList, function (index,obj) {
                        // 通知数量,默认为0
                        obj.noticeqty = 1;
                        //状态根据id匹配name
                        if(obj.status !== undefined){
                            obj.statusname = APP_MENU.purchaseOrderStatus[obj.status];
                        }
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
                    // 通过采购数量和采购单价计算采购总价
                    $.each(scope.purchaseDetailData, function (index,obj) {
                        obj.deleted = false;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                        // 计算采购总金额
                        obj.purchaseamount = obj.purchaseqty*obj.currentprice;
                        // 通知数量默认等于到货数量
                        obj.noticeqty = obj.purchaseqty;
                        // 可通知数量默认等于到货数量
                        obj.cannoticeqty = obj.purchaseqty;
                        // 如果通知数量大于可通知数量,通知超额数量等于通知数量-可通知数量,否则为0
                        obj.cannoticediff = 0;   // 默认为0
                    });
                }
            });

        };

        /**
         * 保存采购通知单
         * @constructor
         */
        var savePurchase = function (scope,data) {
            var url = "/Purchase/PurchaseNoticeOrder/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id":data.Id?data.Id:'00000000-0000-0000-0000-000000000000',
                    "Code":data.Code,
                    "CreateDate":data.CreateDate?data.CreateDate:'0001-01-01 00:00:00',
                    "PurchaseOrderId": data.PurchaseOrderId,
                    "PurchaseOrderCode": data.PurchaseOrderCode,
                    "WarehouseId": data.WarehouseId,
                    "WarehouseName": data.WarehouseName,
                    "Status": data.Status?data.Status:0,
                    "Remark": data.Remark,
                    "CreateUserName":data.CreateUserName,
                    "Details": scope.tableData,
                    "ArriveBatchNo": data.ArriveBatchNo,
                    "VirtualWarehouseId": data.VirtualWarehouseId,
                    "VirtualWarehouseName": data.VirtualWarehouseName,
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
            "purchaseDetail": purchaseDetail,
            "savePurchase": savePurchase,
            "purchaseGet": purchaseGet,
            "purchaseOrderDetail": purchaseOrderDetail,
            "warehouseGet": warehouseGet,
            "VirtualWarehouseGet": VirtualWarehouseGet
        };

    }]);