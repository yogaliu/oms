/**
 * Created by cj on 2017/5/15.
 */
angular.module("klwkOmsApp")
    .filter("isCost",["$sce",function($sce){

        return function (input) {
            if(input == 'cost') {
                return $sce.trustAsHtml('<span style="display:inline-block;width: 15px;height: 15px;border: 1px solid #000000"></span>包邮' +
                       '<span style="margin-left: 5px;display:inline-block;width: 15px;height: 15px;border: 1px solid #000000;"></span>自付邮费'+
                       '<span style="margin-left: 5px;display:inline-block;width: 15px;height: 15px;border: 1px solid #000000"></span>其他(默认其他)');
            }
            return input;
        }

    }]);