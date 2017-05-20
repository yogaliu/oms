/**
 * Created by cj on 2017/4/7.
 */
angular.module("klwkOmsApp")
    .factory('purchaseOrderDetailService', ["ApiService", function (ApiService) {
         //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购详情
         * @constructor
         */
        var purchaseDetail = function (scope) {
            var url = "/Purchase/PurchaseOrderDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value": scope.formData.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableListInfo = res.data;
                    // 通过采购数量和采购单价计算采购总价
                    $.each(scope.tableListInfo, function (index,obj) {
                        if(obj.currentprice === undefined) {
                            obj.purchaseallprice = 0;
                        } else {
                            obj.purchaseallprice = obj.purchaseqty*obj.currentprice;
                        }
                    });
                }
            });

        };

        /**
         * 操作日志
         * @constructor
         */
        var operationLog = function (scope) {
            var url = "/Purchase/PurchaseOrderLog/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PurchaseOrderId",
                    "Name": "PurchaseOrderId",
                    "Value":  scope.formData.id,
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
            "operationLog":operationLog
        };

    }]);