/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpQuitGoodsNoticeBillDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","fbpQuitGoodsNoticeBillDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG,fbpQuitGoodsNoticeBillDetailService) {

            function init(){
                //加载下拉框
                $('#fbpQuitGoodsNoticeBillDetail').selectPlug();
                //tab栏切换，默认为first页面
                $scope.tab = 'first';
                //获取传过来的退货通知单号
                $scope.returnordernoticeid=$rootScope.params.returnordernoticeid;
                //退货通知单详情头
                $scope.planListThead=fbpQuitGoodsNoticeBillDetailService.configData.columns;
                //退货通知表体
                fbpQuitGoodsNoticeBillDetailService.ListInterface.getPlanList($scope);
                //日志头部
                $scope.logListThead=fbpQuitGoodsNoticeBillDetailService.configData.logColumns;
                //获取日志表体
                fbpQuitGoodsNoticeBillDetailService.ListInterface.getLogList($scope);
            }
            init();
            $scope.domOperate={
                //返回
                backTolist:function(){
                    $rootScope.params = {};

                    var url = '../template/b2bFBP/fbpQuitGoodsNoticeBill.html';
                    var title = 'B2B退货通知单';
                    $scope.addTab(title,url);
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