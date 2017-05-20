/**
 * 定义常量WAP_CONFIG;WAP为当前子模块功能
 * */
angular.module('klwkOmsApp')
	.config(["$stateProvider","$urlRouterProvider","RouteHelpersProvider",function ($stateProvider, $urlRouterProvider,RouteHelpers) {
		// 如果没有匹配的路径，则设置默认路径
		$urlRouterProvider.otherwise('/login');
		$stateProvider
       		 //登陆页面
            .state('login',{
                url: '/login',
                templateUrl:'../template/common/login.html',
                controller: "loginController"
            })

			//首页
			.state('index',{
				url: '/index',
				abstract:true,
				templateUrl:'../template/common/app.html',
				controller:'indexController'
			})

			/*************************订单管理********************/
			//订单列表
			.state('index.orderList',{
				url: '/orderList',
				templateUrl:'../template/orderManage/orderList.html',
				controller: "orderListController"
			})


	}]);

