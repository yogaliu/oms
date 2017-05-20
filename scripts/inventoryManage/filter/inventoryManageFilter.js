/**
 * Created by xs on 2017/4/7.
 */
angular.module("klwkOmsApp")
    .filter('inventoryManageFilter',function () {
        return function (input,name) {
            if(name == 'status') {
                switch (input){
                    case 2:
                        return '已审核';
                        break;
                    case 1:
                        return '待审核';
                        break;
                    default:
                        return input;
                        break;
                }
            }else {
                return input;
            }
        }
    });
