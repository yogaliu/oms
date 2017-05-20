/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('supplierInformationService', ["ApiService","APP_MENU", function (ApiService,APP_MENU) {
        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 供应商信息
         * @constructor
         */
        var query = function (scope,PageIndex,PageSize,data) {
            var url = "/Purchase/Supplier/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data":!data?[]:[{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.searchItem,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {

                if(res.success) {
                    //列表数据
                    scope.tableList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index,obj) {
                        //结算方式根据id匹配name
                        if(obj.suppliersettlementtype !== undefined){
                            obj.suppliersettlementtypename = APP_MENU.purchaseMethod[obj.suppliersettlementtype];
                        }
                    });
                }
            });
        };



        return {
            "query": query
        };

    }]);