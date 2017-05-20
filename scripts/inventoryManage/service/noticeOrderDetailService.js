/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('noticeOrderDetailService', ["ApiService", function (ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();


        /**
         * 调拨通知单明细
         */
        var getTransferDetail = function (scope) {
            var url = "/Inventory/AllocationOutDetail/Query ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "AllocationOutCode",
                    "Name": "AllocationOutCode",
                    "Value": scope.params.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListInfo = res.data;
                }
            });
        };

        /**
         * 操作日志
         */
        var getTransferLog = function (scope) {
            var url = "/Inventory/AllocationOutLog/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "AllocationOutCode",
                    "Name": "AllocationOutCode",
                    "Value": scope.params.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListLog = res.data;
                }
            });
        };

        return {
            "getTransferDetail": getTransferDetail,
            "getTransferLog": getTransferLog
        };

    }]);
