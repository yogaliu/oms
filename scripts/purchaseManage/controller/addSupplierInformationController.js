/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addSupplierInformationController", ["$scope", "$rootScope", "addSupplierInformationService","APP_MENU","toolsService","validateService",
        function ($scope, $rootScope, addSupplierInformationService,APP_MENU,toolsService,validateService) {
            var pageId = '#addSupplierInformation'; // 页面Id

            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.supplierParams;   // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 修改页面,展示数据
                if (params.type == 'edit') {
                    $scope.formData = {
                        "supplierid": params.data.supplierid,
                        // 供应商编码
                        "code": params.data.code,
                        // 供应商简称
                        "shortname": params.data.shortname,
                        // 供应商全称
                        "fullname": params.data.fullname,
                        // 电话
                        "telephone": params.data.telephone,
                        // 手机号码
                        "mobile": params.data.mobile,
                        // 联系人
                        "contact": params.data.contact,
                        // 结算方式
                        "settlementtype": params.data.suppliersettlementtype,
                        // 传真
                        "faxnumber": params.data.faxNumber,
                        // 邮箱
                        "email": params.data.email,
                        // 网址
                        "website": params.data.webSite,
                        // 地址
                        "address": params.data.address,
                        // 备注
                        "remarks": params.data.remarks,
                        "status": 1,
                        "createdate": params.data.createdate
                    }
                }
                // 新增页面
                else if (params.type == 'new') {
                    $scope.formData = {};
                }
                //结算方式下拉框配置
                $scope.selectType = {
                    isshow: false,
                    info: klwTool.jsonToArray2(APP_MENU.purchaseMethod,'id','name'),
                    objName: {id: $scope.formData.settlementtype},
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.settlementtype = index;
                    }
                };
            }

            init();

            //保存供应商信息
            $scope.saveSupplier = function () {
                if(validateService.validateAll(pageId,'.add-input')){
                    addSupplierInformationService.save($scope, $scope.formData);
                }
            };

            //返回供应商信息
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/supplierInformation.html';
                $scope.option[index].name = '供应商信息';
            };


        }]);