/**
 * Created by xs on 2017/4/26.
 */
angular.module("klwkOmsApp")
    .factory('newExpressInformationService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newExpressInformation";


        /**
         * 保存
         */
        var save = function(scope) {
            var url = "/BasicInformation/Express/Save";
            var param = $.extend({
                body: JSON.stringify(scope.currentItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.goBack();
                }
            });
        };




        var currentService = {
            //存储所有仓库 用于配置仓库选项
            "allWarehouse" : {}
        };

        currentService["save"] = save;

        return currentService;

    }]);