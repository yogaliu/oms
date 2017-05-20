/**
 * Created by xs on 2017/4/15.
 */
angular.module("klwkOmsApp")
    .factory('platformInterfaceService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#platformInterface";
        /**
         * 获取表格数据
         */
        var query = function(scope) {
            var url = "/BasicInformation/PlatformInterface/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //平台名称 过滤字段
                        if(obj.platformtype !== undefined){
                            obj.platformtypename = currentService.allPlatformType[obj.platformtype].name;
                        }
                    });
                }
            });
        };
        /**
         * 删除
         */
        var deleteItem = function (scope,type) {
            var url = "/BasicInformation/PlatformInterface/Delete";
            var ids = [];
            if(type == 'single'){
                ids.push(scope.activeItem.id);
            }else if(type == 'batch'){
                //获取所有的勾选项
                $.each(scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        ids.push(obj.id);
                    }
                });
            }
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    query(scope);
                }
            });
        };
        /**
         * 刷新令牌
         */
        var refreshToken = function (scope) {
            var url = "/BasicInformation/PlatformInterface/RefreshToken";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    query(scope);
                }else {
                    toolsService.alertMsg({content : res.errorMessage ,time : 1000});
                }
            });
        };
        /**
         * 重新授权 判断是否支持在线授权
         */
        var isCanReauthorization = function (scope) {
            var url = "/BasicInformation/PlatformInterface/GETAuthorization";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.activeItem.authorizationurl = res.data;
                    $(pageId + " #reauthorizationModal").modal('show');
                }else{
                    toolsService.alertMsg({content : '此平台不支持在线授权',time : 1000});
                }
            });
        };
        /**
         * 重新授权
         */
        var saveReauthorization = function (scope) {
            var url = "/BasicInformation/PlatformInterface/RefreshAuthorization";
            var param = $.extend({
                code:scope.activeItem.reauthorizationCode,
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    $(pageId + " #reauthorizationModal").modal('hide');
                }
            });
        };
        /**
         * 获取所有平台类型 缓存到服务
         */
        var getPlatformType = function (deffer) {
            var url = "/BasicInformation/PlatformType/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    if(res.success){
                        currentService.allPlatformType = klwTool.arrayToJson(res.data,'value');
                        if(deffer !== undefined){
                            deffer.resolve();
                        }
                    }else{
                        if(deffer !== undefined){
                            deffer.reject();
                        }
                    }
                }
            });
        };

        var currentService = {
            //存储所有平台类型
            "allPlatformType" : {}
        };

        currentService["query"] = query;
        currentService["deleteItem"] = deleteItem;
        currentService["refreshToken"] = refreshToken;
        currentService["isCanReauthorization"] = isCanReauthorization;
        currentService["saveReauthorization"] = saveReauthorization;
        currentService["getPlatformType"] = getPlatformType;

        return currentService;

    }]);