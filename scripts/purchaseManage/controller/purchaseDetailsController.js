/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("purchaseDetailsController", ["$scope", "$rootScope", "purchaseOrderDetailService","APP_MENU",
        function ($scope, $rootScope, purchaseOrderDetailService,APP_MENU) {
            var pageId = '#purchaseDetails';  // 页面Id

            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.purchaseOrderParams;    // 接收参数
                // 过滤单据状态
                if(params.data.status !== undefined){
                    params.data.statusname = APP_MENU.purchaseOrderStatus[params.data.status];
                }
                // 页面展示数据
                $scope.formData = params.data;
                //tab栏，默认采购单详情
                $scope.tab = 'first';
                //列表配置
                $scope.theadListInfo = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "采购数量", tag: 'purchaseqty'},
                    {name: "采购价", tag: 'currentprice'},
                    {name: "采购金额价", tag: 'purchaseallprice'},
                    {name: "通知数量", tag: 'noticeqty'},
                    {name: "入库数量", tag: 'instockqty'},
                    {name: "备注", tag: 'remark'}
                ];
                purchaseOrderDetailService.purchaseDetail($scope);
                // 操作日志
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createusername'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'note'}
                ];
                purchaseOrderDetailService.operationLog($scope);
            }
            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //返回采购订单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/purchaseList.html';
                $scope.option[index].name = '采购订单';
            }

        }]);