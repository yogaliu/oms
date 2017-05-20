/**
 * Created by cj on 2017/4/6.
 */
angular.module("klwkOmsApp")
    .filter("trustHtml",function($sce){
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });