/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('modifyInventoryService', ["ApiService", function (ApiService) {

        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 修改库存扣减方式
         * @constructor
         */
        var modifyInventory = function (scope) {
            var url = "/Product/Distribution/UpdateDeductions";
            var param = $.extend({
                "storeid":scope.param.store.id,
                "type":scope.reduceStyle,
                "isdis":true,
                "details":JSON.stringify(scope.param.obj)
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if(res.success){
                    scope.goBack();
                } else {
                    alert(res.errorMessage);
                }

            });
        };

        return {
            "modifyInventory": modifyInventory
        };

    }]);