/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnRequisitionDetailsController", ["$scope", "$rootScope", "returnRequisitionDetailService","APP_MENU",
        function ($scope, $rootScope, returnRequisitionDetailService,APP_MENU) {
            var pageId = '#returnRequisitionDetails';   //页面Id

            //进入页面需要执行的方法
            function init() {

                var params = $rootScope.returnOrderParams;    // 接收参数
                // 过滤单据状态
                if(params.data.status !== undefined){
                    params.data.statusname = APP_MENU.purchaseReturnStatus[params.data.status];
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
                    {name: "颜色", tag: 'color'},
                    {name: "尺码", tag: 'size'},
                    {name: "原始价格", tag: 'originalprice'},
                    {name: "退货金额", tag: 'defectivequantity'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "退货数量", tag: 'returnqty'},
                    {name: "出库数量", tag: 'outstockqty'},
                    {name: "仓库出库时间", tag: 'createdate'}
                ];
                returnRequisitionDetailService.purchaseDetail($scope);

                //操作记录列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createusername'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'note'}
                ];
                returnRequisitionDetailService.operationLog($scope);
            }

            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //返回采购退货单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/returnRequisitionList.html';
                $scope.option[index].name = '采购退货单';
            };

        }]);