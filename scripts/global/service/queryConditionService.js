/**
 * 查询条件服务
 * */
angular.module("klwkOmsApp")
	.factory('queryConditionService', ["ApiService", "WAP_CONFIG",function(ApiService, WAP_CONFIG) {

		//etype：1、租房；2、二手房；3、新房；4、商铺；5、写字楼
		var myurl = WAP_CONFIG.path + "/Estate/getFilter.html";
		var queryCondition = {};
		//表示一次都没有访问
		var visitedFlag = false; 
		
		//设置店铺的查询条件
		function setShopQueryCondition(){
			var promise = ApiService.post(myurl,{
				etype:4
			});
			promise.then(function(responseData){
				if(responseData.status == 1){
					queryCondition.shopQuery = responseData.data;
				}
			});
		}
		
		//设置写字楼的查询条件
		function setOfficeQueryCondition(){
			var promise = ApiService.post(myurl,{
				etype:5
			});
			promise.then(function(responseData){
				if(responseData.status == 1){
					queryCondition.officeQuery = responseData.data;
				}
			});
		}
		
		//设置租房的查询条件
		function setRentQueryCondition(){
			var promise = ApiService.post(myurl,{
				etype:1
			});
			promise.then(function(responseData){
				if(responseData.status == 1){
					queryCondition.rentQuery = responseData.data;
				}
			});
		}
		
		//设置新房的查询条件
		function setNewHouseQueryCondition(){
			var promise = ApiService.post(myurl,{
				etype:3
			});
			promise.then(function(responseData){
				if(responseData.status == 1){
					queryCondition.newHouseQuery = responseData.data;
				}
			});
		}
		
		//设置二手房的查询条件
		function setSecondHouseQueryCondition(){
			var promise = ApiService.post(myurl,{
				etype:2
			});
			promise.then(function(responseData){
				if(responseData.status == 1){
					queryCondition.secondHouseQuery = responseData.data;
				}
			});
		}
		
		//获取店铺的查询条件
		function getShopQueryCondition(){
			if(queryCondition.shopQuery != null && queryCondition.shopQuery != undefined && queryCondition.shopQuery !=""){
				return queryCondition.shopQuery;
			}else{
				setShopQueryCondition();
				return null;
			}
		}
		
		//获取写字楼的查询条件
		function getOfficeQueryCondition(){
			if(queryCondition.officeQuery != null && queryCondition.officeQuery != undefined && queryCondition.officeQuery !=""){
				return queryCondition.officeQuery;
			}else{
				setOfficeQueryCondition();
				return null;
			}
		}
		
		//获取租房的查询条件
		function getRentQueryCondition(){
			if(queryCondition.rentQuery != null && queryCondition.rentQuery != undefined && queryCondition.rentQuery !=""){
				return queryCondition.rentQuery;
			}else{
				setRentQueryCondition();
				return null;
			}
		}
		
		//获取新房房的查询条件
		function getNewHouseQueryCondition(){
			if(queryCondition.newHouseQuery != null && queryCondition.newHouseQuery != undefined && queryCondition.newHouseQuery !=""){
				return queryCondition.newHouseQuery;
			}else{
				setNewHouseQueryCondition();
				return null;
			}
		}
		
		//获取二手房的查询条件
		function getSecondHouseQueryCondition(){
			if(queryCondition.secondHouseQuery != null && queryCondition.secondHouseQuery != undefined && queryCondition.secondHouseQuery !=""){
				return queryCondition.secondHouseQuery;
			}else{
				setSecondHouseQueryCondition();
				return null;
			}
		}
		
		//获取所有的查询条件
		function initAll(){
			if(!visitedFlag){
				setShopQueryCondition();
				setOfficeQueryCondition();
				setRentQueryCondition();
				setNewHouseQueryCondition();
				setSecondHouseQueryCondition();
				//表示已经访问了
				visitedFlag = true;
			}
		}
		
		//设置没有访问
		function setUnVisited(){
			visitedFlag = false;
		}
		//设置有访问
		function setVisited(){
			visitedFlag = true;
		}
		
		//返回service的功能
		return {
			"getShopQueryCondition":getShopQueryCondition,
			"getOfficeQueryCondition":getOfficeQueryCondition,
			"getRentQueryCondition":getRentQueryCondition,
			"getNewHouseQueryCondition":getNewHouseQueryCondition,
			"getSecondHouseQueryCondition":getSecondHouseQueryCondition,
			"setShopQueryCondition":setShopQueryCondition,
			"setOfficeQueryCondition":setOfficeQueryCondition,
			"setRentQueryCondition":setRentQueryCondition,
			"setNewHouseQueryCondition":setNewHouseQueryCondition,
			"setSecondHouseQueryCondition":setSecondHouseQueryCondition,
			"setUnVisited":setUnVisited,
			"setVisited":setVisited,
			"initAll":initAll
		};

	}]);