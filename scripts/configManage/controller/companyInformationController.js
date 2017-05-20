/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("companyInformationController", ["$scope","$rootScope","companyInformationService","toolsService" ,
        function($scope,$rootScope,companyInformationService,toolsService) {
            var pageId = "#companyInformation";
            var currentService = companyInformationService;
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
                //搜索条件
                $scope.formData = {
                    "code" : "",
                    "name" : ""
                };
                //获取表格数据
                currentService.query($scope);
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "公司编码", tag: 'code'},
                    {name: "公司名称", tag: 'name'},
                    {name: "公司法人", tag: 'lawuser'},
                    {name: "官网地址", tag: 'website'},
                    {name: "公司邮箱", tag: 'email'},
                    {name: "公司地址", tag: 'address'},
                    {name: "公司电话", tag: 'telephone'},
                    {name: "公司手机", tag: 'mobile'},
                    {name: "成立时间", tag: 'opendate'},
                    {name: "创建日期", tag: 'createdate'},
                    {name: "备注", tag: 'remark'}
                ];
                //当前编辑项
                $scope.activeItem = {};
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
             * 修改 跳到带内容的新增页面修改
             */
            $scope.edit = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用,暂不可修改!',time : 1000});
                }else {
                    $rootScope.params = {
                        'oprate': 'edit',
                        'obj': $scope.tableList[i]
                    };
                    $scope.addTab('公司信息：修改公司信息','../template/configManage/newCompanyInformation.html');
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
             * 跳到新增页面新增
             */
            $scope.newItem = function () {
                $rootScope.params = {
                    'oprate' : 'creat'
                };
                $scope.addTab('公司信息：新增公司信息','../template/configManage/newCompanyInformation.html');
            };

        }]);