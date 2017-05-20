/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpNoticeBillDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","fbpNoticeBillDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG,fbpNoticeBillDetailService) {

            function init(){
                //加载下拉框
                $('#fbpNoticeBillDetail').selectPlug();
                //tab栏切换，默认为first页面
                $scope.tab = 'first';
                //初始化
                //获取传过来的通知单号
                $scope.OutCode=$rootScope.params.OutCode;
                //退货通知单详情头
                $scope.planListThead=fbpNoticeBillDetailService.configData.columns;
                //退货通知表体
                fbpNoticeBillDetailService.ListInterface.getPlanList($scope);
                //日志头部
                $scope.logListThead=fbpNoticeBillDetailService.configData.logColumns;
                //获取日志表体
                fbpNoticeBillDetailService.ListInterface.getLogList($scope);
            }
            init();
            $scope.domOperate={
                //返回
                backTolist:function(){
                    $rootScope.params = {};
                    var url = '../template/b2bFBP/fbpNoticeBill.html';
                    var title = 'B2B通知单';
                    $scope.addTab(title,url);
                }
            };
            //tab栏切换函数
            $scope.isShow= function (content) {
                $scope.tab = content;
            };
            $rootScope.activePage = "b2bBFP";

        }]);