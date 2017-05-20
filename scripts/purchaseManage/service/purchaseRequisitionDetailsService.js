/**
 * Created by cj on 2017/4/7.
 */
angular.module("klwkOmsApp")
    .factory('purchaseRequisitionDetailService', ["ApiService", function (ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购通知单详情
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
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableListInfo = res.data;
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
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.tableListLog = res.data;
                }
            });
        };

        return {
            "purchaseDetail": purchaseDetail,
            "operationLog": operationLog
        };

    }]);