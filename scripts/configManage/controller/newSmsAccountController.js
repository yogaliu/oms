/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("newSmsAccountController", ["$scope","$rootScope","newSmsAccountService","validateService",
        function($scope,$rootScope,newSmsAccountService,validateService) {
            var pageId = "#newSmsAccount";
            var currentService = newSmsAccountService;
            function init(){
                var params = $.extend({},$rootScope.params);
                if(params.type == 'edit'){
                    $scope.formData = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },params.data);
                }else if(params.type == 'new'){
                    $scope.formData = {
                        "Id": "00000000-0000-0000-0000-000000000000",
                        "CreateDate": "0001-01-01 00:00:00",
                        "name": "",
                        "account": "",
                        "password": "",
                        "productid": "",
                        "note": "",
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }
                }
                //初始化表单验证
                validateService.initValidate(pageId);
            }
            init();
            /**
             * 新增短信账号
             */
            $scope.newSmsAccount = function () {
                if(validateService.validateAll(pageId,"#form")){
                    currentService.newSmsAccount($scope);
                }
            };
            /**
             * 取消新增 跳回列表页
             */
            $scope.cancle = function () {
                $scope.addTab('短信账号','../template/configManage/smsAccount.html');
            };

        }]);