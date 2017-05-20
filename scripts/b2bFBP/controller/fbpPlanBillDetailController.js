/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpPlanBillDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "ApiService","fbpPlanBillDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG, ApiService,fbpPlanBillDetailService) {

            function init() {
                //加载下拉框
                $('#fbpPlanBillDetail').selectPlug();
                //tab栏切换，默认为first页面
                $scope.tab = 'first';
                //获取计划单号
                $scope.plancode=$rootScope.params.plancode;
                //获取出仓仓库名
                $scope.outwarehousename=$rootScope.params.outwarehousename;
                //获取入仓仓库名
                $scope.inwarehousename=$rootScope.params.inwarehousename;
                //计划单列表头部
                $scope.planListThead=fbpPlanBillDetailService.configData.columns;
                //初始化计划表体数据
                fbpPlanBillDetailService.ListInterface.getPlanList($scope)
                //日志头部
                $scope.logListThead=fbpPlanBillDetailService.configData.logColumns;
                //日志身体
                fbpPlanBillDetailService.ListInterface.getLogList($scope);
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
                    var url = '../template/b2bFBP/fbpPlanBill.html';
                    var title = 'B2B计划单';
                    $scope.addTab(title,url);
                }
            }



        }]);


