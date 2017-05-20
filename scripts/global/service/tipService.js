/**
 * 查询条件服务
 * */
angular.module("klwkOmsApp")
	.factory('tipService', ["ApiService", "WAP_CONFIG","$ionicPopup",function(ApiService, WAP_CONFIG,$ionicPopup) {

		/*
		* alert 弹出提示
		* */
		var promptPopupObj;
		function prompt(){

			var mysetting = mysetting || {};
			var defaultSetting = {
				template: '<input type="password" ng-model="data.wifi">',
				title: 'Enter Wi-Fi Password',
				subTitle: 'Please use normal things',
				scope: $scope,
				buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Save</b>',
						type: 'button-positive',
						onTap: function(e) {
							if (!$scope.data.wifi) {
								//不允许用户关闭，除非他键入wifi密码
								e.preventDefault();
							} else {
								return $scope.data.wifi;
							}
						}
					},
				]
			};
			mysetting = $.extend(defaultSetting,mysetting);

			promptPopupObj = $ionicPopup.show({
				template: mysetting.template,
				title:mysetting.title,
				subTitle:mysetting.subTitle,
				scope: mysetting.scope,
				buttons: mysetting.buttons
			});
			myPopup.then(function(res) {
				console.log('Tapped!', res);
			});
		}


		/**
		 * 一个确认对话框
		 */
		var confirmPopupObj;
		function confirm(mysetting){
			var mysetting = mysetting || {};
			var defaultSetting = {
				title:"Don\'t eat that!",
				template:"It might taste good",
				sureCallback:function(){

				},
				falseCallBack:function(){

				}
			};
			mysetting = $.extend(defaultSetting,mysetting);

			confirmPopupObj = $ionicPopup.confirm({
				title: mysetting.title,
				template: mysetting.template
			});
			confirmPopupObj.then(function(res) {
				if(res) {
					mysetting.sureCallback();
				}else {
					mysetting.falseCallBack();
				}
			});
		}

		/*
		* 一个提示对话框
		* */
		var alertPopupObj;
		function alert(mysetting){
			var mysetting = mysetting || {};
			var defaultSetting = {
				title:"Don\'t eat that!",
				template:"It might taste good",
				callback:function(){

				}
			};
			mysetting = $.extend(defaultSetting,mysetting);

			alertPopupObj = $ionicPopup.alert({
				title: mysetting.title,
				template: mysetting.template
			});
			alertPopupObj.then(function(res) {
				mysetting.callback();
			});
		}

		//返回service的功能
		return {
			"alert":alert,
			"prompt":prompt,
			"confirm":confirm
		};

	}]);