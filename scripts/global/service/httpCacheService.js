/**
 * Created by xs on 2017/4/10.
 */
angular.module("klwkOmsApp")
    .factory('httpCacheService', ["$cacheFactory",function($cacheFactory){
        return $cacheFactory("http");
    }]);