/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('virtualTransferService', ["ApiService", "APP_MENU", "toolsService", "$q",
        function (ApiService, APP_MENU, toolsService) {
            var pageId = "#virtualTransfer";   //页面id
            //获取身份验证
            var paramObj = ApiService.getBasicParamobj();

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
                        $.each(res.data, function (index, obj) {
                            // 默认显示
                            obj.isHide = false;
                        });
                        // 调入仓库
                        scope.warehouseInData = $.extend([], res.data);
                        // 调入仓库数据数据转换(A,B,C...)
                        scope.singleWordInData = toolsService.setDataShowType(scope, $.extend([], res.data), [], 6);
                        // 调出仓库
                        scope.warehouseOutData = $.extend([], res.data);
                        // 调入仓库数据数据转换(A,B,C...)
                        scope.singleWordOutData = toolsService.setDataShowType(scope, $.extend([], res.data), [], 6);
                    }
                });
            };

            /**
             * 虚拟调拨
             */
            var query = function (scope, PageIndex, PageSize, data) {
                var url = "/Inventory/VirtualWarehouseTransfer/Query";
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
                            }, {
                                // 单据状态
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.searchItem.status,
                                "Children": []
                            }, {
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
                            }, {
                                // 调拨单号
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.searchItem.code,
                                "Children": []
                            }, {
                                //商品编码
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
                            // 单据状态根据id匹配name
                            if (obj.status !== undefined) {
                                obj.statusname = APP_MENU.inventoryFictitious[obj.status];
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
                var url = "/Inventory/VirtualWarehouseTransfer/Audit";
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

            return {
                "getWarehouse": getWarehouse,
                "query": query,
                "audit": audit
            };

        }]);