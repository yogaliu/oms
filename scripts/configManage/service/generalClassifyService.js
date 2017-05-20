/**
 * Created by xs on 2017/4/13.
 */
angular.module("klwkOmsApp")
    .factory('generalClassifyService', ["ApiService","toolsService","APP_MENU",function(ApiService,toolsService,APP_MENU){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#generalClassify";
        /**
         * 获取表格数据
         */
        var query = function(scope) {
            var url = "/BasicInformation/GeneralClassiFication/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.039",
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
                        "Field": "ClassiFicationType",
                        "Name": "ClassiFicationType",
                        "Value": scope.formData.classificationtype,
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
                    //配置分页插件 数据总条数
                    scope.paginationConf.totalItems = res.total;
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //类别 字段过滤
                        if(obj.classificationtype !== undefined){
                            obj.classificationtypename = APP_MENU.classificationType[obj.classificationtype];
                        }
                    });
                }
            });
        };
        /**
         * 新增&修改
         */
        var newItem = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    $(pageId + " #editModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 删除
         */
        var deleteItem = function (scope,type) {
            var url = "/BasicInformation/GeneralClassiFication/Delete";
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
         * 启用
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/GeneralClassiFication/Enable";
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
         * 禁用
         */
        var disabledItem = function (scope,type) {
            var url = "/BasicInformation/GeneralClassiFication/Disable";
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

        return {
            "query" : query,
            "deleteItem" : deleteItem,
            "enabledItem" : enabledItem,
            "disabledItem" : disabledItem,
            "newItem" : newItem
        };

    }]);