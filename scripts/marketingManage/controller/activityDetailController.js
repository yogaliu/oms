/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("activityDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "activityDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, activityDetailService) {

            function init() {
                //接收列表页的参数
                $scope.params=$rootScope.params;

                //查询内部便签
                activityDetailService.ActivityRegisterMessageGet($scope,true);
                //查询活动商品信息
                activityDetailService.ActivityRegisterDetailGet($scope,true);
                //查询操作记录
                activityDetailService.SystemLogGetById($scope,true);

                //tab栏切换，默认为first页面
                $scope.tab = 'first';

                //tab栏切换函数
                $scope.isShow = function (content) {
                    $scope.tab = content;
                };

                //计算销量
                $scope.countSale=function () {
                    activityDetailService.ActivityRegisterupdatesalesqty($scope,$scope.params.tableList.id);
                };

                //返回
                $scope.returnFun= function () {
                    var index = $('#activityDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/activityApply.html';
                    $scope.option[index].name = '活动报名';
                }
            }

            init();


        }]);