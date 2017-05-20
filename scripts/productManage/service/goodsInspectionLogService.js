/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('goodsInspectionLogService', ["ApiService","toolsService", function (ApiService,toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 店铺
         * @constructor
         */
        var getStore = function (scope,deffer) {
            var url = "/BasicInformation/Store/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        // 默认显示
                        obj.isHide = false;
                    });
                    // 列表显示需要数据
                    scope.storelist = klwTool.arrayToJson(res.data,'id');
                    // 搜索展示数据
                    scope.searchStore = res.data;
                    // 店铺数据数据转换(A,B,C...)
                    scope.singleWordData = toolsService.setDataShowType(scope,res.data,[],6);
                    if(deffer !== undefined){
                        deffer.resolve();
                    }
                } else {
                    if(deffer !== undefined){
                        deffer.reject();
                    }
                }
            });
        };


        /**
         * 铺货日志
         * @constructor
         */
        var query = function (scope,PageIndex,PageSize,data) {
            var url = "/Product/Distribution/GetDistributionLog";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": '',
                    "Data": !data?[]:[
                        // 店铺
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "StoreId",
                            "Name": "StoreId",
                            "Value": scope.searchItem.storeid,
                            "Children": []
                        },
                        // 平台商品ID
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformId",
                            "Name": "PlatformId",
                            "Value": scope.searchItem.platformId,
                            "Children": []
                        },
                        // 平台规格ID
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformSkuId",
                            "Name": "PlatformSkuId",
                            "Value": scope.searchItem.platformSkuId,
                            "Children": []
                        },
                        // 商家规格编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ProductCode",
                            "Name": "ProductCode",
                            "Value": scope.searchItem.productCode,
                            "Children": []
                        },
                        // 商家商品编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "SkuCode",
                            "Name": "SkuCode",
                            "Value": scope.searchItem.skuCode,
                            "Children": []
                        }
                    ],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableList = res.data;
                    $.each(scope.tableList, function (index,obj) {
                        if(obj.storeid !== undefined) {
                            obj.storename = scope.storelist[obj.storeid].name;
                        }
                    });
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                }
            });
        };
        return {
            "getStore": getStore,
            "query":query
        };
    }]);