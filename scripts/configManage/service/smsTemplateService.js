/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .factory('SMSTemplateService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#SMSTemplate";
        /**
         * 获取短信模板
         */
        var query = function(scope) {
            var url = "/BasicInformation/SMS/Template/Get";
            var condition = [];
            if(scope.formData.isdisabled !== ''){
                condition = [{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": scope.formData.isdisabled,
                    "Children": []
                }];
            }
            var param = $.extend({
                body: JSON.stringify(condition)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    if(scope.tableList.length >= 0){
                        scope.currentIndex = 0;
                        scope.queryItem = $.extend({},scope.tableList[0]);
                        getTemplateStoreJoin(scope);
                    }
                    $.each(scope.tableList,function (index, obj) {
                        //默认未选中数据
                        obj.isdatacheck = false;
                        //会员类型
                        obj.templatetypename = APP_MENU.SMSType[obj.templatetype];
                        //模板类型
                        obj.customertypename = APP_MENU.customerType[obj.customertype];
                    })
                }
            });
        };
        /**
         * 获取关联店铺
         */
        var getTemplateStoreJoin = function(scope) {
            var url = "/BasicInformation/SMS/TemplateStoreJoin/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "TemplateId",
                    "Name": "TemplateId",
                    "Value": scope.queryItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.bottomTableList = klwTool.arrayToJson(res.data,"storeid");
                }
            });
        };
        /**
         * 新增&修改短信模板
         */
        var editTemplate = function(scope) {
            var url = "/BasicInformation/SMS/Template/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    $(pageId + ' #editModal').modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 获取账号选项
         */
        var getAccount = function(scope,oprate) {
            var url = "/BasicInformation/SMS/Account/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.SMSAccount.info = res.data;
                    if(oprate == 'creat'){
                        scope.SMSAccount.init();
                    }else if(oprate == 'edit'){
                        scope.SMSAccount.setValue({id:scope.activeItem.accountid});
                    }
                }
            });
        };
        /**
         * 启用短信模板
         */
        var enableTemplate = function(scope,type) {
            var url = "/BasicInformation/SMS/Template/Enable";
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
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    query(scope);
                }
            });
        };
        /**
         * 禁用短信模板
         */
        var disableTemplate = function(scope,type) {
            var url = "/BasicInformation/SMS/Template/Disable";
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
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    query(scope);
                }
            });
        };
        /**
         * 查询所有店铺 缓存到服务
         */
        var getStore = function(deffer) {
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
                    currentService.allStore = klwTool.arrayToJson(res.data,"id");
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
         * 删除取消选中的店铺
         */
        var deleteTemplateStoreJoin = function(scope,ids,deffer) {
            var url = "/BasicInformation/SMS/TemplateStoreJoin/Delete";
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
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
         * 添加新选中的店铺
         */
        var addTemplateStoreJoin = function(scope,ids,deffer) {
            var url = "/BasicInformation/SMS/TemplateStoreJoin/Save";
            var addList = [];
            $.each(ids,function (index, obj) {
                var thisObj = {
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "TemplateId": scope.queryItem.id,
                    "TemplateType": scope.queryItem.templatetype,
                    "StoreId": obj,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                addList.push(thisObj);
            });
            var param = $.extend({
                body: JSON.stringify(addList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
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
         * 删除店铺
         */
        var deleteStore = function(scope) {
            var url = "/BasicInformation/SMS/TemplateStoreJoin/Delete";
            var ids = [];
            ids.push(scope.rightActiveItem.id);
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    getTemplateStoreJoin(scope);
                }
            });
        };

        var currentService = {
            //缓存所有店铺
            "allStore" : {}
        };

        currentService["query"] = query;
        currentService["editTemplate"] = editTemplate;
        currentService["getAccount"] = getAccount;
        currentService["disableTemplate"] = disableTemplate;
        currentService["enableTemplate"] = enableTemplate;
        currentService["getTemplateStoreJoin"] = getTemplateStoreJoin;
        currentService["getStore"] = getStore;
        currentService["deleteTemplateStoreJoin"] = deleteTemplateStoreJoin;
        currentService["addTemplateStoreJoin"] = addTemplateStoreJoin;
        currentService["deleteStore"] = deleteStore;

        return currentService;

    }]);