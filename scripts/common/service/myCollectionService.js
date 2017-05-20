/**
 * 查询条件服务
 * */
angular.module("klwkOmsApp")
	.factory('myCollectionService', ["ApiService", "WAP_CONFIG","publicService",function(ApiService, WAP_CONFIG,publicService) {
		
		/*
		 * 获取二手房列表
		 * cid 用户id   page 页码
		 * */
		function getCollectionList(__scope__){
			//检测查询参数
			__scope__.queryCondition = __scope__.queryCondition || {};
			var myurl = WAP_CONFIG.path + "/Estate/collectList.html";
			var defaultParams = {
				page:1
			};
			defaultParams = $.extend(defaultParams,__scope__.queryCondition);
			
			var promise = ApiService.post(myurl,defaultParams);
			promise.then(function(response){
				//自动判断是否继续发送请求
				publicService.initList(__scope__,response);
			});
		}
		
		
		
		//返回service的功能
		return {
			"getCollectionList":getCollectionList
		};

	}]);