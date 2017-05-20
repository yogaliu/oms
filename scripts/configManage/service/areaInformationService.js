/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .factory('areaInformationService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#areaInformation";
        /**
         * 查询区域信息
         */
        var query = function(scope) {
            var url = "/BasicInformation/Region/Get";
            var promise = ApiService.postLoad(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.classifyList = new originArrayToTreeData(res.data);
                }
            });
        };
        /**
         * 新增&新增第一级&修改
         */
        var creatArea = function (scope) {
            var url = "/BasicInformation/Region/Save";
            var param = $.extend({
                body: JSON.stringify(scope.creatItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #creatModal").modal('hide');
                    query(scope);
                }
            });
        };

        var currentService = {};

        currentService["query"] = query;
        currentService["creatArea"] = creatArea;

        return currentService;

    }]);