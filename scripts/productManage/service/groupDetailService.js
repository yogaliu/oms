/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('groupDetailService', ["ApiService", function (ApiService) {

        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 套装详情
         * @constructor
         */
        var groupDetail = function (scope) {
            var url = "/Product/CombinedProductDetail/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CombinedProductId",
                    "Name": "CombinedProductId",
                    "Value": scope.formData.skuid,
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
        var operateLog = function (scope) {
            var url = "/Product/CombinedProductLog/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CombinedProductId",
                    "Name": "CombinedProductId",
                    "Value": scope.formData.skuid,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListLog = res.data;
                }
            });
        };


        return {
            "groupDetail": groupDetail,
            "operateLog": operateLog
        };

    }]);