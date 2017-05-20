/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("departmentInformationController", ["$scope","$rootScope","departmentInformationService","toolsService","validateService" ,
        function($scope,$rootScope,departmentInformationService,toolsService,validateService) {
            var pageId = "#departmentInformation";
            var currentService = departmentInformationService;
            function init(){
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
                //配置新增&修改弹框中的公司选项
                $scope.CompanyList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.companyid = obj.id;
                        $scope.activeItem.companyname = obj.name;
                    }
                };
                validateService.initValidate(pageId);
                //搜索条件
                $scope.formData = {
                    "code" : "",
                    "name" : ""
                };
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "部门编码", tag: 'code'},
                    {name: "部门名称", tag: 'name'},
                    {name: "公司名称", tag: 'companyname'},
                    {name: "创建日期", tag: 'createdate'},
                    {name: "部门备注", tag: 'note'}
                ];
                //当前编辑项
                $scope.activeItem = {};
                //获取表格数据
                currentService.query($scope);
            }
            init();
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
             * 搜索
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
                    toolsService.alertMsg({content : '数据已禁用,暂不可修改!',time : 1000});
                }else {
                    $scope.activeItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }, $scope.tableList[i]);
                    currentService.getCompany($scope, 'edit');
                    validateService.clearValidateClass(pageId, "#creatModal");
                    $(pageId + " #creatModal").modal('show');
                }
            };
            /**
             * 新增 显示弹框
             */
            $scope.addItem = function () {
                $scope.activeItem = {
                    "code": "", //部门编码
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "name": "", //部门名称
                    "note": "", //部门备注
                    "IsDisabled": false,
                    "CreateDate": "0001-01-01 00:00:00",
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                currentService.getCompany($scope,'creat');
                validateService.clearValidateClass(pageId,"#creatModal");
                $(pageId + " #creatModal").modal('show');
            };
            /**
             * 修改&新增
             */
            $scope.newItem = function () {
                if(validateService.validateAll(pageId,"#creatModal")){
                    currentService.newItem($scope);
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
             * 启用店铺 批量
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
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据禁用后不可使用，是否继续禁用？",
                        okBtn : function(index, layero){
                            currentService.disabledItem($scope,'single');
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



        }]);