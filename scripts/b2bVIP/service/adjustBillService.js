/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("adjustBillService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {

        /**
         * 查询配货单列表数据
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipStockAdjustOrder/Query";
            var data = [];
            //搜索条件
            if (__scope__.searchForm.productcode !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.productcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.scheduleCode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleCode",
                    "Name": "ScheduleCode",
                    "Value": __scope__.searchForm.scheduleCode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.stockadjustordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StockAdjustOrderCode",
                    "Name": "StockAdjustOrderCode",
                    "Value": __scope__.searchForm.stockadjustordercode,
                    "Children": []
                };
                data.push(obj);
            }
            var paramObj = ApiService.getBasicParamobj();
            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "Timespan": "00:00:00.221",
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i, obj) {
                    //状态
                    if (obj.status) {
                        obj.statusName = APP_MENU.CITadjustmentStatus[obj.status];
                    }
                    //调整原因
                    if (obj.adjustreasontype!=undefined) {
                        obj.adjustreasontypeName = APP_MENU.CITadjustmentReason[obj.adjustreasontype];
                    }
                    //调整类型
                    if (obj.adjusttype!=undefined) {
                        obj.adjusttypeName = APP_MENU.CITadjustmentType[obj.adjusttype];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 审核
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderAudit = function (__scope__, obj) {
            var url = "/VipOrder/VipStockAdjustOrder/Audit";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(obj.id);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('审核成功');
                    VipStockAdjustOrderQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false)
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 禁用
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderDisabled = function (__scope__, obj) {
            var url = "/VipOrder/VipStockAdjustOrder/Disabled";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": obj.id,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('禁用成功');
                    VipStockAdjustOrderQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false)
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "VipStockAdjustOrderQuery": VipStockAdjustOrderQuery,
            "VipStockAdjustOrderAudit": VipStockAdjustOrderAudit,
            "VipStockAdjustOrderDisabled": VipStockAdjustOrderDisabled
        };


    }]);