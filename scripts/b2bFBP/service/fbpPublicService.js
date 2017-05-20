/**
 * Created by yoga on 2017/5/11.
 */

angular.module('klwkOmsApp')
.service('fbpPublicService',["ApiService","toolsService","APP_MENU",function(ApiService,toolsService,APP_MENU){
        //dom操作集合
        var orderListDomOperate = {
            //分页中向上翻页
            prevPage : function (scope) {
                scope.paginationConf.currentPage--;
                scope.paginationConf.type = 0;
                scope.paginationConf.extClick = true;
                scope.getPageIndex(scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
            },
            //分页中向下翻页
            nextPage : function (scope) {
                scope.paginationConf.currentPage++;
                scope.paginationConf.type = 1;
                scope.paginationConf.extClick = true;
                scope.getPageIndex(scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
            },
            calculateInde : function (scope) {
                scope.getPageIndex = function (currentPage, itemsPerPage) {
                    if(currentPage === 0 || currentPage== Math.ceil(scope.paginationConf.totalItems / itemsPerPage + 1 )) return;
                    scope.first = itemsPerPage * (currentPage - 1) + 1;
                    if (scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                        scope.last = scope.paginationConf.totalItems;
                    } else {
                        scope.last = currentPage * itemsPerPage;
                    }
                };
            }
        };
      return {
            DomOperate: orderListDomOperate,
        }
    }])