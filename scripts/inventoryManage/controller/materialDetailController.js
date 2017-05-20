/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .controller("materialDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","materialDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,materialDetailService) {
            var pageId = "#materialDetail";
            function init(){
                var params = $rootScope.materialParams;  //接收参数
                // 页面展示数据
                $scope.formData = params.data;
                //默认为实物调拨明细
                $scope.tab = "first";
                // 实物调拨明细列表配置
                $scope.theadListInfo = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "锁定数量", tag: 'lockedqty'},
                    {name: "出库数量", tag: 'outqty'},
                    {name: "入库数量", tag: 'inqty'},
                    {name: "出库仓可调", tag: 'outCanAllocationQtyc'}
                ];
                materialDetailService.getTransferDetail($scope);
                //操作日志列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createuser'},
                    {name: "操作类别", tag: 'description'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'remark'}
                ];
                materialDetailService.getTransferLog($scope);
            }
            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //返回
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/materialTransfer.html';
                $scope.option[index].name = '实物调拨';
            }

        }]);