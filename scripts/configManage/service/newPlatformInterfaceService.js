/**
 * Created by xs on 2017/4/15.
 */
angular.module("klwkOmsApp")
    .factory('newPlatformInterfaceService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newPlatformInterface";
        /**
         * 保存-新增平台接口
         */
        var savePlatformInterface = function (scope) {
            var url = "/BasicInformation/PlatformInterface/Save";
            var param = $.extend({
                body: JSON.stringify(scope.platformObj)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.back();
                }
            });
        };
        /**
         * 保存-新增物流接口
         */
        var saveLogisticsInterface = function (scope) {
            var url = "/BasicInformation/LogisticsInterface/Save";
            var param = $.extend({
                body: JSON.stringify(scope.logisticsObj)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.back();
                }
            });
        };
        /**
         * 保存-新增服务接口
         */
        var saveServiceInterface = function (scope) {
            var url = "/BasicInformation/ServiceInterface/Save";
            var param = $.extend({
                body: JSON.stringify(scope.serviceObj)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.back();
                }
            });
        };
        /**
         * 获取所有平台类型 新增&修改平台接口 平台类型选项
         */
        var getPlatformType = function (scope) {
            var url = "/BasicInformation/PlatformType/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    if(res.success){
                        var list = res.data;
                        $.each(list,function (index, obj) {
                            obj.id = obj.value;
                        });
                        //平台类型下拉组件 选项赋值
                        scope.platformtypeList.info = list;
                        if(scope.params.oprate == 'edit'){
                            scope.platformtypeList.setValue({id:scope.platformObj.platformtype});
                        }
                    }
                }
            });
        };

        return {
            "savePlatformInterface" : savePlatformInterface,
            "saveLogisticsInterface" : saveLogisticsInterface,
            "saveServiceInterface" : saveServiceInterface,
            "getPlatformType" : getPlatformType
        };

    }]);