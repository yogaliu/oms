/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .filter('configManageFilter',function () {
        return function (input,name) {
            if(name == 'SMSBalance') {
                if(typeof input == 'boolean'){
                    return '';
                }else{
                    return input;
                }
            }else {
                return input;
            }
        }
    });