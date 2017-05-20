/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('purchaseAdviseService', ["ApiService","APP_MENU",
        function (ApiService,APP_MENU) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 获取关联商品规格信息
         * @constructor
         */
        var productQuery = function (scope, PageIndex, PageSize,data) {
            var url = "/Product/Product/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": !data?[]:[
                        // 商品代码
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Code",
                            "Name": "procode",
                            "Value": scope.productItem.productCode,
                            "Children": []
                        },
                        // 商品名称
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Description",
                            "Name": "prodes",
                            "Value":scope.productItem.productName,
                            "Children": []
                        },
                        // 规格代码
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "SkuCode",
                            "Name": "skucode",
                            "Value": scope.productItem.code,
                            "Children": []
                        },
                        // 规格名称
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "SkuName",
                            "Name": "skkuname",
                            "Value": scope.productItem.description,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Status",
                            "Name": "prostatus",
                            "Value": 1,
                            "Children": []
                        }
                    ],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    $.each(res.data, function (index, obj) {
                        obj.isProductSelect = false;
                        // 商品状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.productStatus[obj.status];
                        }
                        //商品类型根据id匹配name
                        if (obj.status !== undefined) {
                            obj.producttypename = APP_MENU.productType[obj.producttype];
                        }
                    });
                    scope.tableSkuList = res.data;
                    //总条数
                    scope.paginationSkuConf.totalItems = res.total;
                }
            });
        };

        /**
         * 采购建议
         * @constructor
         */
        var query = function (scope) {
            var url = "/Report/Dw/ReportProductOrderAnalysis/Query";
            var param = $.extend({
                'beginDate': scope.searchItem.beginDate,
                'endDate': scope.searchItem.endDate,
                'returnType': scope.searchItem.returnType,
                'productCode': scope.searchItem.productCode
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableList = res.data;
                }
            });

        };

        /**
         * 采购建议销量趋势
         * @constructor
         */
        var trend = function (scope) {
            var url = "/Report/VReportSalesOrderDetail/QueryProductCode";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SalesOrderPayDate",
                    "Name": "PayDateBegin",
                    "Value": scope.searchItem.beginDate,
                    "Children": []
                }, {
                    "OperateType": 4,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SalesOrderPayDate",
                    "Name": "PayDateEnd",
                    "Value": scope.searchItem.endDate,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value":  scope.searchItem.supplier,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $scope.draw = res.data;
                    scope.productPicChart();
                }
            });

        };

        return {
            "productQuery":productQuery,
            "query": query,
            "trend": trend
        };

    }]);