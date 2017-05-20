/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inventoryInitController", ["$scope","$rootScope" ,function($scope,$rootScope) {

        //进入页面需要执行的方法
        function init(){


        }
        init();

        /*显示模态框*/
        $scope.showModal = function (name) {
            $("#" + name).modal("show");
        }

    }]);