/**
 * 定义 全局配置文件
 */
angular.module('klwkOmsApp')
	// 配置懒加载 $ocLazyLoadProvider
	.config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
		'use strict';


		// Lazy Load modules configuration
		$ocLazyLoadProvider.config({
			debug: false,
			events: true,
			modules: APP_REQUIRES.modules
		});

	}]);