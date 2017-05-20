/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('returnRequisitionDetailService', ["ApiService", function (ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购退货单详情
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
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
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
            var url = "/Purchase/PurchaseReturnOrderLog/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseReturnOrderId",
                    "Name": "PurchaseReturnOrderId",
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
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