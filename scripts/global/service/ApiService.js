/**
 * 定义ApiService服务
 * 功能：专门向服务器发送post 和 get请求
 * */
angular.module("klwkOmsApp")
	.factory('ApiService', ["$window", "$http", "WAP_CONFIG", "$q", "$log","APP_COLORS","httpCacheService",
							function($window, $http, WAP_CONFIG, $q, $log,APP_COLORS,httpCacheService) {

		var _api = WAP_CONFIG;
		var endpoint = _api.host + ':' + _api.port + _api.path ;
		// md5 加密的Key
		var md5_key = _api.md5Key;

		// public api
		return {
			//发送服务器的域名+端口，例如http://deve.sqhzg.cn:80
			endpoint: endpoint,

			getMd5code:function(){
				var key = md5_key;
				var timestamp = new Date().format("yyyy-MM-dd hh:mm:ss");
				var result = hex_md5(key + timestamp + key);
				return {
					"timestamp": timestamp,
					"code" : result
				}
			},

			/**
			 * 隐藏所有layer蒙层
			 */
			hideAllLayer : function(){
				layer.closeAll('loading');
			},

			/**
			 * 获取发送请求的基本参数
			 * @param paramArray 需要获取的参数ID，用数组来封装
			 * @returns {{TimeStamp: (string|*), Sign: *, Version: string, UserId: *, UserName: *, LoginKey: *}}
			 */
			getBasicParamobj : function(paramArray){
				var that = this;
				var paramObj = {};
				// 如果没有传递参数，则返回默认的参数对象
				if(paramArray === undefined){
					paramObj = {
						TimeStamp: that.getMd5code().timestamp,
						Sign: that.getMd5code().code,
						Version: WAP_CONFIG.version,
						UserId: APP_COLORS.UserId,
						UserName: APP_COLORS.username,
						LoginKey: APP_COLORS.LoginKey
					};
				}
				// 如果传递的参数是数组，则根据数组的内容返回参数对象
				else{
					var length = paramArray.length;
					for(var i = 0; i < length; i++){
						var curentKey = paramArray[i];
						if(curentKey == "TimeStamp"){
							paramObj["TimeStamp"] = ApiService.getMd5code().timestamp;
						}else if(curentKey == "Sign"){
							paramObj["TimeStamp"] = ApiService.getMd5code().code;
						}else if(curentKey == "Version"){
							paramObj["TimeStamp"] = WAP_CONFIG.version;
						}else if(curentKey == "UserId"){
							paramObj["TimeStamp"] = WAP_CONFIG.UserId;
						}else if(curentKey == "UserName"){
							paramObj["TimeStamp"] = WAP_CONFIG.UserName;
						}else if(curentKey == "LoginKey"){
							paramObj["TimeStamp"] = WAP_CONFIG.LoginKey;
						}
					}
				}
				return paramObj;
			},

			//post请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），
			post: function(url, data) {
				url = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;

				//判断用户是否传递了参数，如果有参数需要传递参数
				if(data != null && data != undefined && data != ""){
					tempPromise = $http.post(url,data);
				}else{
					tempPromise = $http.post(url);
				}
				tempPromise.success(function(data,header,config,status) {
					deferred.resolve(data);
				}).error(function(msg, code) {
					deferred.reject(msg);
					$log.error(msg, code);
				});
				return deferred.promise;
			},

			// postLoad 请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），
			postLoad : function(url, data){
				var index = layer.load(2, {time: 10*1000});
				url = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;

				//判断用户是否传递了参数，如果有参数需要传递参数
				if(data != null && data != undefined && data != ""){
					tempPromise = $http.post(url,data);
				}else{
					tempPromise = $http.post(url);
				}
				tempPromise.success(function(data,header,config,status) {
					deferred.resolve(data);
					setTimeout(function(){
						layer.close(index);
					},300);
				}).error(function(msg, code) {
					deferred.reject(msg);
					$log.error(msg, code);
					setTimeout(function(){
						layer.close(index);
					},300);
				});
				return deferred.promise;

			},

			//get请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），
			get: function(url, data) {
				url = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;
				//显示加载进度
				//判断用户是否传递了参数，如果有参数需要传递参数
				if(data != null && data != undefined && data != ""){
					tempPromise = $http.get(url,data);
				}else{
					tempPromise = $http.get(url);
				}
				tempPromise.success(function(data,header,config,status) {
					deferred.resolve(data);
				}).error(function(msg, code) {
					deferred.reject(msg);
					$log.error(msg, code);
				});
				return deferred.promise;
			},

			// getLoad 请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），
			getLoad : function(url, data){
				var index = layer.load(2, {time: 50*1000});

				url = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;
				//显示加载进度
				//判断用户是否传递了参数，如果有参数需要传递参数
				if(data != null && data != undefined && data != ""){
					tempPromise = $http.get(url,data);
				}else{
					tempPromise = $http.get(url);
				}
				tempPromise.success(function(data,header,config,status) {
					deferred.resolve(data);
					setTimeout(function(){
						layer.close(index);
					},300);
				}).error(function(msg, code) {
					deferred.reject(msg);
					$log.error(msg, code);
					setTimeout(function(){
						layer.close(index);
					},300);
				});
				return deferred.promise;
			},

			/**
			 * 监听多个条件，—— 条件成功，需要执行deffer.resolve() 方法，如果失败，则执行 deffer.reject()方法
			 * @returns {Promise}
			 * function logicFunc(deffer){
                    // 成功调用resolve 的方法
                    if(true){
                        deffer.resolve('func1 is OK');
                    }
                    // 失败调用 reject方法
                    else{
                        deffer.reject('func1 IS BAD')
                    }
                }
			 */
			listenAll : function(){
				function aaa (myfunc){
					var deffer = $q.defer();
					myfunc(deffer);
					return deffer.promise;
				}

				var length = arguments.length;
				var results = {};
				for(var i = 0; i < length; i++){
					results["promise" + i] = aaa(arguments[i]);
				}

				var p=$q.all(results);
				return p;
			},


			/**
			 * 使用get请求并且缓存数据
			 * @param url
			 * @param data
			 * @returns {deferred.promise|{then, catch, finally}}
			 */
			getCache : function(url, data){
				var targetUrl = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;

				if(httpCacheService[url]){
					deferred.resolve(httpCacheService[url]);
				} else {
					//判断用户是否传递了参数，如果有参数需要传递参数
					if(data != null && data != undefined && data != ""){
						tempPromise = $http.get(targetUrl,data);
					}else{
						tempPromise = $http.get(targetUrl);
					}
					tempPromise.success(function(data,header,config,status) {
						deferred.resolve(data);
						httpCacheService[url] = response;
					}).error(function(msg, code) {
						deferred.reject(msg);
						$log.error(msg, code);
					});
				}

				return deferred.promise;
			},

			/**
			 * 使用post请求并且缓存数据
			 * @param url
			 * @param data
			 * @returns {deferred.promise|{then, catch, finally}}
			 */
			postCache : function(url, data){
				var targetUrl = endpoint + url;
				var deferred = $q.defer();
				var tempPromise;

				if(httpCacheService[url]){
					deferred.resolve(httpCacheService[url]);
				} else {
					//判断用户是否传递了参数，如果有参数需要传递参数
					if(data != null && data != undefined && data != ""){
						tempPromise = $http.post(targetUrl,data);
					}else{
						tempPromise = $http.post(targetUrl);
					}
					tempPromise.success(function(data,header,config,status) {
						deferred.resolve(data);
						httpCacheService[url] = data;
					}).error(function(msg, code) {
						deferred.reject(msg);
						$log.error(msg, code);
					});
				}

				return deferred.promise;
			}


		};

	}]);