/**
 * Created by jx on 2017/3/21.
 */
angular.module("klwkOmsApp")
    .controller("scanQuitGoodsBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG",
        function ($scope, $rootScope, $state, WAP_CONFIG) {
            //进入页面需要执行的方法
            function init() {
                //加载下拉框
                $('#runSchedule').selectPlug();
            }

            init();
            $rootScope.activePage = "b2bWeiPin";

        }]);