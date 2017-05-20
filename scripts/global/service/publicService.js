/**
 * 查询条件服务
 * */
angular.module("klwkOmsApp")
	.factory('publicService', ["ApiService", "WAP_CONFIG","$rootScope",function(ApiService, WAP_CONFIG,$rootScope) {
		
		/*
		 * 收藏商品
		 * */
		function addCollect(good_id,etype){
			//如果没有记录用户信息
			if($.isEmptyObject(userInfo)){
				//获取用户状态
				getUserState().then(function(responseData){
					//如果没有获取用户信息（没有登录）
					if(responseData.status == 0){
						var backUrl = base64_encode(window.location.href);
						window.location.href="/index.php/Wap/Index/login.html?backUrl="+backUrl;
					}
					//如果获取到用户信息
					else if(responseData.status == 1){
						userInfo = responseData.data;
						//id:房产id、cid:用户id
						addCollectAction(userInfo.cid,good_id,etype);
					}
				});
			}else{
				//如果已经缓存了用户信息
				addCollectAction(userInfo.cid,good_id,etype);
			}
		}
		
		
		/*
		 * 删除收藏商品
		 * */
		function delCollect(good_id,etype){
			//如果没有记录用户信息
			if($.isEmptyObject(userInfo)){
				//获取用户状态
				getUserState().then(function(responseData){
					//如果没有获取用户信息（没有登录）
					if(responseData.status == 0){
						var backUrl = base64_encode(window.location.href);
						window.location.href="/index.php/Wap/Index/login.html?backUrl="+backUrl;
					}
					//如果获取到用户信息
					else if(responseData.status == 1){
						userInfo = responseData.data;
						//id:房产id、cid:用户id
						delCollectAction(userInfo.cid,good_id,etype);
					}
				});
			}else{
				//如果已经缓存了用户信息
				delCollectAction(userInfo.cid,good_id,etype);
			}
		}
		
		/*
		 * 收藏的action
		 * */
		function delCollectAction(user_cid,good_id,etype){
			//id:房产id、cid:用户id
			var myurl = WAP_CONFIG.path + "/Estate/delCollect.html";
			var defaultParams = {
				"id":good_id,
				"etype":etype,
				"cid":user_cid
			};
			var promise = ApiService.post(myurl,defaultParams);
			promise.then(function(responseData){
				if(responseData.status == 1){
					if(responseData.status == 1){
						console.log("删除成功");
					}else{
						console.log("删除失败");
					}
				}
			});
		}
		
		/*
		 * 收藏的action
		 * */
		function addCollectAction(user_cid,good_id,etype){
			//id:房产id、cid:用户id
			var myurl = WAP_CONFIG.path + "/Estate/addCollect.html";
			var defaultParams = {
				"id":good_id,
				"etype":etype,
				"cid":user_cid
			};
			var promise = ApiService.post(myurl,defaultParams);
			promise.then(function(responseData){
				if(responseData.status == 1){
					console.log("收藏成功");
				}else{
					console.log("收藏失败");
				}
			});
		}
		
		
		/*
		 * 获取用户状态,判断用户是否需要登录
		 * */
		function getUserState(){
			var myurl = WAP_CONFIG.path + "/Estate/getThisUser.html";
			var promise = ApiService.post(myurl);
			/*
			promise.then(function(responseData){
				if(responseData.status == 0){
					window.location.href="/index.php/Wap/Index/login.html";
				}
			});
			*/
			return promise;
		}
		
		/*
		 * get 用户信息
		 * */
		var userInfo = {};
		function getUserInfo(){
			return userInfo;
		}
		function setUserInfo(targetObj){
			targetObj = targetObj || {};
			userInfo = targetObj;
		}
		
		/*
		 * 初始化 用户信息
		 * */
		function initUserInfo(){
			var myurl = WAP_CONFIG.path + "/Estate/getThisUser.html";
			var promise = ApiService.post(myurl);
			promise.then(function(responseData){
				if(responseData.status == 1){
					userInfo = responseData.data;
				}
			});
		}
		
		
		
		/*
		 * list 列表 渲染方法
		 * state:1初始化，2刷新，3加载更多
		    //list显示的内容
	        $scope.goodlists = [];  
	        //第一次是否有数据的  
	        $scope.isHaveData = true;  
	        //list查询条件
	        $scope.queryCondition = {
	        	page:0
	        }
		 */
		function initList(__scope__,response){
			if(response.status == 1){
                //如果获取到的数据不为空  
                if(response.data != null && response.data !="" && response.data !=undefined){  
                    //获取数据，在原来的数据基础上追加信息  
                    __scope__.goodlists = __scope__.goodlists.concat(response.data);  
                    //判断当前页是否是最后一页，如果是，就不再发送请求
                    if(__scope__.queryCondition.page >= response.page_config.total_page){  
                        __scope__.isHaveData = false;  
                    }else{
                    	__scope__.isHaveData = true;
                    }
                }else{  
                    //如果数据为空  
                    __scope__.isHaveData = false;  
                }
			}
			//没有数据
			else if(response.status == 0){
				 __scope__.isHaveData = false;
			}
            
			__scope__.$broadcast('scroll.infiniteScrollComplete');
		}
		
		/**
		 * 获取查询条件数据，返回promise对象
		 * */
		function getQueryConditionData(etype){
			//etype：1、租房；2、二手房；3、新房；4、商铺；5、写字楼
			var myurl = WAP_CONFIG.path + "/Estate/getFilter.html";
			var promise = ApiService.post(myurl,{
				etype:etype
			});
			return promise;
		}
		
		/*
		 * 推荐给用户的房子
		 * Id:房产id、limit:限制条数
		 * */
		function recommendHouse(params){
			params = params || {};
			var myurl = WAP_CONFIG.path + "/Estate/alsoLike.html";
			var defaultParams = {
				id:1,
				limit:5
			};
			defaultParams = $.extend(defaultParams,params)
			var promise = ApiService.post(myurl,defaultParams);
			return promise;
		}

		function getAreaList(){
			var myurl = WAP_CONFIG.path + "/Weituo/getArea.html";
			var promise = ApiService.post(myurl);
			return promise;
		}


		/*
		 * 上传图片
		 * */
		function uploadFile(mysetting){
			function startUpload(){
				$.ajaxFileUpload({
					url : WAP_CONFIG.path+mysetting.url, //需要链接到服务器地址
					secureuri : false, //是否使用安全方式 https
					fileElementId : mysetting.fileElementId, //文件选择框的id属性
					dataType: 'json', //服务器返回的格式，可以是xml，默认还是用js最喜欢的json
					data: mysetting.data,
					success: mysetting.success,  //相当于java中try语句块的用法，这里data是你post后返回的结果，要与dataType类型匹配
					error: mysetting.error //相当于java中catch语句块的用法
				});
			}
			//检测参数
			mysetting = mysetting || {};
			var defaultSetting = {
				url : "/Repair/updateImg",
				data : "",
				fileElementId : "",
				success : function(){},
				error:function(){}
			};
			//覆盖默认参数
			mysetting = $.extend(defaultSetting,mysetting);
			startUpload(mysetting);
		}
				
		//返回service的功能
		return {
			"uploadFile":uploadFile,
			"addCollect":addCollect,
			"delCollect":delCollect,
			"addCollectAction":addCollectAction,
			"getQueryConditionData":getQueryConditionData,
			"getUserState":getUserState,
			"setUserInfo":setUserInfo,
			"recommendHouse":recommendHouse,
			"getAreaList":getAreaList,
			"initList":initList
		};

	}]);