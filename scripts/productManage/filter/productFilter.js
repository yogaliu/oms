/**
 * Created by cj on 2017/4/10.
 */
angular.module("klwkOmsApp")
    .filter("productFilter",function(){
        return function (input,content) {
             if (content == 'spareparts') {
                var spareparts;
                switch (input) {
                    case 0:
                        spareparts = false;
                        break;
                    case 1:
                        spareparts = true;
                        break;
                }
                return spareparts;
            } else {
                return input;
            }


        }

    });

