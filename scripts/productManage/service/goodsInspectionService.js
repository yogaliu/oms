/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('goodsInspectionService', ["ApiService", function (ApiService) {
        var pageId = '#goodsInspection';   // 页面Id

        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 店铺
         * @constructor
         */
        var getStore = function (scope) {
            var url = "/BasicInformation/Store/Get ";
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
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                scope.storeData = res.data;
                if (res.success) {
                    // 检查全部
                    scope.selectStore1.info = res.data;
                    // 检查重复
                    scope.selectStore2.info = res.data;
                }
            });
        };

        /**
         * 商品品牌
         * @constructor
         */
        var getBrand = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ClassiFicationType",
                    "Name": "ClassiFicationType",
                    "Value": 2,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectBrand.info = res.data;
                }
            });
        };

        /**
         * 检查店铺
         * @constructor
         */
        var inspectionStore = function (scope) {
            var url = "/Product/Distribution/QueryAbnormalDistribution";
            var param = $.extend({
                'storeId': scope.activeItem.storeid,
                'checkInventory': false,
                'body': JSON.stringify([{
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.ProductBrandCode",
                    "Name": "BrandCode",
                    "Value": scope.activeItem.brand,
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.ProductCode",
                    "Name": "ProductCode",
                    "Value": scope.activeItem.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #checkShopModal').modal('hide');
                    //列表数据
                    scope.tableList = res.data;
                }

            });
        };

        /**
         * 检查全部
         * @constructor
         */
        var inspectionAll = function (scope) {
            var url = "/Product/Distribution/QueryAllAbnormalDistribution";
            var promise = ApiService.postLoad(url, $.extend({},paramObj));
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #checkAllModal').modal('hide');
                    //列表数据
                    scope.tableList = res.data;
                }

            });
        };

        // 检查重复
        var inspectionRepeat = function (scope) {
            var url = "/Product/Distribution/QueryRepeatDistribution";
            var param = $.extend({
                'storeId':scope.activeItem.storeid
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #checkRepetitionModal').modal('hide');
                    //列表数据
                    scope.tableList = res.data;
                }

            });
        };

        return {
            "getStore": getStore,
            "getBrand": getBrand,
            "inspectionStore": inspectionStore,
            "inspectionAll":inspectionAll,
            "inspectionRepeat":inspectionRepeat
        };

    }]);