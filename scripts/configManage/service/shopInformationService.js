/**
 * Created by xs on 2017/4/20.
 */
angular.module("klwkOmsApp")
    .factory('shopInformationService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#shopInformation";
        /**
         * 获取店铺列表
         */
        var query = function(scope) {
            var url = "/BasicInformation/Store/GetNew";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.324",
                    "SeletedCount": 0,
                    "Data": [],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //配置分页插件 数据总条数
                    scope.paginationConf.totalItems = res.total;
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //店铺性质根据id匹配name
                        if(obj.storetype !== undefined){
                            obj.storetypename = APP_MENU.storeNature[obj.storetype];
                        }
                        //平台类型根据id匹配name
                        if(obj.platformtype !== undefined){
                            obj.platformtypename = currentService.allPlatformType[obj.platformtype].name;
                        }
                        //平台接口根据id匹配name
                        if(obj.interfaceid !== undefined){
                            if(currentService.allPlatformInterface[obj.interfaceid]){
                                obj.interfacename = currentService.allPlatformInterface[obj.interfaceid].name;
                            }else {
                                obj.interfacename = '未知数据';
                            }
                        }
                        //storeSetting属性为{}时则未初始化店铺设置
                        if($.isEmptyObject(obj.storeSetting)){
                            obj.isset = false;
                        }else{
                            obj.isset = true;
                        }
                    });
                    //当前页是否有未初始化设置的店铺
                    scope.isAllSet = true;
                    $.each(scope.tableList,function (index, obj) {
                        if(obj.isset == false){
                            scope.isAllSet = false;
                            return false;
                        }
                    })
                }
            });
        };
        /**
         * 获取平台接口 缓存到服务
         */
        var queryPlatformInterface = function(scope,deffer) {
            var url = "/BasicInformation/PlatformInterface/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allPlatformInterface = klwTool.arrayToJson(res.data,"id");
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
        /**
         * 启用
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/Store/Enable";
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
            var url = "/BasicInformation/Store/Disable";
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
         * 保存基础设置
         */
        var saveStoreSetting = function (scope) {
            var url = "/BasicInformation/StoreSetting/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem.storeSetting)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '设置成功',time : 1000});
                    $(pageId + " #shopSetModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 获取仓库选框
         */
        var getWarehouse = function (scope,deffer) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 2,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    currentService.allWarehouse = res.data;
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
        /**
         * 获取配货模板选框
         */
        var getDispatchTemplate = function (scope,deffer) {
            var url = "/BasicInformation/DispatchTemplate/Get";
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
                    currentService.allDispatchTemplate = res.data;
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
            //缓存所有平台接口
            "allPlatformInterface" : {},
            //缓存所有仓库
            "allWarehouse" : {},
            //缓存所有配货模板
            "allDispatchTemplate" : {},
            //缓存所有平台类型
            "allPlatformType" : {}
        };

        currentService["query"] = query;
        currentService["enabledItem"] = enabledItem;
        currentService["disabledItem"] = disabledItem;
        currentService["queryPlatformInterface"] = queryPlatformInterface;
        currentService["saveStoreSetting"] = saveStoreSetting;
        currentService["getWarehouse"] = getWarehouse;
        currentService["getDispatchTemplate"] = getDispatchTemplate;
        currentService["getPlatformType"] = getPlatformType;

        return currentService;

    }]);