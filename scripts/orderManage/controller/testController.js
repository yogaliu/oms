/**
 * 创建了一个indexController
 * */
angular.module("klwkOmsApp")
	.controller("testControoller", ["$scope","$rootScope" ,function($scope,$rootScope) {

		//进入页面需要执行的方法
		function init(){
			console.log("testControoller");
		}
		init();
		$rootScope.activePage = "orderManage";

	}]);
