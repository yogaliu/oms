/**
 * Created by cj on 2017/4/6.
 */
angular.module("klwkOmsApp")
    .factory('purchaseListService', ["ApiService", "APP_MENU","toolsService", function (ApiService, APP_MENU,toolsService) {
        var pageId = '#purchaseList';   //页面Id
        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 收货仓库
         * @constructor
         */
        var getWarehouse = function (scope) {
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
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        // 默认显示
                        obj.isHide = false;
                    });
                    scope.warehouseData = res.data;
                    // 店铺数据数据转换(A,B,C...)
                    scope.singleWordData = toolsService.setDataShowType(scope,res.data,[],6);
                }
            });
        };

        /**
         * 采购订单
         * @constructor
         */
        var query = function (scope, PageIndex, PageSize, data) {
            var url = "/Purchase/PurchaseOrder/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": 0,
                    "Data": !data ? [] : [{
                        // 开始时间
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "BeginDate",
                        "Name": "PurchaseDate",
                        "Value": scope.searchItem.beginDate,
                        "Children": []
                    }, {
                        // 结束时间
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "EndDate",
                        "Name": "PurchaseDate",
                        "Value": scope.searchItem.endDate,
                        "Children": []
                    }, {
                        // 收货仓库
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseID",
                        "Name": "WarehouseID",
                        "Value": scope.searchItem.warehouseid,
                        "Children": []
                    }, {
                        // 采购单号
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.searchItem.code,
                        "Children": []
                    }, {
                        // 商品编码
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductCode",
                        "Name": "ProductCode",
                        "Value": scope.searchItem.productCode,
                        "Children": []
                    }, {
                        // 合同号
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ContractNo",
                        "Name": "ContractNo",
                        "Value": scope.searchItem.contractNo,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {

                if (res.success) {
                    //列表数据
                    scope.tableList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index, obj) {
                        //状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.purchaseOrderStatus[obj.status];
                        }
                        //到货状态状态根据id匹配name
                        if (obj.arrivalstatus !== undefined) {
                            obj.arrivalstatusname = APP_MENU.purchaseArrivalStatus[obj.arrivalstatus];
                        }
                    });
                }
            });

        };

        /**
         * 审核
         * @constructor
         */
        var audit = function (scope) {
            var url = "/Purchase/PurchaseOrder/Approval";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #auditModal').modal('hide');
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                }
            });
        };

        /**
         * 作废
         * @constructor
         */
        var cancel = function (scope) {
            var url = "/Purchase/PurchaseOrder/Obsolete";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #cancelModal').modal('hide');
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                }

            });
        };

        /**
         * 完结
         * @constructor
         */
        var end = function (scope) {
            var url = "/Purchase/PurchaseOrder/Complete";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #endModal').modal('hide');
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                }
            });
        };

        /**
         * 调整货期
         * @constructor
         */
        var adjustTime = function (scope) {
            if (scope.arrivalTime) {
                var url = "/Purchase/PurchaseOrder/Save";
                var param = $.extend({
                    body: JSON.stringify($.extend({
                        'Details': scope.purchaseDetail,
                        'Logs': scope.purchaseLog,
                        'DeliveryDateAdjustment': scope.arrivalTime
                    }, scope.activeItem))
                }, paramObj);
                var promise = ApiService.post(url, param);
                promise.then(function (res) {
                    if (res.success) {
                        $(pageId + ' #adjustModal').modal('hide');
                        query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                    }
                });
            }
        };

        /**
         * 采购订单详情
         * @constructor
         */
        var purchaseDetail = function (scope,type) {
            var url = "/Purchase/PurchaseOrderDetail/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.purchaseDetail = res.data;
                    if(type == 'print') {
                        // 采购日期,默认当前时间
                        scope.activeItem.date = new Date().format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                        // 打印内容
                        scope.printList1 = [
                            {'name':'订单编号','tag':scope.activeItem.code},
                            {'name':'供应商名称','tag':scope.activeItem.suppliername},
                            {'name':'订货日期','tag':scope.activeItem.date},
                            {'name':'采购人','tag':scope.activeItem.purchasepersonname},
                            {'name':'物流费用模式','tag':'cost'},
                            {'name':'供应商省份'},
                            {'name':'付款信息'},
                            {'name':'支付宝'},
                            // 占位符
                            {'name':''},
                            {'name':'备注','tag':scope.activeItem.remark}
                        ];
                        // 打印内容
                        scope.printList2 = [
                            {'name':'运费'},
                            {'name':'发货要求'},
                            {'name':'其他事项'}
                        ];
                        scope.initFunc = function () {
                            // 打印
                            $("#printPurchase").print();
                        };

                    }
                }
            });
        };

        /**
         * 采购订单操作日志
         * @constructor
         */
        var purchaseLog = function (scope) {
            console.log(scope.activeItem);
            var url = "/Purchase/PurchaseOrderLog/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.purchaseLog = res.data;
                }
            });
        };


        return {
            "query": query,
            "getWarehouse": getWarehouse,
            "audit": audit,
            "cancel": cancel,
            "end": end,
            "adjustTime": adjustTime,
            "purchaseDetail": purchaseDetail,
            "purchaseLog": purchaseLog
        };

    }]);