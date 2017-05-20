/**
 * Created by cj on 2017/4/1.
 */
angular.module("klwkOmsApp")
    .factory('productSettingUpService', ["ApiService","toolsService", function (ApiService,toolsService) {
        var pageId = '#productSettingUp';   // 页面Id
        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 商品编码规则
         * @constructor
         */
        var ruleQuery = function (scope,PageIndex,PageSize) {
            var url = "/Product/ProductEncodeRule/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    //总条数
                    scope.rulesPaginationConf.totalItems = res.total;
                    //列表数据
                    scope.tableListRule = res.data;
                    $.each(scope.tableListRule, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        obj.isSelect = false;
                    });
                    // 默认关联第一条
                    scope.tableListRule[0].isSelect = true;
                    //默认第一条商品规则属性值
                    ruleValue(scope,res.data[0]);
                }
            });
        };

        /**
         * 商品规则属性值
         * @constructor
         */
        var ruleValue = function (scope,obj,type) {
            var url = "/Product/ProductEncodeRuleDetail/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EncodeRuleId",
                    "Name": "EncodeRuleId",
                    "Value": obj.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.ruleChildData = res.data;
                    // 规则名称
                    scope.parentName = obj.name;
                    // 规则编码
                    scope.parentCode = obj.code;
                    if(type == 'single') {
                        // 删除单条规则
                        var data = [];
                       $.each(res.data,function (i,v) {
                            $.extend({
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            },v);
                        });
                        data.push({
                            "Id": obj.id,
                            "CreateDate": obj.createdate,
                            "Code": obj.code,
                            "Name": obj.name,
                            "IsDisabled": obj.isdisabled,
                            "Seq": obj.seq,
                            "IsShow": obj.isshow,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false,
                            "IsProduct": obj.isproduct,
                            "Detail": res.data
                        });
                        deleteRule(scope,data,'single');
                    } else if(type == 'batch'){
                        // 批量删除规则
                        if(res.data.length != 0) {
                            $.each(res.data,function (i,v) {
                                res.data[i] = $.extend({
                                    "Deleted": false,
                                    "IsNew": false,
                                    "IsUpdate": false
                                },v);
                            });
                        }
                        scope.batchValue.push({
                            "Id": obj.id,
                            "CreateDate": obj.createdate,
                            "Code": obj.code,
                            "Name": obj.name,
                            "IsDisabled": obj.isdisabled,
                            "Seq": obj.seq,
                            "IsShow": obj.isshow,
                            "IsProduct": obj.isproduct,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false,
                            "Detail": res.data
                        });
                    }
                }
            });
        };

        /**
         * 禁用商品编码规则
         * @constructor
         */
        var disabledRule = function (scope,type) {
            var ids = [];
            if (type == 'single') {
                ids.push(scope.activeRuleItem.id);
            } else if (type == 'batch') {
                $.each(scope.tableListRule, function (index, obj) {
                    if(obj.isdatacheck){
                        ids.push(obj.id);
                    }
                })
            }
            var url = "/Product/ProductEncodeRule/Disable";
            var param = $.extend({
                body:JSON.stringify(ids)
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    if(type == 'single') {
                        $(pageId + ' #isDisabledModal').modal('hide');
                    } else {
                        $(pageId + ' #batchIsDisabledModal').modal('hide');
                    }
                    ruleQuery(scope,scope.rulesPaginationConf.currentPage, scope.rulesPaginationConf.itemsPerPage);
                    scope.activeRuleItem = {};
                }
            });
        };

        /**
         * 启用商品编码规则
         * @constructor
         */
        var enabledRule = function (scope,type) {
            var ids = [];
            if (type == 'single') {
                ids.push(scope.activeRuleItem.id);
            } else if (type == 'batch') {
                $.each(scope.tableListRule, function (index, obj) {
                    if(obj.isdatacheck){
                        ids.push(obj.id);
                    }
                })
            }
            var url = "/Product/ProductEncodeRule/Enable";
            var param = $.extend({
                body:JSON.stringify(ids)
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    ruleQuery(scope,scope.rulesPaginationConf.currentPage,scope.rulesPaginationConf.itemsPerPage);
                    scope.activeRuleItem = {};
                }
            });
        };

        /**
         * 删除商品编码规则
         * @constructor
         */
        var deleteRule = function (scope,data,type) {
            var url = "/Product/ProductEncodeRule/Delete";
            var param = $.extend({
                body:JSON.stringify(data)
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    if(type == 'single') {
                        $(pageId + ' #deleteRuleModal').modal('hide');
                    } else {
                        $(pageId + ' #batchDeleteRuleModal').modal('hide');
                    }
                    ruleQuery(scope,scope.rulesPaginationConf.currentPage,scope.rulesPaginationConf.itemsPerPage);
                    scope.batchValue = [];
                }
            });
        };

        /**
         * 自定义属性列表数据
         * @constructor
         */
        var attributeQuery = function (scope,PageIndex,PageSize,data) {
            var url = "/Product/ProductAttribute/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": !data?[]:[{
                        // 编码
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.code,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    //总条数
                    scope.attributPaginationConf.totalItems = res.total;
                    //列表数据
                    scope.tableListAttribute = res.data;
                    $.each(scope.tableListAttribute, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
                }
            });
        };

        /**
         * 属性分类
         * @constructor
         */
        var attributeClassify = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ClassiFicationType",
                    "Name": "ClassiFicationType",
                    "Value": 14,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        obj.id = obj.id.toLowerCase();
                    });
                    scope.selectAttribute.info = res.data;
                }
            });
        };

        /**
         * 保存自定义属性
         * @constructor
         */
        var saveAttribute = function (scope) {
            var url = "/Product/ProductAttribute/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id": scope.activeAttributeItem.id?scope.activeAttributeItem.id:"00000000-0000-0000-0000-000000000000",
                    "CreateDate": scope.activeAttributeItem.createdate?scope.activeAttributeItem.createdate:"0001-01-01 00:00:00",
                    "ClassiFicationId": scope.activeAttributeItem.classificationid,
                    "ClassiFicationName": scope.activeAttributeItem.classificationname,
                    "Name": scope.activeAttributeItem.name,
                    "Code": scope.activeAttributeItem.code,
                    "IsDisabled": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #attributeModal').modal('hide');
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                    attributeQuery(scope,scope.rulesPaginationConf.currentPage,scope.rulesPaginationConf.itemsPerPage);
                    scope.activeAttributeItem = {};
                }
            });
        };

        /**
         * 删除自定义属性
         * @constructor
         */
        var attributeDelete = function (scope,type) {
            var ids = [];
            if (type == 'single') {
                ids.push(scope.activeAttributeItem.id);
            } else if (type == 'batch') {
                $.each(scope.tableListAttribute, function (index, obj) {
                    if(obj.isdatacheck){
                        ids.push(obj.id);
                    }
                })
            }
            var url = "/Product/ProductAttribute/Delete";
            var param = $.extend({
                body:JSON.stringify(ids)
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    if(type == 'single') {
                        $(pageId + ' #deleteAttributeModal').modal('hide');
                    } else {
                        $(pageId + ' #batchDeleteAttributeModal').modal('hide');
                    }
                    attributeQuery(scope,scope.rulesPaginationConf.currentPage,scope.rulesPaginationConf.itemsPerPage);
                    scope.activeAttributeItem = {};
                }
            });
        };

        /**
         * 商品分类数据
         * @constructor
         */
        var classifyQuery = function (scope) {
            var url = "/Product/ProductCategory/Get";
            var promise = ApiService.postLoad(url,$.extend({},paramObj));
            promise.then(function (res) {
                if(res.success) {
                    // 离散数据转为树形结构数据
                    scope.classifyList = new originArrayToTreeData(res.data);
                }
            });
        };

        /**
         * 保存商品分类数据
         * @constructor
         */
        var saveClassify = function (scope) {
            var url = "/Product/ProductCategory/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id": scope.classifyItem.id?scope.classifyItem.id:'00000000-0000-0000-0000-000000000000',
                    "CreateDate": scope.classifyItem.createdate?scope.classifyItem.createdate:'0001-01-01 00:00:00',
                    "Code": scope.classifyItem.code,
                    "Name": scope.classifyItem.name,
                    "ParentId": scope.classifyItem.parentid?scope.classifyItem.parentid:'00000000-0000-0000-0000-000000000000',
                    "Level": scope.classifyItem.level?scope.classifyItem.level:0,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function () {
                classifyQuery(scope);
                toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                $(pageId + ' #classifyModal').modal('hide');
            });
        };

        return {
            "ruleQuery": ruleQuery,
            "ruleValue": ruleValue,
            "deleteRule": deleteRule,
            "disabledRule": disabledRule,
            "enabledRule": enabledRule,
            "attributeQuery": attributeQuery,
            "attributeDelete": attributeDelete,
            "attributeClassify": attributeClassify,
            'saveAttribute': saveAttribute,
            "classifyQuery": classifyQuery,
            "saveClassify": saveClassify
        };

    }]);