/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('newSmsAccountService', ["ApiService","toolsService", function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        /**
         * 新增短信账号
         */
        var newSmsAccount = function (scope){
            var url = "/BasicInformation/SMS/Account/Save";
            paramObj.body = JSON.stringify(scope.formData);
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    scope.cancle();
                }
            });
        };
        return {
            "newSmsAccount" : newSmsAccount
        };

    }]);