/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("transferDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","transferDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,transferDetailService) {
            var pageId = "#transferDetail";
            function init(){
                //接收参数
                var params = $rootScope.transferParams;
                // 页面显示数据
                $scope.formData = params.data;
                //默认为虚拟调拨明细
                $scope.tab = "first";
                // 虚拟调拨明细列表配置
                $scope.theadListInfo = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "调拨数量", tag: 'quantity'},
                    {name: "实调数量", tag: 'actualquantity'},
                    {name: "调出仓库可销", tag: 'outCanSaleQuantity'},
                    {name: "调入仓库可销", tag: 'inCanSaleQuantity'}
                ];
                transferDetailService.getTransferDetail($scope);
                //操作日志列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createuser'},
                    {name: "操作类别", tag: 'code'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'remark'}
                ];
                transferDetailService.getTransferLog($scope);
            }
            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //计算可销
            $scope.getOccupation = function () {
                transferDetailService.occupation($scope,'outwarehouseid');
                transferDetailService.occupation($scope,'inwarehouseid');
            };

            //返回
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/virtualTransfer.html';
                $scope.option[index].name = '虚拟调拨';
            }

        }]);