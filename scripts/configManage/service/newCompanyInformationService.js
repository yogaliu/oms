/**
 * Created by xs on 2017/4/15.
 */
angular.module("klwkOmsApp")
    .factory('newCompanyInformationService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newCompanyInformation";
        /**
         * 保存
         */
        var saveCompany = function (scope) {
            var url = "/BasicInformation/Company/Save";
            var param = $.extend({
                body: JSON.stringify(scope.creatObj)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.back();
                }
            });
        };


        return {
            "saveCompany" : saveCompany
        };

    }]);