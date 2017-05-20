/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpSellOutputBillDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","fbpSellOutputBillDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG,fbpSellOutputBillDetailService) {
var indexId="#fbpSellOutputBillDetail";
            function init(){
                //加载下拉框
                $('#fbpSellOutputBillDetail').selectPlug();
                //tab栏切换，默认为first页面
                $scope.tab = 'first';
                //获取传过来的退货通知单号
                $scope.SalesOrderId=$rootScope.params.SalesOrderId;
                //退货通知单详情头
                $scope.planListThead=fbpSellOutputBillDetailService.configData.columns;
                //退货通知表体
                fbpSellOutputBillDetailService.ListInterface.getPlanList($scope);
                ////日志头部
                //$scope.logListThead=fbpSellOutputBillDetailService.configData.logColumns;
                ////获取日志表体
                //fbpSellOutputBillDetailService.ListInterface.getLogList($scope);
            }
            init();
            $scope.domOperate={
                //返回
                backTolist:function(){
                    $rootScope.params = {};
                    var index = $(indexId).closest('[data-index]').attr('data-index');
                    var url = '../template/b2bFBP/fbpSellOutputBill.html';
                    var title = '销售出库单';
                },
                overOrder:function(){

                }
            };
            //tab栏切换函数
            $scope.isShow= function (content) {
                $scope.tab = content;
            };
            $rootScope.activePage = "b2bBFP";

        }]);