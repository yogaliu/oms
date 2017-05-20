/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("newCompanyInformationController", ["$scope","$rootScope","newCompanyInformationService","validateService" ,
        function($scope,$rootScope,newCompanyInformationService,validateService) {
            var pageId = "#newCompanyInformation";
            var currentService = newCompanyInformationService;
            function init(){
                $scope.params = $.extend({},$rootScope.params);
                validateService.initValidate(pageId);
                if($scope.params.oprate == 'creat'){
                    $scope.creatObj = {
                        "code": "", //公司编码
                        "id": "00000000-0000-0000-0000-000000000000",
                        "name": "", //公司名称
                        "email": "", //公司邮箱
                        "address": "", //公司地址
                        "website": "", //官网地址
                        "telephone": "", //公司电话
                        "mobile": "", //公司手机
                        "lawuser": "", //公司法人
                        "opendate": "", //成立时间
                        "isdisabled": false,
                        "remark": "", //备注
                        "Deleted": false,

                        "IsNew": false,
                        "IsUpdate": false
                    };
                }else if ($scope.params.oprate == 'edit'){
                    $scope.creatObj = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.params.obj);
                    $(pageId + " #code").attr('disabled',true);
                }
                //配置时间控件
                $(pageId + ' #opendate').datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });

            }
            init();

            /**
             * 保存
             */
            $scope.save = function () {
                if(validateService.validateAll(pageId,"#content")){
                    currentService.saveCompany($scope);
                }
            };
            /**
             * 返回
             */
            $scope.back = function () {
                $scope.addTab('公司信息','../template/configManage/companyInformation.html');
            };
            

    }]);