
/**
 * 在为null， undefined， ""， 的情况下面设置默认值
 * */
angular.module("klwkOmsApp")
	.filter("setDefaultValueWithoutData",function(){
		return function(inputValue,defaultValue){
			if(inputValue === null || inputValue === undefined || inputValue === ""){
				return '--';
			}
			return inputValue;
		}
	});