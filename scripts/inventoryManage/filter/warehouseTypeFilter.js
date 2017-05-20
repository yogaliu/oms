/**
 * Created by xs on 2017/4/7.
 */
angular.module("klwkOmsApp")
    .filter('warehouseTypeFilter',function () {
        return function (input) {
            switch (input){
                case 3:
                    return '独立仓库';
                    break;
                case 2:
                    return '共享仓库';
                    break;
                case 1:
                    return '实体仓库';
                    break;
                default:
                    return '';
                    break;
            }
        }
    });
