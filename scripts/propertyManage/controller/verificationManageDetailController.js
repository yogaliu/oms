/**
 * Created by jx on 2017/3/17.
 */
/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("verificationManageDetailController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "verificationManageDetailService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, verificationManageDetailService) {
            function init() {
                //查询核销管理详情
                verificationManageDetailService.VerifivationDetailQuery($scope);

                //tab栏切换，默认为first页面
                $scope.tab = 'first';

                //tab栏切换函数
                $scope.isShow = function (content) {
                    $scope.tab = content;
                };

                //返回
                $scope.returnFun= function () {
                    var index = $('#verificationManageDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/propertyManage/verificationManage.html';
                    $scope.option[index].name = '核销管理';
                }
            }

            init();



        }]);