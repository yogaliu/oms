/**
 * 计数器
 * */
angular.module("klwkOmsApp").directive("jiShuQi", function(){
	return {
		restrict: "A",
		template:'<div style="width: 110px;"><span style="cursor:pointer;float: left;background-color: #f9f9f9;border-radius: 4px 0 0 4px;line-height: 30px;padding:0 6px;font-size: 28px;line-height: 34px;"ng-click="minus($event)">-</span><input type="text"style="float: left;width: 30px;padding: 6px;border-top:1px solid #f9f9f9;border-bottom:1px solid #f9f9f9;background-color: #fff;text-align:center"ng-model="mycount"readonly><span style="cursor:pointer;float: left;background-color: #f9f9f9;border-radius: 0 4px 4px 0;line-height: 30px;padding:0 5px;font-size: 18px;line-height: 34px;"ng-click="plus($event)">+</span></div>',
		replace: true,
		//隔离scope
		scope:{
			number:"@"
		},
		controller:["$scope",function($scope){

			$scope.minusCallback = function(myevent,count){
				var currentObj = myevent.target;
				var itemName = $(currentObj).closest("li.item-avatar").attr("item");
			};

			$scope.pluseCallback = function(myevent,count){
				var currentObj = myevent.target;
				var indexnumber = $(currentObj).closest("li.item-avatar").attr("indexnumber");
			};

		}],
		//countGroupBtnController    为当前控制器的别名，注入其中
		link:function(scope, element, attrs, countGroupBtnController) {
			//定义初始化的值
			scope.mycount = scope.number;

			//获取指令传递过来的参数
			//alert(scope.number);

			//定义减方法
			scope.minus=function(myevent){
				if(scope.mycount -1 >= 0){
					scope.mycount = parseFloat(scope.mycount) -1;
					//调用回调函数
					this.minusCallback(myevent,scope.mycount)
				}
			};
			//定义加 方法
			scope.plus=function(myevent){
				scope.mycount=parseFloat(scope.mycount) + 1;
				//调用回调函数
				this.pluseCallback(myevent,scope.mycount)
			};

		}
	}
});
