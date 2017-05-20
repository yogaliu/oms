/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('purchaseRequisitionListService', ["ApiService", "APP_MENU","toolsService",
        function (ApiService, APP_MENU,toolsService) {
        var pageId = '#purchaseRequisitionList';   // 页面Id
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购通知单信息
         * @constructor
         */
        var query = function (scope, PageIndex, PageSize, data) {
            var url = "/Purchase/PurchaseNoticeOrder/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": '',
                    "Data": !data ? [] : [
                        {
                            // 开始时间
                            "OperateType": 3,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "BeginDate",
                            "Name": "BeginDate",
                            "Value": scope.searchItem.beginDate,
                            "Children": []
                        },
                        {
                            // 结束时间
                            "OperateType": 5,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "EndDate",
                            "Name": "EndDate",
                            "Value": scope.searchItem.endDate,
                            "Children": []
                        },{
                            // 采购单号
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PurchaseOrderCode",
                            "Name": "PurchaseOrderCode",
                            "Value": scope.searchItem.purchaseCode,
                            "Children": []
                        },
                        {
                            // 入库单号
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Code",
                            "Name": "Code",
                            "Value": scope.searchItem.code,
                            "Children": []
                        },
                        {
                            // 商品编码
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ProductCode",
                            "Name": "ProductCode",
                            "Value": scope.searchItem.productCode,
                            "Children": []
                        },
                        {
                            // 收货仓库
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "WarehouseID",
                            "Name": "WarehouseID",
                            "Value": scope.searchItem.Warehouseid,
                            "Children": []
                        },
                        {
                            // 到货状态
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ArrivalStatus",
                            "Name": "ArrivalStatus",
                            "Value": scope.searchItem.arrivalStatus,
                            "Children": []
                        },
                        {
                            // 到货批次号
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ArriveBatchNo",
                            "Name": "ArriveBatchNo",
                            "Value": scope.searchItem.arriveBatchNo,
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
                    //列表数据
                    scope.tableList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index, obj) {
                        //状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.purchaseNoticeStatus[obj.status];
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
            var promise = ApiService.post(url,param);
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
         * 采购订单审核
         * @constructor
         */
        var audit = function (scope) {
            var url = "/Purchase/PurchaseNoticeOrder/Approval";
            var param = $.extend({
                body:JSON.stringify($.extend({
                    'Details': scope.purchaseDetail,
                    'Logs': scope.purchaseLog
                }, scope.activeItem))
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #auditModal').modal('hide');
                    requisitionQuery(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 采购订单取消单据
         * @constructor
         */
        var cancel = function (scope) {
            var url = "/Purchase/PurchaseNoticeOrder/Cancel";
            var param = $.extend({
                body:JSON.stringify($.extend({
                    'Details': scope.purchaseDetail,
                    'Logs': scope.purchaseLog
                }, scope.activeItem))
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #cancelModal').modal('hide');
                    requisitionQuery(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 采购通知单详情
         * @constructor
         */
        var purchaseDetail = function (scope,type) {
            var url = "/Purchase/PurchaseNoticeOrderDetail/Query ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseNoticeOrderId",
                    "Name": "PurchaseNoticeOrderId",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.purchaseDetail = res.data;
                    if(type == 'print') {
                        // 采购日期,默认当前时间
                        scope.activeItem.date = new Date().format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                        // 采购人
                        scope.activeItem.purchasename = paramObj.UserName;
                        // 打印内容
                        scope.printList = [
                            {'name':'公司','tag':scope.activeItem.company},
                            {'name':'采购单号','tag':scope.activeItem.purchaseordercode},
                            {'name':'供应商','tag':scope.activeItem.suppliername},
                            {'name':'合同号','tag':scope.activeItem.purchasename},
                            {'name':'入库单号','tag':scope.activeItem.code},
                            {'name':'入库日期','tag':scope.activeItem.createdate}
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
         * 操作日志
         * @constructor
         */
        var operationLog = function (scope) {
            var url = "/Purchase/PurchaseNoticeOrderLog/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseNoticeOrderId",
                    "Name": "PurchaseNoticeOrderId",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.purchaseLog = res.data;
                }
            });
        };

        return {
            "warehouseGet": warehouseGet,
            "query": query,
            "audit": audit,
            "cancel": cancel,
            "purchaseDetail": purchaseDetail,
            "operationLog": operationLog
        };

    }]);