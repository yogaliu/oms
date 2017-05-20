/**
 * Created by xs on 2017/3/23.
 */
angular.module("klwkOmsApp")
    .controller("userManageController", ["$scope","toolsService","userManageService","validateService" ,
        function($scope,toolsService,userManageService,validateService) {
        var pageId = "#userManage";
        var currentService = userManageService;
        function init(){
            validateService.initValidate(pageId);
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage,itemsPerPage) {
                //超出页码范围 return
                if(currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1 )) return;
                $scope.first = itemsPerPage * (currentPage-1) + 1;
                if(Math.ceil($scope.paginationConf.totalItems / itemsPerPage)  === currentPage){
                    $scope.last = $scope.paginationConf.totalItems;
                }else{
                    $scope.last = currentPage *  itemsPerPage;
                }
            };
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [6, 10, 15, 20, 25,50],  //配置配置可选择每页显示记录数 array
                extClick : false , //当为外部点击翻页时为true
                type: 0 ,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function(){	//操作之后的回调
                    currentService.query($scope);
                }
            };
            //初始化第一页
            $scope.first = 1;
            //初始化最后一页
            $scope.last = $scope.paginationConf.itemsPerPage;
            //外部上一页
            $scope.prev = function () {
                $scope.paginationConf.currentPage--;
                $scope.paginationConf.type = 0 ;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            };
            //外部下一页
            $scope.next = function () {
                $scope.paginationConf.currentPage++;
                $scope.paginationConf.type = 1 ;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            };
            //表格筛选条件
            $scope.formData = {
                "loginname":"",
                "username":""
            };
            //查询主表
            currentService.query($scope);
            //表格配置
            $scope.theadList = [
                {name: "禁用", tag: 'isdisabled'},
                {name: "登录名", tag: 'loginname'},
                {name: "用户名", tag: 'username'},
                {name: "部门名称", tag: 'departmentname'},
                {name: "手机", tag: 'mobile'},
                {name: "电话", tag: 'telephone'},
                {name: "地址", tag: 'address'},
                {name: "创建日期", tag: 'createdate'},
                {name: "备注", tag: 'note'}
            ];
            $scope.topTheadList = [
                {name: "角色名称", tag: 'rolename'}
            ];
            //配置批量操作菜单
            $scope.menuInfo ={
                isshow:false,
                info:[
                    {name:'批量启用'},
                    {name:'批量禁用'}
                ],
                objName:{name:'批量操作'},
                onChange: function(obj,index){	//点击之后的回调
                    if(index == 0){
                        $scope.batchEnabledItem();
                    }else if(index == 1){
                        $scope.batchDisabledItem();
                    }
                }
            };
            //配置新增&修改用户弹框 部门选项
            $scope.departmentList = {
                isshow:false,
                validate:true,
                info:[],
                onChange: function(obj,index){	//点击之后的回调
                    $scope.activeItem.departmentid = obj.id;
                    $scope.activeItem.departmentname = obj.name;
                }
            };
            //当前主表查询项
            $scope.queryItem = {};
            //当前编辑用户项
            $scope.activeItem = {};
        }
        init();
        /**
         * 查询角色列表
         */
        $scope.queryRight = function (i) {
            $scope.currentIndex = i;
            $scope.queryItem = $.extend({},$scope.tableList[i]);
            currentService.queryRoleUser($scope,i);
        };
        /**
         * 查询主表
         */
        $scope.search = function () {
            currentService.query($scope);
        };
        /**
         * 清空搜索条件
         */
        $scope.clearOnly = function () {
            for(var name in $scope.formData){
                $scope.formData[name] = "";
            }
        };
        /**
         * 修改 显示弹框
         */
        $scope.edit = function (i) {
            if($scope.tableList[i].isdisabled){
                toolsService.alertMsg({content : '数据已禁用，暂不可修改!',time : 1000});
            }else {
                $scope.activeItem = $.extend({
                    "UserLoginKey": "00000000-0000-0000-0000-000000000000",
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                }, $scope.tableList[i]);
                currentService.getDepartment($scope, 'edit');
                validateService.clearValidateClass(pageId, "#addUserModal");
                $(pageId + " #addUserModal").modal('show');
            }
        };
        /**
         * 新增 显示弹框
         */
        $scope.addItem = function () {
            $scope.activeItem = {
                "id": "00000000-0000-0000-0000-000000000000",
                "loginname": "", //登录名
                "username": "", //用户名
                "isdisabled": false,
                "mobile": "", //手机
                "telephone": "", //电话
                "address": "", //地址
                "createdate": "0001-01-01 00:00:00",
                "note": "", //备注
                "IsSystem": false,
                "UserLoginKey": "00000000-0000-0000-0000-000000000000",
                "EnableECO": false,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            };
            currentService.getDepartment($scope,'creat');
            validateService.clearValidateClass(pageId,"#addUserModal");
            $(pageId + " #addUserModal").modal('show');
        };
        /**
         * 修改&新增
         */
        $scope.addUser = function () {
            if(validateService.validateAll(pageId,"#addUserModal")) {
                currentService.addUser($scope);
            }
        };
        /**
         * 重置密码
         */
        $scope.resetPassword = function (i) {
            if($scope.tableList[i].isdisabled){
                toolsService.alertMsg({content : '数据已禁用，暂不可操作!',time : 1000});
            }else {
                $scope.activeItem = $.extend({
                    "UserLoginKey": "00000000-0000-0000-0000-000000000000",
                    "NewUserPassword": "888888",
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                }, $scope.tableList[i]);
                currentService.addUser($scope);
            }
        };
        /**
         * 角色分配 初始化弹框
         */
        $scope.showRoleModal = function (i) {
            if($scope.tableList[i].isdisabled){
                toolsService.alertMsg({content : '数据已禁用，暂不可操作!',time : 1000});
            }else {
                $scope.activeItem = $.extend({}, $scope.tableList[i]);
                currentService.getRole($scope);
                $(pageId + " #setRoleModal").modal('show');
            }
        };
        /**
         * 选择角色
         */
        $scope.checkRole = function (i) {
            $scope.roleList[i].ischecked = !$scope.roleList[i].ischecked;
            $scope.isallRoleChecked = true;
            $.each($scope.roleList,function (index, obj) {
                if(!obj.ischecked){
                    $scope.isallRoleChecked = false;
                    return false;
                }
            })
        };
        /**
         * 选择角色 全选
         */
        $scope.checkAllRole = function () {
            if($scope.isallRoleChecked){
                $.each($scope.roleList,function (index, obj) {
                    obj.ischecked = false;
                    $scope.isallRoleChecked = false;
                })
            }else{
                $.each($scope.roleList,function (index, obj) {
                    obj.ischecked = true;
                    $scope.isallRoleChecked = true;
                })
            }
        };
        /**
         * 保存角色分配
         */
        $scope.setRole = function () {
            $scope.selectRoleList = [];
            $.each($scope.roleList,function (index, obj) {
                if(obj.ischecked){
                    var o = $.extend({},obj);
                    $scope.selectRoleList.push(o);
                }
            });
            if($scope.selectRoleList.length == 0){
                $scope.selectRoleList.push({
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "UserId": $scope.activeItem.id, //用户id
                    "RoleId": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": new Date().format('YYYY-MM-DD hh:mm:ss'),
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }else{
                $.each($scope.selectRoleList,function (index, obj) {
                    var o = {
                        "Id": "", //服务器Guid生成
                        "UserId": $scope.activeItem.id, //用户id
                        "RoleId": obj.id, //角色id
                        "RoleName": obj.name, //角色名
                        "CreateDate": new Date().format('YYYY-MM-DD hh:mm:ss'),
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    $scope.selectRoleList[index] = o;
                });
            }
            currentService.setRole($scope);
        };
        /**
         * 启用
         */
        $scope.enabledItem = function (i) {
            if($scope.tableList[i].isdisabled){
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                currentService.enabledItem($scope,'single');
            }else {
                toolsService.alertMsg({content : '选中数据为启用状态,无需启用!',time : 1000});
            }
        };
        /**
         * 启用 批量
         */
        $scope.batchEnabledItem = function () {
            var isHasCheck = false;
            $.each($scope.tableList,function (index, obj) {
                if(obj.isdatacheck){
                    isHasCheck = true;
                    return false;
                }
            });
            if(isHasCheck){
                currentService.enabledItem($scope,'batch');
            }else{
                toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
            }
        };
        /**
         * 禁用
         */
        $scope.disabledItem = function (i) {
            if($scope.tableList[i].isdisabled){
                toolsService.alertMsg({content : '选中数据为禁用状态,无需禁用!',time : 1000});
            }else {
                $scope.activeItem = $.extend({}, $scope.tableList[i]);
                toolsService.alertConfirm({
                    "msg": "数据禁用后不可使用，是否继续禁用？",
                    okBtn: function (index, layero) {
                        currentService.disabledItem($scope, 'single');
                        layer.close(index);
                    }
                });
            }
        };
        /**
         * 批量禁用
         */
        $scope.batchDisabledItem = function () {
            var isHasCheck = false;
            $.each($scope.tableList,function (index, obj) {
                if(obj.isdatacheck){
                    isHasCheck = true;
                    return false;
                }
            });
            if(isHasCheck){
                toolsService.alertConfirm({
                    "msg":"数据禁用后不可使用，是否继续禁用？",
                    okBtn : function(index, layero){
                        currentService.disabledItem($scope,'batch');
                        layer.close(index);
                    }
                });
            }else{
                toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
            }
        };
        /**
         * 复选框改变单条数据的isdatacheck属性
         */
        $scope.selectItem = function (i) {
            $scope.tableList[i].isdatacheck = !$scope.tableList[i].isdatacheck;
            $scope.isalldatacheck = true;
            $.each($scope.tableList,function (index, obj) {
                if(!obj.isdatacheck){
                    $scope.isalldatacheck = false;
                }
            })
        };
        /**
         * 复选框改变所有数据的isdatacheck属性
         */
        $scope.selectAll = function () {
            if($scope.isalldatacheck){
                $.each($scope.tableList,function (index, obj) {
                    obj.isdatacheck = false;
                    $scope.isalldatacheck = false;
                })
            }else{
                $.each($scope.tableList,function (index, obj) {
                    obj.isdatacheck = true;
                    $scope.isalldatacheck = true;
                })
            }
        };


    }]);