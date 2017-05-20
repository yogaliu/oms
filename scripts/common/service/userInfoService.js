/**
 * 查询条件服务
 * */
angular.module("klwkOmsApp")
	.factory('userInfoService', ["ApiService", "WAP_CONFIG","publicService",function(ApiService, WAP_CONFIG,publicService) {
		
		//返回service的功能
		return {
			"cid": "",
			"xid": "",
			"username": "",
			"mobile": "",
			"cname": null,
			"jifen": "",
			"mobile_status": "",
			"email_status": "",
			"third_account": null
		};

	}]);