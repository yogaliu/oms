/**
 * Created by cj on 2017/4/5.
 * 若为true/false，则为空
 * */
angular.module("klwkOmsApp")
    .filter("isBoolean",function(){

        return function (input) {
            if(typeof input == 'boolean'  || input==='<i></i>') {
                return ' ';

            }
            return input;
        }

    });