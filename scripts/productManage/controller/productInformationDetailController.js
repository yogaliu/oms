/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("productInformationDetailController", ["$scope", "$rootScope", "productInformationDetailService","toolsService",
        function ($scope, $rootScope, productInformationDetailService,toolsService) {
            var pageId = '#productInformationDetail';   // 页面Id

            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.productParams;   // 接收参数
                // 页面展示数据
                $scope.formData = params.data;
                //tab,默认商品详情
                $scope.tab = 'first';
                //规格信息
                $scope.theadListSku = [
                    {name: "状态", tag: 'statusname'},
                    {name: "自定义编码", tag: 'code'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "颜色", tag: 'color'},
                    {name: "尺码", tag: 'size'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "财务成本", tag: 'costprice'},
                    {name: "销售价", tag: 'wholesaleprice'},
                    {name: "实际售价", tag: 'retailprice'},
                    {name: "采购价", tag: 'purchaseprice'},
                    {name: "经销价", tag: 'platformprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                productInformationDetailService.skuQuery($scope);
                //变价信息
                $scope.theadListChange = [
                    {name: "规格编码", tag: 'Skucode'},
                    {name: "价格类型", tag: 'pricetype'},
                    {name: "变价金额", tag: 'price'},
                    {name: "起始有效期", tag: 'begindate'},
                    {name: "店铺名称", tag: 'storename'},
                    {name: "操作人", tag: 'createuser'},
                    {name: "记录日期", tag: 'createdate'}
                ];
                productInformationDetailService.changeQuery($scope);
                // 自定义属性枚举值
                productInformationDetailService.attribute($scope);
                //操作日志 列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createusername'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'content'}
                ];
                productInformationDetailService.operateLog($scope);
            }

            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //显示模态框
            $scope.showModal = function (name,i) {
                if(name == 'disabledSkuModal') {
                    $scope.activeItem = $.extend({},$scope.tableListSku[i]);
                } else {
                    $scope.activeItem = $.extend({},$scope.tableListChange[i]);
                }
                $(pageId + " #" + name).modal('show');
            };

            // 规格信息禁用
            $scope.disabledSkuOp = function () {
                productInformationDetailService.skuDisabled($scope);
            };

            // 变价信息禁用
            $scope.disabledChangeOp = function () {
                productInformationDetailService.changeDisabled($scope);
            };

            //返回商品信息
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/productInformation.html';
                $scope.option[index].name = '商品信息';
            };

        }]);