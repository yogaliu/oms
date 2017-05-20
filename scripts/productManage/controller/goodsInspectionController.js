/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("goodsInspectionController", ["$scope", "$rootScope", "goodsInspectionService","validateService",
        function ($scope, $rootScope, goodsInspectionService,validateService) {
            var pageId = '#goodsInspection';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                // 初始化表单验证
                validateService.initValidate(pageId);
                //铺货检查列表配置
                $scope.theadList = [
                    {name: "商品编码", tag: 'ProductCode'},
                    {name: "商品名称", tag: 'ProductName'},
                    {name: "规格编码", tag: 'SkuCode'},
                    {name: "规格名称", tag: 'SkuName'}
                ];
                /*检查店铺初始化下拉框*/
                //店铺
                $scope.selectStore1 ={
                    isshow:false,
                    info:[],
                    validate:true,
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeid = obj.id;
                    }
                };
                // 品牌
                $scope.selectBrand ={
                    isshow:false,
                    info:[],
                    onChange: function(data){	//点击之后的回调
                        console.log(data);
                        var brandArr = [];
                        $.each(data, function (index,obj) {
                            brandArr.push(obj.code);
                        });
                        $scope.activeItem.brand = brandArr.join(',');
                        console.log($scope.activeItem.brand);
                    }
                };
                goodsInspectionService.getBrand($scope);

                /*检查重复初始化下拉框*/
                // 店铺
                $scope.selectStore2 ={
                    isshow:false,
                    info:[],
                    validate:true,
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeid = obj.id;
                    }
                };
                goodsInspectionService.getStore($scope);
                //当前编辑项
                $scope.activeItem = {};

            }
            init();
            
            //检查店铺
            $scope.checkStore = function () {
                if(validateService.validateAll(pageId,'#checkShopModal')) {
                    goodsInspectionService.inspectionStore($scope);
                }
            };

            //检查全部
            $scope.checkAll = function () {
                goodsInspectionService.inspectionAll($scope);
            };

            //检查重复
            $scope.checkRepeat = function () {
                if(validateService.validateAll(pageId,'#checkRepetitionModal')) {
                    goodsInspectionService.inspectionRepeat($scope);
                }
            };

            //显示模态框
            $scope.showModal = function (name) {
                $(pageId + " #" + name).modal('show');
                $scope.activeItem = {};
                /*检查店铺弹出框初始化*/
                // 店铺
                $scope.selectStore1.init();
                // 品牌
                $scope.selectBrand.init();
                // 初始化表单
                validateService.clearValidateClass(pageId,'#checkShopModal');
                /*检查重复弹出框初始化*/
                $scope.selectStore2.init();
                // 初始化表单
                validateService.clearValidateClass(pageId,'#checkRepetitionModal');
            };


        }]);