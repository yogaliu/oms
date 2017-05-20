/**
 * Created by xs on 2017/4/26.
 */
angular.module("klwkOmsApp")
    .factory('expressInformationService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#expressInformation";
        /**
         * 获取快递列表
         */
        var query = function(scope) {
            var url = "/BasicInformation/Express/Query";
            var condition = [];
            //搜索条件 快递编码
            if(scope.formData.code !== ''){
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": scope.formData.code,
                    "Children": []
                };
                condition.push(obj);
            }
            //搜索条件 快递名称
            if(scope.formData.name !== ''){
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Name",
                    "Name": "Name",
                    "Value": scope.formData.name,
                    "Children": []
                };
                condition.push(obj);
            }
            //筛选 禁用
            if(scope.formData.isdisabled !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": scope.formData.isdisabled,
                    "Children": []
                };
                condition.push(obj);
            }
            //筛选 支持货到付款
            if(scope.formData.iscancod !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsCanCod",
                    "Name": "IsCanCod",
                    "Value": scope.formData.iscancod,
                    "Children": []
                };
                condition.push(obj);
            }
            //筛选 仅支持货到付款
            if(scope.formData.isonlycancod !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsOnlyCanCod",
                    "Name": "IsOnlyCanCod",
                    "Value": scope.formData.isonlycancod,
                    "Children": []
                };
                condition.push(obj);
            }
            //筛选 支持云栈电子面单
            if(scope.formData.isusecloudsstack !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsUseCloudsStack",
                    "Name": "IsUseCloudsStack",
                    "Value": scope.formData.isusecloudsstack,
                    "Children": []
                };
                condition.push(obj);
            }
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.112",
                    "SeletedCount": 0,
                    "Data": condition,
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
                    //默认查询第一项的关联平台
                    if(scope.tableList.length > 0){
                        scope.currentIndex = 0;
                        scope.queryItem = $.extend({},scope.tableList[0]);
                        queryExpressPlatform(scope);
                    }else{
                        scope.righttableList = [];
                    }
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //快递类型 根据id匹配name
                        if(obj.expresstype !== undefined){
                            obj.expresstypename = APP_MENU.expressType[obj.expresstype];
                        }
                    });
                }
            });
        };
        /**
         * 获取关联平台
         */
        var queryExpressPlatform = function(scope) {
            var url = "/BasicInformation/ExpressPlatform/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ExpressId",
                    "Name": "ExpressId",
                    "Value": scope.queryItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.righttableList = res.data;
                    $.each(scope.righttableList,function (index, obj) {
                        //平台名称 根据id匹配name
                        if(obj.platformtype !== undefined){
                            obj.platformtypename = currentService.allPlatformTypeFilter[obj.platformtype].name;
                        }
                    });
                }
            });
        };
        /**
         * 新增&修改关联平台之前判断平台是否已存在 已存在不添加
         */
        var isExpressPlatformExsits = function(scope) {
            var url = "/BasicInformation/ExpressPlatform/Exists";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ExpressId",
                    "Name": "ExpressId",
                    "Value": scope.queryItem.id,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PlatformType",
                    "Name": "PlatformType",
                    "Value": scope.activeRightItem.platformtype,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    if(res.data){
                        toolsService.alertMsg({content : '该平台已经存在, 请选择其他平台!',time : 1000});
                    }else{
                        creatExpressPlatform(scope);
                    }
                }
            });
        };
        /**
         * 新增&修改关联平台
         */
        var creatExpressPlatform = function(scope) {
            var url = "/BasicInformation/ExpressPlatform/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeRightItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #editRightModal").modal('hide');
                    queryExpressPlatform(scope);
                }
            });
        };
        /**
         * 删除关联平台
         */
        var deleteExpressPlatform = function(scope) {
            var url = "/BasicInformation/ExpressPlatform/Delete";
            var ids = [];
            ids.push(scope.activeRightItem.id);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    queryExpressPlatform(scope);
                }
            });
        };
        /**
         * 启用快递
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/Express/Enable";
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
         * 禁用快递
         */
        var disabledItem = function (scope,type) {
            var url = "/BasicInformation/Express/Disable";
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
                    currentService.allPlatformType = res.data;
                    currentService.allPlatformTypeFilter = klwTool.arrayToJson(res.data,'value');
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
            //存储所有平台类型 用于配置下拉选框
            "allPlatformType" : {},
            //存储所有平台类型 用于过滤字段
            "allPlatformTypeFilter" : {}
        };

        currentService["query"] = query;
        currentService["queryExpressPlatform"] = queryExpressPlatform;
        currentService["enabledItem"] = enabledItem;
        currentService["disabledItem"] = disabledItem;
        currentService["creatExpressPlatform"] = creatExpressPlatform;
        currentService["isExpressPlatformExsits"] = isExpressPlatformExsits;
        currentService["getPlatformType"] = getPlatformType;
        currentService["deleteExpressPlatform"] = deleteExpressPlatform;

        return currentService;

    }]);