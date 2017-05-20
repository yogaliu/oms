/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addReturnGoodsBillService", ["ApiService", function (ApiService) {


        /**
         * 查询店铺
         * @param __scope__
         * @constructor
         */
        var StoreGet = function (__scope__) {
            var url = "/BasicInformation/Store/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                __scope__.storeObj = res.data;

            }, function (res) {

            });
        };


        // public api
        return {
            "StoreGet": StoreGet
        };

    }]);