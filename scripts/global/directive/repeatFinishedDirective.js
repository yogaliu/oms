/**
 * 计数器
 * */
angular.module("klwkOmsApp").directive("repeatFinishedDirective", function($timeout){
	return {
		restrict: 'A',
		scope:{
			condition:"@",
			myaction:"&repeataction",
			"repeatIndex":"@"
		},
		controller:function($scope){
		},
		link: function(scope, element, attr) {

			// 查询条件是真，则触发该事件
			if (attr.condition == "true") {
				$timeout(function() {
					// 触发事件
					scope.$emit('conditionCallback');
					// 处理自定义的方法
					scope.myaction();
				});
			}
		}
	}
});
