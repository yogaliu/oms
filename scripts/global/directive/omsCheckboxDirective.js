/**
 * checkbox 全选 和 选择样式的变化
 * */
angular.module("klwkOmsApp").directive("omsCheckboxDirective", function($timeout){
	return {
		restrict: 'A',
		scope:{
			// 是否是全选按钮，true 表示是全选按钮，false 表示不是全选按钮
			isCheckboxSwitch : "@",
			// 开关控制的范围
			switchScope:"@"
		},
		controller:function($scope){
		},
		link: function(scope, element, attr) {
			// 给当前控件绑定时间，是否选中
			element.on("click",function(){
				// 如果是有总开关控制
				if(attr["isCheckboxSwitch"] !== undefined && attr["switchScope"] !== undefined){
					var isCheckboxSwitch = attr["isCheckboxSwitch"];
					var switchScope = attr["switchScope"];
					// 如果是全选 checkbox
					if(isCheckboxSwitch == "true"){
						// 如果已经是选中了的，则 让内容全部不选中
						if(element.hasClass("icon-sel-zhengque")){
							angular.element(attr["switchScope"]).find(".icon-sel.iconfont[is-checkbox-switch='false']").removeClass("icon-sel-zhengque");
						}
						// 如果没有选中，则 让内容全部选中
						else{
							angular.element(attr["switchScope"]).find(".icon-sel.iconfont[is-checkbox-switch='false']").addClass("icon-sel-zhengque");
						}
						element.toggleClass("icon-sel-zhengque");
					}
					// 如果不是全选按钮
					else{
						element.toggleClass("icon-sel-zhengque");
						// 所有的checkbox
						var allCheckboxLength = angular.element(attr["switchScope"]).find(".icon-sel.iconfont[is-checkbox-switch='false']").length;
						// 选中的checkbox
						var allCheckboxedLength =  angular.element(attr["switchScope"]).find(".icon-sel.iconfont.icon-sel-zhengque[is-checkbox-switch='false']").length;
						// 如果选中的checkbox 与 所有的checkbox 数量相同，则表示全选，那么全选按钮应该关联选中
						if(allCheckboxLength == allCheckboxedLength){
							angular.element(attr["switchScope"]).find("[is-checkbox-switch='true']").addClass("icon-sel-zhengque");
						}
						// 如果选中的checkbox 与 所有的checkbox 数量不相同，则表示全选，那么全选按钮应该关联不选中
						else{
							angular.element(attr["switchScope"]).find("[is-checkbox-switch='true']").removeClass("icon-sel-zhengque");
						}
					}

				}else{
					element.toggleClass("icon-sel-zhengque");
				}

			});

		}
	}
});
