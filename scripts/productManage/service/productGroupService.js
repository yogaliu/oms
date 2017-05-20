/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('productGroupService', ["ApiService", "APP_MENU", "toolsService",
        function (ApiService, APP_MENU, toolsService) {
        var pageId = '#productGroup';   // 页面Id

            //获取身份验证
             var paramObj = ApiService.getBasicParamobj();


            /**
             * 组合套装
             * @constructor
             */
            var query = function (scope,PageIndex,PageSize,data) {
                var url = "/Product/CombinedProduct/Query";
                var param = $.extend({
                    body:JSON.stringify({
                        "PageIndex": PageIndex,
                        "PageSize": PageSize,
                        "SeletedCount": "",
                        "Data": !data ? [] : [
                                // 套装编码
                                {
                                    "OperateType": 8,
                                    "LogicOperateType": 0,
                                    "AllowEmpty": false,
                                    "Field": "Code",
                                    "Name": "Code",
                                    "Value": scope.searchItem.groupCode,
                                    "Children": []
                                },
                                // 套装名称
                                {
                                    "OperateType": 8,
                                    "LogicOperateType": 0,
                                    "AllowEmpty": false,
                                    "Field": "Description",
                                    "Name": "Description",
                                    "Value": scope.searchItem.groupName,
                                    "Children": []
                                },
                                // 规格编码
                                {
                                    "OperateType": 8,
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
                                obj.statusname = APP_MENU.groupStatus[obj.status];
                            }
                        });
                    }
                });
            };

            /**
             *审核
             * @constructor
             */
            var audit = function (scope, type) {
                var ids = [];
                if (type == 'single') {
                    ids.push(scope.activeItem.skuid);
                } else if (type == 'batch') {
                    $.each(scope.tableList, function (index, obj) {
                        if (obj.isdatacheck) {
                            ids.push(obj.skuid);
                        }
                    })
                }
                var url = "/Product/CombinedProduct/Enable";
                var param = $.extend({
                    body:JSON.stringify(ids)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        query(scope,scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }
                });
            };


            /**
             * 禁用
             * @constructor
             */
            var disabled = function (scope, type) {
                var ids = [];
                if (type == 'single') {
                    console.log(scope.activeItem);
                    ids.push(scope.activeItem.skuid);
                } else if (type == 'batch') {
                    $.each(scope.tableList, function (index, obj) {
                        if (obj.isdatacheck) {
                            console.log(obj);
                            ids.push(obj.skuid);
                        }
                    })
                }
                var url = "/Product/CombinedProduct/Disable";
                var param = $.extend({
                    body:JSON.stringify(ids)
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        if(type == 'single') {
                            $(pageId + ' #isDisabledModal').modal('hide');
                        } else if(type == 'batch') {
                            $(pageId + ' #batchIsDisabledModal').modal('hide');
                        }
                        query(scope,scope.paginationConf.currentPage,scope.paginationConf.itemsPerPage);
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }

                });
            };

            return {
                "query": query,
                "audit": audit,
                "disabled": disabled
            };

        }]);