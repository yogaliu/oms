/**
 * Created by xs on 2017/4/18.
 */
angular.module("klwkOmsApp")
    .factory('userManageService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#userManage";
        /**
         * 查询用户信息
         */
        var query = function(scope) {
            var url = "/BasicInformation/Users/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.158",
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "LoginName",
                        "Name": "LoginName",
                        "Value": scope.formData.loginname,
                        "Children": []
                    }, {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "UserName",
                        "Name": "UserName",
                        "Value": scope.formData.username,
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
                    //是否全选
                    scope.isalldatacheck = false;
                    //配置分页插件 数据总条数
                    scope.paginationConf.totalItems = res.total;
                    if(scope.tableList.length > 0){
                        scope.currentIndex = 0;
                        scope.queryItem = $.extend({},scope.tableList[0]);
                        queryRoleUser(scope,0);
                    }else{
                        scope.topTableList = [];
                    }
                }
            });
        };
        /**
         * 查询角色列表
         */
        var queryRoleUser = function(scope,index) {
            var url = "/BasicInformation/RoleUser/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "UserId",
                    "Name": "UserId",
                    "Value": scope.queryItem.id,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.topTableList = res.data;
                    if(scope.tableList[index].detail == undefined){
                        scope.tableList[index].detail = [];
                        $.each(scope.topTableList,function (i, o) {
                            var role = {
                                "Id": o.id,
                                "UserId": o.userid,
                                "RoleId": o.roleid,
                                "RoleName": o.rolename,
                                "CreateDate": o.createdate,
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            };
                            scope.tableList[index].detail.push(role);
                        })
                    }
                }
            });
        };
        /**
         * 新增&修改
         */
        var addUser = function (scope) {
            var url = "/BasicInformation/Users/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #addUserModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 查询部门
         */
        var getDepartment = function (scope,oprate) {
            var url = "/BasicInformation/Department/Get";
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
                    scope.departmentList.info = res.data;
                    if(oprate == 'edit'){
                        scope.departmentList.setValue({id:scope.activeItem.departmentid});
                    }else if(oprate == 'creat'){
                        scope.departmentList.init();
                    }
                }
            });
        };
        /**
         * 查询角色
         */
        var getRole = function (scope) {
            var url = "/BasicInformation/Role/Get";
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
                    scope.roleList = res.data;
                    scope.isallRoleChecked = true;
                    $.each(scope.roleList,function (index, obj) {
                        obj.ischecked = false;
                        $.each(scope.topTableList,function (i, o) {
                            if(o.roleid == obj.id){
                                obj.ischecked = true;
                                return false;
                            }
                        })
                    });
                    $.each(scope.roleList,function (index, obj) {
                        if(!obj.ischecked){
                            scope.isallRoleChecked = false;
                            return false;
                        }
                    });
                }
            });
        };
        /**
         * 保存角色分配
         */
        var setRole = function (scope) {
            var url = "/BasicInformation/RoleUser/Save";
            var param = $.extend({
                body: JSON.stringify(scope.selectRoleList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #setRoleModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 启用
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/Users/Enable";
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
            var url = "/BasicInformation/Users/Disable";
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

        return {
            "query" : query,
            "queryRoleUser" : queryRoleUser,
            "getDepartment" : getDepartment,
            "addUser" : addUser,
            "getRole" : getRole,
            "setRole" : setRole,
            "enabledItem" : enabledItem,
            "disabledItem" : disabledItem
        };

    }]);