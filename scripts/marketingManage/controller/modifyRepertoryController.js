/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("modifyRepertoryController", ["$scope", "$rootScope", "modifyRepertoryService","APP_MENU",
        function ($scope, $rootScope, modifyRepertoryService,APP_MENU ) {

            //当前页面id
            var indexID = '#modifyRepertory';

            //进入页面需要执行的方法
            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //初始化表单验证
                validateService.initValidate(indexID);

                //店铺名称
                modifyRepertoryService.StoreGet($scope);
                //查询活动商品
                modifyRepertoryService.ActivityRegisterDetailGet($scope);

                $scope.inventoryObj = {
                    store: $scope.params.storeName,
                    storeId: $scope.params.storeId,
                    inventoryType: ''
                };

                selectFun();

                $scope.isLead = false;

                //导入
                $scope.isLeadShow = function (content) {
                    if (content == true) {
                        $scope.isLead = true;
                    } else {
                        $scope.isLead = false;
                    }
                };

                $scope.leadObj = {
                    //下载模板
                    downFile: function (fileName) {
                        var elemIF = document.createElement("iframe");
                        elemIF.src = "http://klwk-online.oss-cn-beijing.aliyuncs.com/update/oms2.0/importTemplate/" + fileName + ".xlsx";
                        elemIF.style.display = "none";
                        document.body.appendChild(elemIF);
                    },
                    //导入模板
                    leadXlsx: function (myEvent) {
                        //allTypeUpload('.imageInformation', '.addImage');
                        $(myEvent.target).closest('.leadTemplate').find('.fileElem').click();
                    },

                    //导入确定
                    leadConfirm: function () {

                    }

                };

                // 清空商品
                $scope.empty = function () {
                    $scope.tableList1 = [];
                };

                //删除单条商品
                $scope.delete = function (i) {
                    $scope.tableList1.removeByValue($scope.tableList1[i]);
                };

                //开始修改
                $scope.ensure = function () {
                    if (validateService.validateAll(indexID, '.basic-message')) {
                        modifyRepertoryService.DistributionUpdateDeductions($scope);
                    }
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $('#modifyRepertory').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/activityApply.html';
                    $scope.option[index].name = '活动报名';
                };

            }

            init();


            function selectFun(){
                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){ //点击之后的回调
                        $scope.inventoryObj.storeId = obj.id;
                    }
                };

                //下拉选框插件 库存方式选择
                $scope.selectInventoryType = {
                    isshow: false,
                    validate:true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingInventoryDeduction, 'id', 'name'),
                    objName: {id: $scope.inventoryObj.inventoryIndex},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.inventoryObj.inventoryIndex=index;
                        if (index == 0) {
                            $scope.inventoryObj.inventoryType = 'InventoryReduction';
                        } else {
                            $scope.inventoryObj.inventoryType = 'InventoryReductionPayment';
                        }
                    }
                };
            }

        }]);