/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("SMSTemplateController", ["$scope","$rootScope","SMSTemplateService","APP_MENU","ApiService","toolsService","validateService" ,
        function($scope,$rootScope,SMSTemplateService,APP_MENU,ApiService,toolsService,validateService) {
            //页面service
            var currentService = SMSTemplateService;
            //页面id
            var pageId = "#SMSTemplate";
            //进入页面需要执行的方法
            function init(){
                //查询条件
                $scope.formData = {
                    'isdisabled' : ''
                };
                currentService.query($scope);
                validateService.initValidate(pageId);
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "名称", tag: 'name'},
                    {name: "账号", tag: 'accountName'},
                    {name: "会员类型", tag: 'customertypename'},
                    {name: "模板类型", tag: 'templatetypename'},
                    {name: "内容", tag: 'content'},
                    {name: "创建时间", tag: 'createdate'}
                ];
                $scope.bottomTheadList = [
                    {name: "店铺名称",tag: "storename"}
                ];
                //模板类型
                $scope.edittemplatetype ={
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.SMSType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.templatetype = obj.id;
                    }
                };
                //会员类型
                $scope.editcustomertype ={
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.customerType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.customertype = obj.id;
                    }
                };
                //账号
                $scope.SMSAccount ={
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){
                        $scope.activeItem.accountid = obj.id;
                    }
                };
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
            }
            init();
            /**
             * 查询条件切换
             */
            $scope.queryCondition = function (name) {
                var list = ['',true,false];
                $.each(list,function (index, obj) {
                    if($scope.formData[name] === obj){
                        if(index == list.length - 1){
                            $scope.formData[name] = list[0];
                            return false;
                        }else {
                            $scope.formData[name] = list[index+1];
                            return false;
                        }
                    }
                });
                currentService.query($scope);
            };
            /**
             * 刷新
             */
            $scope.fresh = function () {
                currentService.query($scope);
            };
            /**
             * 新增 初始化弹框
             */
            $scope.showCreatModal = function () {
                $scope.activeItem = {
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "name": "", //名称
                    "content": "", //内容
                    "IsDisabled": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                currentService.getAccount($scope,'creat');
                $scope.edittemplatetype.init();
                $scope.editcustomertype.init();
                validateService.clearValidateClass(pageId,"#editModal");
                $(pageId + " #editModal").modal('show');
            };
            /**
             * 修改 初始化弹框
             */
            $scope.showEditModal = function (i) {
                $scope.activeItem = $.extend({
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },$scope.tableList[i]);
                currentService.getAccount($scope,'edit');
                $scope.edittemplatetype.setValue({id:$scope.activeItem.templatetype});
                $scope.editcustomertype.setValue({id:$scope.activeItem.customertype});
                validateService.clearValidateClass(pageId,"#editModal");
                $(pageId + " #editModal").modal('show');
            };
            /**
             * 新增&修改
             */
            $scope.editTemplate = function () {
                if(validateService.validateAll(pageId,"#editModal")){
                    currentService.editTemplate($scope);
                }
            };
            /**
             * 文本域加入环境变量模板
             */
            $scope.editVariable = function (str) {
                var obj = document.getElementById("editTemplateContent");
                var value = $scope.activeItem.content;
                var length = $scope.activeItem.content.length;
                obj.focus();
                if(typeof document.selection != "undefined") {
                    document.selection.createRange().text = str;
                }else{
                    $scope.activeItem.content = value.substr(0,obj.selectionStart)+str+value.substring(obj.selectionStart,length);
                }
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
                    currentService.enableTemplate($scope,'batch');
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
                }else{
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据禁用后不可使用，是否继续禁用？",
                        okBtn : function(index, layero){
                            currentService.disableTemplate($scope,'single');
                            layer.close(index);
                        }
                    });
                }
            };
            /**
             * 禁用 批量
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
                            currentService.disableTemplate($scope,'batch');
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
            /**
             * 查询关联店铺
             */
            $scope.queryRight = function (i) {
                $scope.currentIndex = i;
                $scope.queryItem = $.extend({},$scope.tableList[i]);
                currentService.getTemplateStoreJoin($scope);
            };
            /**
             * 关联店铺 初始化弹框
             */
            $scope.showContactStoreModal = function () {
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allStore)){
                        currentService.getStore(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    //获取所有店铺
                    $scope.storeList = currentService.allStore;
                    //获得已选店铺
                    for(var name in $scope.storeList){
                        if($scope.bottomTableList[$scope.storeList[name].id] !== undefined){
                            $scope.storeList[name].ischecked = true;
                        }else{
                            $scope.storeList[name].ischecked = false;
                        }
                    }
                });
                $(pageId + " #contactStore").modal('show');
            };
            /**
             * 勾选店铺
             */
            $scope.checkStore = function (key) {
                if($scope.storeList[key].ischecked){
                    $scope.storeList[key].ischecked = !$scope.storeList[key].ischecked;
                }else {
                    $scope.storeList[key].ischecked = true;
                }
            };
            /**
             * 保存店铺关联
             * 删除之前已选当前未选中的
             * 添加之前未选当前已选中的
             */
            $scope.setStore = function () {
                //之前的已选店铺id集合
                var oldList = [];
                $.each($scope.bottomTableList,function (index, obj) {
                    oldList.push(obj.storeid);
                });
                //重新关联后的已选店铺id集合
                var newList = [];
                for(key in $scope.storeList){
                    if($scope.storeList[key].ischecked){
                        newList.push($scope.storeList[key].id);
                    }
                }
                //需要删除的关联店铺storeid集合
                var deleteList = [];
                $.each(oldList,function (index, obj) {
                    if(newList.indexOf(obj) < 0){
                        deleteList.push(obj);
                    }
                });
                //需要删除的关联店铺主键id集合
                var deleteListIds = [];
                $.each(deleteList,function (index,obj) {
                    var bottonJson = klwTool.arrayToJson($scope.bottomTableList,"storeid");
                    if(bottonJson[obj] !== undefined){
                        deleteListIds.push(bottonJson[obj].id);
                    }
                });
                //需要增加的关联店铺id集合
                var addList = [];
                $.each(newList,function (index, obj) {
                    if(oldList.indexOf(obj) < 0){
                        addList.push(obj);
                    }
                });
                //监听删除店铺和添加店铺都执行成功之后的操作
                var promise = ApiService.listenAll(function(deffer){
                    currentService.deleteTemplateStoreJoin($scope,deleteListIds,deffer);
                },function(deffer){
                    currentService.addTemplateStoreJoin($scope,addList,deffer);
                });
                promise.then(function(){
                    $(pageId + " #contactStore").modal('hide');
                    currentService.getTemplateStoreJoin($scope);
                });
            };
            /**
             * 删除关联店铺
             */
            $scope.deleteStore = function (key) {
                $scope.rightActiveItem = $.extend({},$scope.bottomTableList[key]);
                toolsService.alertConfirm({
                    "msg":"数据删除后不可恢复，是否继续删除？",
                    okBtn : function(index, layero){
                        currentService.deleteStore($scope);
                        layer.close(index);
                    }
                });
            };


    }]);