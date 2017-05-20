/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('inOrderDetailsService', ["ApiService","$q",function(ApiService){

        /**
         * 获取商品明细
         */
        var getStorageOrderDetail = function (__scope__){
            var url = "/Inventory/StorageOrderDetail/Query";
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageOrderId",
                    "Name": "StorageOrderId",
                    "Value": __scope__.inOrderDetailObj.id,
                    "Children": []
                }
            ]);

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.theadListGoods = res.data;
                }
            });
        };


        /**
         * 操作日志
         */
        var getStorageOrderLog = function(__scope__){
            var url = "/Inventory/StorageOrderLog/Query";
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageOrderId",
                    "Name": "StorageOrderId",
                    "Value": __scope__.inOrderDetailObj.id,
                    "Children": []
                }
            ]);

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableListLog = res.data;
                }
            });
        };


        var currentService ={
            "getStorageOrderDetail" : getStorageOrderDetail,
            "getStorageOrderLog" : getStorageOrderLog
        };

        return currentService;

    }]);