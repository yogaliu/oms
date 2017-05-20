/**
 * Created by xs on 2017/4/14.
 */
angular.module("klwkOmsApp")
    .factory('downloadConfigService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#downloadConfig";
        /**
         * 获取表格数据
         */
        var query = function(scope) {
            var url = "/BasicInformation/DownloadConfig/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //下载类型过滤
                        if(obj.downloadtype !== undefined){
                            obj.downloadtypename = APP_MENU.downloadType[obj.downloadtype];
                        }
                        //平台类型过滤
                        if(obj.platformtype !== undefined){
                            obj.platformtypename = currentService.allPlatformType[obj.platformtype].name;
                        }
                    });
                }
            });
        };
        /**
         * 新增&修改时 获取店铺选项
         */
        var getStore = function (scope,type) {
            var url = "/BasicInformation/Store/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.storeList.info = res.data;
                    if(type == 'edit'){
                        scope.storeList.setValue({id:scope.activeItem.storeid});
                    }else if(type == 'creat'){
                        scope.storeList.init();
                    }
                }
            });
        };
        /**
         * 新增&修改
         */
        var newItem = function (scope) {
            var url = "/BasicInformation/DownloadConfig/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
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
        /**
         * 启用
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/DownloadConfig/Enable";
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
         * 禁用
         */
        var disabledItem = function (scope,type) {
            var url = "/BasicInformation/DownloadConfig/Disable";
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
         * 获取所有平台类型 缓存到服务
         */
        var getPlatformType = function (deffer) {
            var url = "/BasicInformation/PlatformType/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
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
            });
        };

        var currentService = {
            //存储所有平台类型 用于过滤字段
            "allPlatformType" : {}
        };

        currentService["query"] = query;
        currentService["newItem"] = newItem;
        currentService["getStore"] = getStore;
        currentService["enabledItem"] = enabledItem;
        currentService["disabledItem"] = disabledItem;
        currentService["getPlatformType"] = getPlatformType;

        return currentService;
    }]);