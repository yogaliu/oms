/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("presellPlanService", ["ApiService", "APP_MENU", function (ApiService, APP_MENU) {


        /**
         * 查询预售计划列表
         * @__scope__
         * @constructor
         */
        var PreSellPlanQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Product/PreSellPlan/Query";
            var data = [];

            //搜索条件
            if (__scope__.searchForm.begindate !== '') {
                var obj = {
                    "OperateType": 2,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "SearchBeginDate",
                    "Value": __scope__.searchForm.begindate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.enddate !== '') {
                var obj = {
                    "OperateType": 4,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "SearchEndDate",
                    "Value": __scope__.searchForm.enddate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.code !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": __scope__.searchForm.code,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.skucode !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuCode",
                    "Name": "SkuCode",
                    "Value": __scope__.searchForm.skucode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.storeid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchForm.storeid,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.status !== '') {
                var obj = {
                    "OperateType": __scope__.searchForm.status,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Status",
                    "Name": "Status",
                    "Value": 4,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.islisting !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "islisting",
                    "Name": "islisting",
                    "Value": __scope__.simpleSelect.islisting,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isdynamic !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "isdynamic",
                    "Name": "isdynamic",
                    "Value": __scope__.simpleSelect.isdynamic,
                    "Children": []
                };
                data.push(obj);
            }
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "Timespan": "00:00:00.221",
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i, obj) {
                    //状态 根据id匹配name
                    if (obj.status !== undefined) {
                        obj.statusName = APP_MENU.marketingPlanStatus[obj.status];
                    }
                    obj.isZhengque = false;
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询店铺
         * @param __scope__
         * @constructor
         */
        var StoreGet = function (__scope__) {
            var url = "/BasicInformation/Store/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    //下拉选框插件 店铺
                    __scope__.selectStore.info = res.data;
                    __scope__.selectStore.objName = {id: __scope__.searchForm.storeid};
                }

            }, function (res) {

            });
        };

        /**
         * 查询预售店铺名称
         * @__scope__
         * @constructor
         */
        var PreSellPlanStoreGet = function (deffer, __scope__, obj) {
            var url = "/Product/PreSellPlanStore/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": obj.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {

                    $.each(res.data, function (i, obj) {
                        obj.Select = false;
                        obj.Deleted = false;
                        obj.IsNew = false;
                        obj.IsUpdate = false;
                    });

                    //列表数据
                    __scope__.store = res.data;
                    if (deffer !== undefined) {
                        deffer.resolve();
                    }
                } else {
                    if (deffer !== undefined) {
                        deffer.reject();
                    }
                }


            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询预售店铺名称详情
         * @__scope__
         * @constructor
         */
        var PreSellPlanStoreDetailGet = function (deffer, __scope__, obj) {
            var url = "/Product/PreSellPlanStoreDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": obj.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {

                    //$.each(res.data, function (i, obj) {
                    //    obj.Deleted = false;
                    //    obj.IsNew = false;
                    //    obj.IsUpdate = false;
                    //});

                    //列表数据
                    __scope__.storeDetail = res.data;
                    if (deffer !== undefined) {
                        deffer.resolve();
                    }
                } else {
                    if (deffer !== undefined) {
                        deffer.reject();
                    }
                }


            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询预售商品明细
         * @__scope__
         * @constructor
         */
        var PreSellPlanDetailGet = function (deffer, __scope__, obj) {
            var url = "/Product/PreSellPlanDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PreSellPlanId",
                "Name": "PreSellPlanId",
                "Value": obj.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    //$.each(res.data, function (i, obj) {
                    //    obj.IsNew = false;
                    //    obj.IsUpdate = false;
                    //});

                    //列表数据
                    __scope__.detail = res.data;
                    if (deffer !== undefined) {
                        deffer.resolve();
                    }
                } else {
                    if (deffer !== undefined) {
                        deffer.reject();
                    }
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 审核1
         * @param __scope__
         * @constructor
         */
        var PreSellPlanExsitPreSellPlanAudit = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/ExsitPreSellPlan";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    PreSellPlanAudit(__scope__, obj);
                }
            }, function (res) {

            });
        };

        /**
         * 审核2
         * @param __scope__
         * @constructor
         */
        var PreSellPlanAudit = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/Audit";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    PreSellPlanQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                    toolsService.alertSuccess("审核成功");
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        /**
         * 禁用
         * @param __scope__
         * @constructor
         */
        var PreSellPlanEnabled = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/Enabled";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('禁用成功');
                    PreSellPlanQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 开始预售1
         * @param __scope__
         * @constructor
         */
        var PreSellPlanExsitPreSellPlanStart = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/ExsitPreSellPlan";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    PreSellPlanStart(__scope__, obj);
                }
            }, function (res) {

            });
        };

        /**
         * 开始预售2
         * @param __scope__
         * @constructor
         */
        var PreSellPlanStart = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/Start";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("开始预售成功");
                    PreSellPlanQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 结束预售1
         * @param __scope__
         * @constructor
         */
        var PreSellPlanExsitPreSellPlanEnd = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/ExsitPreSellPlan";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    PreSellPlanEnd(__scope__, obj);
                }
            }, function (res) {

            });
        };

        /**
         * 结束预售
         * @param __scope__
         * @constructor
         */
        var PreSellPlanEnd = function (__scope__, obj) {
            var url = "/Product/PreSellPlan/End";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": obj.id,
                "CreateDate": obj.creatdate,
                "Code": obj.code,
                "BeginDate": obj.begindate,
                "EndDate": obj.enddate,
                "Status": obj.status,
                "IsDynamic": obj.isdynamic,
                "Note": obj.note,
                "IsStoreDetail": obj.isstoredetail,
                "Detail": __scope__.detail,
                "StoreDetail": __scope__.storeDetail,
                "Store": __scope__.store,
                "DeliveryDate": obj.deliverydate,
                "IsAutoStart": obj.isautostart,
                "IsListing": obj.islisting,
                "TotalPreSellQuantity": obj.totalpresellquantity,
                "TotalSalesQty": obj.totalsalesqty,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("结束预售成功");
                    PreSellPlanQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);

                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        // public api
        return {
            "PreSellPlanQuery": PreSellPlanQuery,
            "StoreGet": StoreGet,
            "PreSellPlanExsitPreSellPlanAudit": PreSellPlanExsitPreSellPlanAudit,
            "PreSellPlanAudit": PreSellPlanAudit,
            "PreSellPlanStoreGet": PreSellPlanStoreGet,
            "PreSellPlanStoreDetailGet": PreSellPlanStoreDetailGet,
            "PreSellPlanDetailGet": PreSellPlanDetailGet,
            "PreSellPlanEnabled": PreSellPlanEnabled,
            "PreSellPlanExsitPreSellPlanStart": PreSellPlanExsitPreSellPlanStart,
            "PreSellPlanStart": PreSellPlanStart,
            "PreSellPlanExsitPreSellPlanEnd": PreSellPlanExsitPreSellPlanEnd,
            "PreSellPlanEnd": PreSellPlanEnd
        };
    }]);