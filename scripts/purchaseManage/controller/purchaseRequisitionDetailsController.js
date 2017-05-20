/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("purchaseRequisitionDetailsController", ["$scope", "$rootScope", "purchaseRequisitionDetailService","APP_MENU",
        function ($scope, $rootScope, purchaseRequisitionDetailService,APP_MENU) {
            var pageId = '#purchaseRequisitionDetails';  // 页面Id

            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.requisitionParams;    // 接收参数
                // 过滤单据状态
                if(params.data.status !== undefined){
                    params.data.statusname = APP_MENU.purchaseNoticeStatus[params.data.status];
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
                    {name: "到货数量", tag: 'purchaseqty'},
                    {name: "通知数量", tag: 'noticeqty'},
                    {name: "正品入库数量", tag: 'stockinqty'},
                    {name: "次品入库数量", tag: 'defectivequantity'},
                    {name: "备注", tag: 'remark'},
                    {name: "仓库入库时间", tag: ''}
                ];
                purchaseRequisitionDetailService.purchaseDetail($scope);
                //操作记录列表配置
                $scope.theadListLog = [
                    {name: "操作人", tag: 'createusername'},
                    {name: "操作时间", tag: 'createdate'},
                    {name: "操作内容", tag: 'note'}
                ];
                purchaseRequisitionDetailService.operationLog($scope);
            }
            init();

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
            };

            //返回采购通知单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/purchaseRequisitionList.html';
                $scope.option[index].name = '采购通知单';
            }
        }]);
