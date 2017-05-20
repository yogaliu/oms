/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .controller("noticeOrderDetailController", ["$scope","$rootScope","$state","WAP_CONFIG","noticeOrderDetailService",
        function($scope,$rootScope, $state, WAP_CONFIG,noticeOrderDetailService) {
            var pageId = "#noticeOrderDetail";
            function init(){
                //接收参数
                $scope.params = $rootScope.transferNoticeParams.data;
                console.log($scope.params);

                //默认为虚拟调拨明细
                $scope.tab = "first";
                // 虚拟调拨明细列表配置
                $scope.theadListInfo = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "通知数量", tag: 'noticeqty'},
                    {name: "出库数量", tag: 'outqty'},
                    {name: "入库数量", tag: 'inqty'},
                    {name: "仓库出库时间", tag: ''},
                    {name: "仓库入库时间", tag: ''}
                ];
                noticeOrderDetailService.getTransferDetail($scope);
                //操作日志列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createuser'},
                    {name: "操作类别", tag: 'description'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'remark'}
                ];
                noticeOrderDetailService.getTransferLog($scope);
            }
            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //返回
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/transferNotice.html';
                $scope.option[index].name = '调拨通知单';
            }

        }]);