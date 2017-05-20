/**
 * Created by cj on 2017/4/24.
 * 过滤整形为0的数字
 */
angular.module("klwkOmsApp")
    .filter("isZero",function(){
        return function (input,name) {
            if(typeof input === 'number' && input === 0) {
                return '';
            }
            // 是否有配件(特殊情况)
            if(name == 'spareparts') {
                return '';
            }
            return input;
        }

    });