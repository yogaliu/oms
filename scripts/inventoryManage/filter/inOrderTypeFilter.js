/**
 * Created by hb on 2017/4/7.
 * 单据状态
 */
angular.module("klwkOmsApp")
    .filter('inOrderTypeFilter',["APP_MENU",function (APP_MENU) {
        return function (input,name) {
            var inventoryOutboundOrderObj = APP_MENU.inventoryOutboundOrder;
            if(name == 'status') {
                if(input == 0 ||input == 1 ||input == 2 ||input == 3 ||input == 4 ||input == 5){
                    return inventoryOutboundOrderObj[input.toString()];
                }else{
                    return "状态不对";
                }

            }else {
                return input;
            }
        }
    }]);
	
