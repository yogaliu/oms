/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpQuitGoodsBillDetailController", ["$scope", "$rootScope", "WAP_CONFIG", "ApiService","fbpQuitGoodsBillDetailService",
        function ($scope, $rootScope, WAP_CONFIG, ApiService,fbpQuitGoodsBillDetailService) {
            function init() {
                //加载下拉框
                $('#fbpPlanBillDetail').selectPlug();
                //tab栏切换，默认为first页面
                $scope.tab = 'first';
                //获取计划单号
                $scope.returnorderid=$rootScope.params.returnorderid;
                //获取出仓仓库名
                $scope.outwarehousename=$rootScope.params.outwarehousename;
                //获取入仓仓库名
                $scope.inwarehousename=$rootScope.params.inwarehousename;
                //计划单列表头部
                $scope.planListThead=fbpQuitGoodsBillDetailService.configData.columns;
                //初始化计划表体数据
                fbpQuitGoodsBillDetailService.ListInterface.getPlanList($scope);
                //日志头部
                $scope.logListThead=fbpQuitGoodsBillDetailService.configData.logColumns;
                //日志身体
                fbpQuitGoodsBillDetailService.ListInterface.getLogList($scope);
            }

            init();

            //tab栏切换函数
            $scope.isShow = function (content) {
                $scope.tab = content;
            };
            $rootScope.activePage = "b2bBFP";

            //获取计划单信息

            $scope.domOperate={
                //返回
                backTolist:function(){
                    $rootScope.params = {};
                    var url = '../template/b2bFBP/fbpQuitGoodsNoticeBill.html';
                    var title = 'B2B退货通知单';
                    $scope.addTab(title,url);
                }
            }

        }]);