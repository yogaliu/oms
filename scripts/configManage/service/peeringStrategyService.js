/**
 * Created by xs on 2017/4/18.
 */
angular.module("klwkOmsApp")
    .factory('peeringStrategyService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#peeringStrategy";
        /**
         * 查询主表 配货策略
         */
        var query = function(scope) {
            var url = "/BasicInformation/DispatchTemplate/Get";
            var body = [];
            if(scope.formData.storeId != ""){
                body = [{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.formData.storeId,
                    "Children": []
                }];
            }
            var param = $.extend({
                body: JSON.stringify(body)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    //默认查询第一项的关联配货仓库
                    if(scope.tableList.length > 0){
                        scope.currentIndex = 0;
                        scope.queryItem = $.extend({},scope.tableList[0]);
                        queryAssociation(scope);
                    }else{
                        scope.topTableList = [];
                    }
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //非货到付款默认快递 id查找name
                        if(obj.defaultexpressid){
                            obj.defaultexpressname = currentService.allExpress[obj.defaultexpressid.toLowerCase()].name;
                        }
                        //货到付款默认快递 id查找name
                        if(obj.defaultcodexpressid){
                            obj.defaultcodexpressname = currentService.allExpress[obj.defaultcodexpressid.toLowerCase()].name;
                        }
                    });
                }
            });
        };
        /**
         * 获取店铺 用于配置店铺筛选条件
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
                    scope.StoreList = {
                        isshow:false,
                        info:res.data,
                        onChange: function(obj,index){	//点击之后的回调
                            scope.formData.storeId = obj.storeSetting.dispatchtemplateid;
                        }
                    };
                    scope.preRepeat = [{'a':'a'}];
                }
            });
        };
        /**
         * 查询关联配货仓库&关联配货快递
         */
        var queryAssociation = function(scope) {
            var url = "/BasicInformation/DispatchTemplate/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "w.TemplateId",
                    "Name": "TemplateId",
                    "Value": scope.queryItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.topTableList = res.data;
                    $.each(scope.topTableList,function (index, obj) {
                        //仓库名称 id查找name
                        if(obj.warehouseid){
                            obj.warehousename = currentService.allWarehouse[obj.warehouseid.toLowerCase()].name;
                        }
                        //配货类型 id查找name
                        if(obj.warehousedispatchtype !== undefined){
                            obj.warehousedispatchtypename = APP_MENU.matchedType[obj.warehousedispatchtype];
                        }
                    });
                    //默认查询第一项关联配货仓库的关联配货快递
                    if(scope.topTableList.length > 0){
                        scope.currentRightIndex = 0;
                        scope.queryWarehouseItem = $.extend({},scope.topTableList[0]);
                        if(scope.topTableList[0].expresses){
                            //仓库有关联快递属性
                            scope.bottomTableList = scope.topTableList[0].expresses;
                            $.each(scope.bottomTableList,function (index, obj) {
                                //快递名称 id查找name
                                if(obj.expressid){
                                    obj.expressname = currentService.allExpress[obj.expressid].name;
                                }
                            });
                        }else{
                            //仓库没有关联快递属性
                            scope.bottomTableList = [];
                        }
                    }else {
                        scope.bottomTableList = [];
                    }

                }
            });
        };
        /**
         * 新增&修改配货策略
         */
        var editPeeringItem = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Save";
            var param = $.extend({
                body: JSON.stringify(scope.currentPeeringItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #editPeeringStrategyModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 查询所有快递 缓存到服务 用于过滤表格字段
         */
        var getAllExpress = function (scope,deffer) {
            var url = "/BasicInformation/Express/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allExpress = klwTool.arrayToJson(res.data,'id');
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
         * 查询所有仓库 缓存到服务 用于过滤表格字段
         */
        var getAllWarehouse = function (scope,deffer) {
            var url = "/BasicInformation/Warehouse/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allWarehouse = klwTool.arrayToJson(res.data,'id');
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
         * 查询快递
         */
        var getExpress = function (scope,oprate) {
            var url = "/BasicInformation/Express/Get";
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
                    "OperateType": 1,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ExpressType",
                    "Name": "ExpressType",
                    "Value": 3,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    if(oprate == 'creat' || oprate == 'edit'){
                        var list = [];
                        //iscancod属性为真才能作为 货到付款默认快递 的选项
                        $.each(res.data,function (index, obj) {
                            if(obj.iscancod){
                                list.push(obj);
                            }
                        });
                        scope.notcodExpressList.info = res.data;
                        scope.codExpressList.info = list;
                        if(oprate == 'edit'){
                            scope.notcodExpressList.setValue({id:scope.currentPeeringItem.defaultexpressid});
                            scope.codExpressList.setValue({id:scope.currentPeeringItem.defaultcodexpressid});
                        }else if(oprate == 'creat'){
                            scope.notcodExpressList.init();
                            scope.codExpressList.init();
                        }
                    }else if (oprate == 'set'){
                        scope.expressList = res.data;
                        $.each(scope.expressList,function (index, obj) {
                            obj.ischecked = false;
                            obj.templateexpressid = "00000000-0000-0000-0000-000000000000";
                            $.each(scope.bottomTableList,function (i, o) {
                                if(o.expressid.toLowerCase() == obj.id.toLowerCase()){
                                    obj.ischecked = true;
                                    obj.templateexpressid = o.templateexpressid;
                                    obj.seq = o.orderid;
                                    return false;
                                }
                            })
                        })
                    }
                }
            });
        };
        /**
         * 启用配货策略
         */
        var enabledPeeringStrategy = function (scope,type) {
            var url = "/BasicInformation/DispatchTemplate/Enable";
            var ids = [];
            if(type == 'single'){
                ids.push(scope.currentPeeringItem.id);
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
         * 禁用配货策略
         */
        var disabledPeeringStrategy = function (scope,type) {
            var url = "/BasicInformation/DispatchTemplate/Disable";
            var ids = [];
            if(type == 'single'){
                ids.push(scope.currentPeeringItem.id);
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
         * 查询仓库
         */
        var getWarehouse = function (scope,oprate) {
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
                    "OperateType": 1,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.warehouseList.info = res.data;
                    if(oprate == 'edit'){
                        scope.warehouseList.setValue({id:scope.currentWarehouseItem.warehouseid});
                    }else if(oprate == 'creat'){
                        scope.warehouseList.init();
                    }
                }
            });
        };
        /**
         * 新增&修改 仓库
         */
        var addWarehouseItem = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Warehouse/Save";
            var param = $.extend({
                body: JSON.stringify(scope.currentWarehouseItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #addWarehouseModal").modal('hide');
                    queryAssociation(scope);
                }
            });
        };
        /**
         * 删除关联配货仓库
         */
        var deleteWarehouse = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Warehouse/Delete";
            var ids = [];
            ids.push(scope.currentWarehouseItem.templatewarehouseid);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    queryAssociation(scope);
                }
            });
        };
        /**
         * 启用仓库
         */
        var enableWarehouse = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Warehouse/Enable";
            var ids = [];
            ids.push(scope.currentWarehouseItem.templatewarehouseid);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    queryAssociation(scope);
                }
            });
        };
        /**
         * 禁用仓库
         */
        var disabledWarehouse = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Warehouse/Disable";
            var ids = [];
            ids.push(scope.currentWarehouseItem.templatewarehouseid);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    queryAssociation(scope);
                }
            });
        };
        /**
         * 保存快递设置
         */
        var setExpress = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Express/Save";
            var param = $.extend({
                body: JSON.stringify(scope.selectExpressList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #setExpress").modal('hide');
                    queryAssociation(scope);
                }
            });
        };
        /**
         * 删除关联快递
         */
        var deleteExpress = function (scope) {
            var url = "/BasicInformation/DispatchTemplate/Express/Delete";
            var ids = [];
            ids.push(scope.activeExpressItem.templateexpressid);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    queryAssociation(scope);
                }
            });
        };

        var currentService = {
            //缓存所有快递
            "allExpress" : {},
            //缓存所有仓库
            "allWarehouse" : {}
        };

        currentService["query"] = query;
        currentService["queryAssociation"] = queryAssociation;
        currentService["editPeeringItem"] = editPeeringItem;
        currentService["getExpress"] = getExpress;
        currentService["enabledPeeringStrategy"] = enabledPeeringStrategy;
        currentService["disabledPeeringStrategy"] = disabledPeeringStrategy;
        currentService["getWarehouse"] = getWarehouse;
        currentService["addWarehouseItem"] = addWarehouseItem;
        currentService["deleteWarehouse"] = deleteWarehouse;
        currentService["enableWarehouse"] = enableWarehouse;
        currentService["disabledWarehouse"] = disabledWarehouse;
        currentService["setExpress"] = setExpress;
        currentService["deleteExpress"] = deleteExpress;
        currentService["getAllExpress"] = getAllExpress;
        currentService["getAllWarehouse"] = getAllWarehouse;
        currentService["getStore"] = getStore;

        return currentService;

    }]);