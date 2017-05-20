/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('productInformationService', ["ApiService", "APP_MENU", "toolsService",
        function (ApiService, APP_MENU, toolsService) {
            var pageId = '#productInformation';  // 页面Id
            //获取身份验证
             var paramObj = ApiService.getBasicParamobj();

            /**
             * 商品信息
             * @constructor
             */
            var query = function (scope, PageIndex, PageSize, data) {
                var url = "/Product/Product/Query";
                var param = $.extend({
                    body:JSON.stringify({
                        "PageIndex": PageIndex,
                        "PageSize": PageSize,
                        "SeletedCount": "",
                        "Data": !data?[]:[{
                                // 商品状态
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.searchItem.status,
                                "Children": []
                            },
                            {
                                // 商品品牌
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Brand",
                                "Name": "Brand",
                                "Value": scope.searchItem.brand,
                                "Children": []
                            },
                            {
                                //商品编码
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.searchItem.productCode,
                                "Children": []
                            }, {
                                // 商品名称
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Description",
                                "Name": "Description",
                                "Value": scope.searchItem.description,
                                "Children": []
                            }, {
                                // 规格编码
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SkuCode",
                                "Name": "SkuCode",
                                "Value": scope.searchItem.standardCode,
                                "Children": []
                            }, {
                                //规格名称
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SkuName",
                                "Name": "SkuName",
                                "Value": scope.searchItem.standardName,
                                "Children": []
                            }],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    })
                },paramObj);
                var promise = ApiService.postLoad(url, param);
                promise.then(function (res) {
                    if (res.success) {
                        //是否全选
                        scope.isalldatacheck = false;
                        //列表数据
                        scope.tableList = res.data;
                        //总条数
                        scope.paginationConf.totalItems = res.total;
                        $.each(scope.tableList, function (index, obj) {
                            //默认数据未勾选
                            obj.isdatacheck = false;
                            // 商品状态根据id匹配name
                            if (obj.status !== undefined) {
                                obj.statusname = APP_MENU.productStatus[obj.status];
                            }
                            //商品类型根据id匹配name
                            if (obj.status !== undefined) {
                                obj.producttypename = APP_MENU.productType[obj.producttype];
                            }
                        });
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
                        $.each(res.data, function (index,obj) {
                            // 默认显示
                            obj.isHide = false;
                        });
                        scope.productBrandData = res.data;
                        // 店铺数据数据转换(A,B,C...)
                        scope.singleWordData = toolsService.setDataShowType(scope,res.data,[],6);
                    }
                });
            };

            /**
             * 审核
             * @constructor
             */

            var audit = function (scope, type) {
                var ids = [];
                if (type == 'single') {
                    ids.push(scope.activeItem.productid);
                } else if (type == 'batch') {
                    $.each(scope.tableList, function (index, obj) {
                        if (obj.isdatacheck) {
                            ids.push(obj.productid);
                        }
                    });
                }
                var url = "/Product/Product/Audit";
                var param = $.extend({
                    body:JSON.stringify(ids)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                        // 审核成功后推送WMS
                        wms(scope, type);
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }

                });
            };

            /**
             * 转入WMS
             * @constructor
             */
            var wms = function (scope, type) {
                var ids = [];
                if (type == 'single') {
                    ids.push(scope.activeItem.productid);
                } else if (type == 'batch') {
                    $.each(scope.tableList, function (index, obj) {
                        if (obj.isdatacheck) {
                            ids.push(obj.productid);
                        }
                    });
                }
                var url = "/Product/Product/SendWms";
                var param = $.extend({
                    body:JSON.stringify(ids)
                },paramObj);
                var promise = ApiService.post(url, param);
                promise.then(function (res) {
                    if (res.success) {
                        query(scope,scope.paginationConf.currentPage,scope.paginationConf.itemsPerPage,1);
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }
                });
            };

            /**
             * 禁用
             * @constructor
             */
            var disabled = function (scope,type) {
                var ids = [];
                if (type == 'single') {
                    ids.push(scope.activeItem.productid);
                } else if (type == 'batch') {
                    $.each(scope.tableList, function (index, obj) {
                        if (obj.isdatacheck) {
                            ids.push(obj.productid);
                        }
                    })
                }
                var url = "/Product/Product/Disable";
                var param = $.extend({
                    body:JSON.stringify(ids)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        if(type == 'single') {
                            $(pageId + ' #isDisabledModal').modal('hide');
                        } else {
                            $(pageId + ' #batchIsDisabledModal').modal('hide');
                        }
                        query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage,1);
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }

                });
            };

            return {
                "query": query,
                "getBrand": getBrand,
                "audit": audit,
                "wms": wms,
                "disabled": disabled
            };

        }]);