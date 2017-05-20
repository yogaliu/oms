/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .factory('materialTransferService', ["ApiService", "APP_MENU", "toolsService", "$q", function (ApiService, APP_MENU, toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 调拨类型
         */
        var transferType = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Get";
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
                    "Field": "ClassiFicationType",
                    "Name": "ClassiFicationType",
                    "Value": 17,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.typeData = res.data;
                }
            });
        };

        /**
         * 仓库
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
                    $.each(res.data,function (index, obj) {
                        // 默认显示
                        obj.isHide = false;
                    });
                    // 调入仓库
                    scope.warehouseInData = $.extend([],res.data);
                    // 调入仓库数据数据转换(A,B,C...)
                    scope.singleWordInData = toolsService.setDataShowType(scope,$.extend([],res.data),[], 6);
                    // 调出仓库
                    scope.warehouseOutData = $.extend([],res.data);
                    // 调入仓库数据数据转换(A,B,C...)
                    scope.singleWordOutData = toolsService.setDataShowType(scope,$.extend([],res.data),[], 6);
                }
            });
        };

        /**
         * 实物调拨
         */
        var query = function (scope, PageIndex, PageSize, data) {
            var url = "/Inventory/AllocationPlan/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "Timespan": "00:00:00.338", //丢弃
                    "SeletedCount": 0, //丢弃
                    "Data": !data ? [] : [{
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
                            // 单据状态
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Status",
                            "Name": "Status",
                            "Value": scope.searchItem.status,
                            "Children": []
                        },{
                            // 调拨类型
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "AllocationTypeCode",
                            "Name": "AllocationTypeCode",
                            "Value": scope.searchItem.allocationCode,
                            "Children": []
                        },{
                            // 调入仓库
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "InWarehouseId",
                            "Name": "InWarehouseId",
                            "Value": scope.searchItem.inWarehouseId,
                            "Children": []
                        }, {
                            // 调出仓库
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "OutWarehouseId",
                            "Name": "OutWarehouseId",
                            "Value": scope.searchItem.outWarehouseId,
                            "Children": []
                        },{
                            // 计划单号
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Code",
                            "Name": "Code",
                            "Value": scope.searchItem.code,
                            "Children": []
                        }, {
                            // 商品编码
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ProductCode",
                            "Name": "ProductCode",
                            "Value": scope.searchItem.productCode,
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
                    // 总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index, obj) {
                        // 商品状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.inventoryPracticality[obj.status];
                        }
                    });
                }
            });
        };

        /**
         * 实物调拨审核
         * @constructor
         */
        var audit = function (scope) {
            var url = "/Inventory/AllocationPlan/Audit";
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
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                }
            });
        };

        /**
         * 实物调拨反审
         * @constructor
         */
        var againAudit = function (scope) {
            var url = "/Inventory/AllocationPlan/AntiAudit";
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
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }

            });
        };

        /**
         * 通知单是否终止
         * @constructor
         */
        var noticeEnd = function (scope) {
            var url = "/Inventory/AllocationPlan/AbnormalEnd";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": scope.activeItem.code,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    end(scope);
                }
            });
        };

        /**
         * 实物调拨终止
         * @constructor
         */
        var end = function (scope) {
            var url = "/Inventory/AllocationPlan/AbnormalEnd";
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
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                }

            });
        };


        return {
            "transferType": transferType,
            "query": query,
            "getWarehouse": getWarehouse,
            "audit": audit,
            "againAudit": againAudit,
            "noticeEnd": noticeEnd,
            "end": end
        };

    }]);