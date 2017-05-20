/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('productInformationDetailService', ["ApiService", "APP_MENU", "toolsService",
        function (ApiService, APP_MENU, toolsService) {
            var pageId = '#productInformationDetail';  // 页面Id
            //获取身份验证
            var paramObj = ApiService.getBasicParamobj();

            /**
             * 规格信息
             * @constructor
             */
            var skuQuery = function (scope) {
                var url = "/Product/ProductSku/QueryProductSku";
                var param = $.extend({
                    body:JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Productid",
                        "Name": "proid",
                        "Value": scope.formData.productid,
                        "Children": []
                    }])
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {

                    if (res.success) {
                        scope.tableListSku = res.data;
                        $.each(scope.tableListSku, function (index, obj) {
                            // 商品状态根据id匹配name
                            if (obj.status !== undefined) {
                                obj.statusname = APP_MENU.productStatus[obj.status];
                            }
                        });
                    }

                });
            };


            /**
             * 规格信息禁用
             * @constructor
             */
            var skuDisabled = function (scope) {
                var url = "/Product/ProductSku/Disable";
                var param = $.extend({
                    body:JSON.stringify(scope.activeItem.skuid)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        skuQuery(scope);
                        $(pageId + ' #disabledSkuModal').modal('hide');
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }
                });
            };

            /**
             * 变价信息
             * @constructor
             */
            var changeQuery = function (scope) {
                var url = "/Product/ProductPriceChange/Get";
                var param = $.extend({
                    body:JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductId",
                        "Name": "proid",
                        "Value": scope.formData.productid,
                        "Children": []
                    }])
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        scope.tableListChange = res.data;
                    }
                });
            };

            /**
             * 变价信息禁用
             * @constructor
             */
            var changeDisabled = function (scope) {
                var url = "/Product/ProductPriceChange/Disable ";
                var param = $.extend({
                    body:JSON.stringify(scope.activeItem.skuid)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        changeQuery(scope);
                        $(pageId + ' #disabledChangeModal').modal('hide');
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }
                });
            };

            /**
             * 商品自定义属性
             * @constructor
             */
            var attribute = function (scope) {
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
                        "Value": 14,
                        "Children": []
                    }])
                },paramObj);
                var promise = ApiService.post(url, param);
                promise.then(function (res) {

                    if (res.success) {
                        scope.attributeData = new Array(20);
                        var length = res.data.length;
                        for (var i = 0; i < length; i++) {
                            scope.attributeData[res.data[i]['value'] - 1] = {
                                name: res.data[i]['name'],
                                value: res.data[i]['value']
                            };
                        }

                    }
                });
            };

            /**
             * 操作日志列表数据
             * @constructor
             */
            var operateLog = function (scope) {
                var url = "/Product/ProductLog/Get ";
                var param = $.extend({
                    body:JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Productid",
                        "Name": "proid",
                        "Value": scope.formData.productid,
                        "Children": []
                    }])
                },paramObj);
                var promise = ApiService.post(url, param);
                promise.then(function (res) {
                    if (res.success) {
                        // 列表数据
                        scope.tableListLog = res.data;
                    }
                });
            };

            return {
                "skuQuery": skuQuery,
                "skuDisabled": skuDisabled,
                "changeQuery": changeQuery,
                "changeDisabled": changeDisabled,
                "attribute": attribute,
                "operateLog": operateLog
            };

        }]);