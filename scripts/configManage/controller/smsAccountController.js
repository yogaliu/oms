/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("smsAccountController", ["$scope","$rootScope","smsAccountService","toolsService","validateService" ,
        function($scope,$rootScope,smsAccountService,toolsService,validateService) {
            //页面id
            var pageId = "#smsAccount";
            //页面service
            var currentService = smsAccountService;
            function init(){
                //初始化表单验证
                validateService.initValidate(pageId);
                //表单数据
                $scope.formData = {
                    'content':'', //内容
                    'mobiles':'' //手机
                };
                //表格配置
                $scope.theadList = [
                    {name: "名称", tag: 'name'},
                    {name: "账号", tag: 'account'},
                    {name: "密码", tag: 'password'},
                    {name: "产品编号", tag: 'productid'},
                    {name: "备注", tag: 'note'},
                    {name: "创建时间", tag: 'createdate'},
                    {name: "账号余额", tag: 'SMSBalance'}
                ];
                //查询短信账号列表数据
                currentService.getSmsAccount($scope);
            }
            init();
            /**
             * 刷新
             */
            $scope.fresh = function () {
                currentService.getSmsAccount($scope);
            };
            /**
             * 新增短信账号
             */
            $scope.newAccount = function () {
                $rootScope.params = {
                    type:'new'
                };
                $scope.addTab('短信账号:新增短信账号','../template/configManage/newSmsAccount.html');
            };
            /**
             * 修改短信账号
             */
            $scope.editAccount = function (i) {
                $rootScope.params = {
                    data:$scope.tableList[i],
                    type:'edit'
                };
                $scope.addTab('短信账号:修改短信账号','../template/configManage/newSmsAccount.html');
            };
            /**
             * 删除
             */
            $scope.deleteAccount = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                toolsService.alertConfirm({
                    "msg":"数据删除后不可恢复，是否继续删除？",
                    okBtn : function(index, layero){
                        currentService.deleteSmsAccount($scope,'single');
                        layer.close(index);
                    }
                });
            };
            /**
             * 批量删除
             */
            $scope.batchDelteAccount = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    toolsService.alertConfirm({
                        "msg":"数据删除后不可恢复，是否继续删除？",
                        okBtn : function(index, layero){
                            currentService.deleteSmsAccount($scope,'batch');
                            layer.close(index);
                        }
                    });
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            /**
             * 删除 批量
             */
            $scope.batchDeleteAccount = function () {
                currentService.deleteSmsAccount($scope,'batch');
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
             * 查余额
             */
            $scope.getBalance = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                currentService.getBalance($scope,i);
            };
            /**
             * 发短信 初始化弹框
             */
            $scope.showSendSMSModal = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                }
                validateService.clearValidateClass(pageId,"#sendSmsModal");
                $(pageId + " #sendSmsModal").modal('show');
            };
            /**
             * 发短信
             */
            $scope.sendSMS = function () {
                if(validateService.validateAll(pageId,"#sendSmsModal")){
                    currentService.sendSMS($scope);
                }
            };
    }]);