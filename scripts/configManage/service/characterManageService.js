/**
 * Created by xs on 2017/4/13.
 */
angular.module("klwkOmsApp")
    .factory('characterManageService', ["ApiService","toolsService","APP_MENU",function(ApiService,toolsService,APP_MENU){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#characterManage";
        /**
         * 获取表格数据
         */
        var query = function(scope) {
            var url = "/BasicInformation/Role/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.048",
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Name",
                        "Name": "Name",
                        "Value": scope.formData.name,
                        "Children": []
                    }, {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.formData.code,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsSystem",
                        "Name": "IsSystem",
                        "Value": false,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    //配置分页插件 数据总条数
                    scope.paginationConf.totalItems = res.total;
                }
            });
        };
        /**
         * 新增&修改
         */
        var newItem = function (scope) {
            var url = "/BasicInformation/Role/Save";
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
        /**
         * 获取店铺权限
         */
        var getStorePrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Role";
            var param = $.extend({
                "RoleId":scope.activeItem.id,
                "Type":"Store"
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.storePrivilege = klwTool.arrayToJson(res.data,'objectid');
                    getStore(scope);
                }
            });
        };
        /**
         * 获取所有店铺
         */
        var getStore = function (scope) {
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
                    scope.allStore = res.data;
                    $.each(scope.allStore,function (index, obj) {
                        //默认店铺未勾选
                        obj.isdatacheck = false;
                        //过滤字段 平台类型
                        if(obj.platformtype !== undefined){
                            obj.platformtypename = currentService.allPlatformType[obj.platformtype].name;
                        }
                        if(scope.storePrivilege[obj.id]){
                            scope.hasCheckList.push(obj);
                        }else{
                            scope.noCheckList.push(obj);
                        }
                    })
                }
            });
        };
        /**
         * 保存店铺权限
         */
        var saveStorePrivilege = function (scope,list) {
            var url = "/BasicInformation/Privilege/Save";
            var param = $.extend({
                "OperateId":scope.activeItem.id,
                "PrivilegeType":"Store",
                "body": JSON.stringify(list)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #shopPermissionModal").modal('hide');
                }
            });
        };
        /**
         * 获取仓库权限
         */
        var getWarehousePrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Role";
            var param = $.extend({
                "RoleId":scope.activeItem.id,
                "Type":"Warehouse"
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.warehousePrivilege = klwTool.arrayToJson(res.data,'objectid');
                    getWarehouse(scope);
                }
            });
        };
        /**
         * 获取所有仓库
         */
        var getWarehouse = function (scope) {
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
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.allWarehouse = res.data;
                    $.each(scope.allWarehouse,function (index, obj) {
                        //默认仓库未勾选
                        obj.isdatacheck = false;
                        //过滤字段 仓库类型
                        if(obj.warehousetype !== undefined){
                            obj.warehousetypename = APP_MENU.warehouseType[obj.warehousetype];
                        }
                        //过滤字段 仓储类型
                        if(obj.storagetype !== undefined){
                            obj.storagetypename = APP_MENU.storageType[obj.storagetype];
                        }
                        if(scope.warehousePrivilege[obj.id]){
                            scope.hasCheckList.push(obj);
                        }else{
                            scope.noCheckList.push(obj);
                        }
                    })
                }
            });
        };
        /**
         * 保存仓库权限
         */
        var saveWarehousePrivilege = function (scope,list) {
            var url = "/BasicInformation/Privilege/Save";
            var param = $.extend({
                "OperateId":scope.activeItem.id,
                "PrivilegeType":"Warehouse",
                "body": JSON.stringify(list)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #warehousePermissionModal").modal('hide');
                }
            });
        };
        /**
         * 获取菜单权限
         */
        var getMenuPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Role";
            var param = $.extend({
                "RoleId":scope.activeItem.id,
                "Type":"Menu"
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.menuPrivilege = klwTool.arrayToJson(res.data,'objectid');
                    getMenu(scope);
                }
            });
        };
        /**
         * 获取所有菜单
         */
        var getMenu = function (scope) {
            var url = "/BasicInformation/Menu/GetWeb";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsSystem",
                    "Name": "IsSystem",
                    "Value": false,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    var list = [];
                    $.each(res.data,function (index, obj) {
                        if(scope.menuPrivilege[obj.id]){
                            obj.isdatacheck = true;
                        }else{
                            obj.isdatacheck = false;
                        }
                        if(obj.type !== 101){
                            list.push(obj)
                        }
                    });
                    scope.allMenu = new originArrayToTreeData(list);
                }
            });
        };
        /**
         * 保存菜单权限
         */
        var saveMenuPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Save";
            var param = $.extend({
                "OperateId":scope.activeItem.id,
                "PrivilegeType":"Menu",
                "body": JSON.stringify(scope.selectList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #menuPermissionModal").modal('hide');
                }
            });
        };
        /**
         * 获取操作权限
         */
        var getOperationPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Role";
            var param = $.extend({
                "RoleId":scope.activeItem.id,
                "Type":"Operation"
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.operationPrivilege = klwTool.arrayToJson(res.data,'objectid');
                    getOperation(scope);
                }
            });
        };
        /**
         * 获取所有操作
         */
        var getOperation = function (scope) {
            var url = "/BasicInformation/Operation/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    $.each(res.data,function (index, obj) {
                        if(scope.operationPrivilege[obj.id]){
                            obj.isdatacheck = true;
                        }else{
                            obj.isdatacheck = false;
                        }
                    });
                    scope.allOperation = new originArrayToTreeData(res.data);
                }
            });
        };
        /**
         * 保存操作权限
         */
        var saveOperationPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Save";
            var param = $.extend({
                "OperateId":scope.activeItem.id,
                "PrivilegeType":"Operation",
                "body": JSON.stringify(scope.selectList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #operationPermissionModal").modal('hide');
                }
            });
        };
        /**
         * 获取字段权限
         */
        var getFieldPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Role";
            var param = $.extend({
                "RoleId":scope.activeItem.id,
                "Type":"Field"
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.fieldPrivilege = klwTool.arrayToJson(res.data,'objectid');
                    getField(scope);
                }
            });
        };
        /**
         * 获取所有字段
         */
        var getField = function (scope) {
            var url = "/BasicInformation/Field/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    $.each(res.data,function (index, obj) {
                        if(scope.fieldPrivilege[obj.id]){
                            obj.isdatacheck = true;
                        }else{
                            obj.isdatacheck = false;
                        }
                    });
                    scope.allField = new originArrayToTreeData(res.data);
                }
            });
        };
        /**
         * 保存字段权限
         */
        var saveFieldPrivilege = function (scope) {
            var url = "/BasicInformation/Privilege/Save";
            var param = $.extend({
                "OperateId":scope.activeItem.id,
                "PrivilegeType":"Field",
                "body": JSON.stringify(scope.selectList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #fieldPermissionModal").modal('hide');
                }
            });
        };

        var currentService = {
            //缓存所有平台类型
            "allPlatformType" : {}
        };

        currentService["query"] = query;
        currentService["newItem"] = newItem;
        currentService["getStore"] = getStore;
        currentService["getStorePrivilege"] = getStorePrivilege;
        currentService["getPlatformType"] = getPlatformType;
        currentService["saveStorePrivilege"] = saveStorePrivilege;
        currentService["getWarehousePrivilege"] = getWarehousePrivilege;
        currentService["getWarehouse"] = getWarehouse;
        currentService["saveWarehousePrivilege"] = saveWarehousePrivilege;
        currentService["getMenuPrivilege"] = getMenuPrivilege;
        currentService["getMenu"] = getMenu;
        currentService["saveMenuPrivilege"] = saveMenuPrivilege;
        currentService["getOperationPrivilege"] = getOperationPrivilege;
        currentService["getOperation"] = getOperation;
        currentService["saveOperationPrivilege"] = saveOperationPrivilege;
        currentService["getFieldPrivilege"] = getFieldPrivilege;
        currentService["getField"] = getField;
        currentService["saveFieldPrivilege"] = saveFieldPrivilege;

        return currentService;

    }]);