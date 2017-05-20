/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addActivityApplyService", ["ApiService", function (ApiService) {


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
                //下拉选框插件 店铺
                __scope__.selectStore.info = res.data;
                __scope__.selectStore.setValue({id: __scope__.modify.tableList.storeid});
            }, function (res) {

            });
        };

        /**
         * 查询活动类型
         * @param __scope__
         * @constructor
         */
        var GeneralClassiFicationGet = function (__scope__) {
            var url = "/BasicInformation/GeneralClassiFication/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
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
                "Value": 22,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 活动类型
                __scope__.selectActivitytype.info = res.data;
                __scope__.selectActivitytype.setValue({id: __scope__.modify.tableList.activitytypeid});
            }, function (res) {

            });
        };

        /**
         * 调入仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseQuery = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }, {
                "OperateType": 1,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "WarehouseType",
                "Name": "WarehouseType",
                "Value": 1,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 调入仓库
                __scope__.selectWarehousein.info = res.data;
                __scope__.selectWarehousein.setValue({id: __scope__.modify.tableList.warehouseinid});


                //修改页面时，获取调入仓库对应的parentid，传入调出仓库
                if (__scope__.modify.tableList.warehouseinid) {
                    $.each(res.data, function (i, e) {
                        if (e.id == __scope__.modify.tableList.warehouseinid) {
                            __scope__.modify.tableList.warehouseinparentid = e.parentid;
                        }
                    })
                }
                WarehouseGet(__scope__);
            }, function (res) {

            });
        };

        //调出仓库
        var WarehouseGet = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";

            var paramObj = ApiService.getBasicParamobj();
            var warehouseinparentid = '';
            if (__scope__.modify.tableList.warehouseinid) {
                warehouseinparentid = __scope__.modify.tableList.warehouseinparentid;
            }
            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ParentId",
                "Name": "ParentId",
                "Value": warehouseinparentid,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //删除与调入仓库相同的仓库
                if (res.success) {
                    $.each(res.data, function (i, obj) {
                        if (obj.id == __scope__.modify.tableList.warehouseinid) {
                            res.data.removeByValue(obj);
                            return false;
                        }
                    })
                }
                ;
                //下拉选框插件 调出仓库
                __scope__.selectWarehouseout.info = res.data;

                __scope__.selectWarehouseout.setValue({id: __scope__.modify.tableList.warehouseoutid});

            }, function (res) {

            });
        };

        /**
         * 新增活动商品
         * @param __scope__
         * @constructor
         */
        var ProductSkuQuery = function (__scope__, PageIndex, PageSize, isInit) {
            var url = "/Product/ProductSku/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "SeletedCount": 0,
                "Data": [
                    {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Description",
                        "Name": "prodes",
                        "Value": __scope__.messageForm.goodsName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Code",
                        "Name": "procode",
                        "Value": __scope__.messageForm.goodsNum,
                        "Children": []
                    }, {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Description",
                        "Name": "skudes",
                        "Value": __scope__.messageForm.skuName,
                        "Children": []
                    }, {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Code",
                        "Name": "skucode",
                        "Value": __scope__.messageForm.skuNum,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Status",
                        "Name": "skustatus",
                        "Value": 1,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.IsCombined",
                        "Name": "IsCombined",
                        "Value": "0",
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Status",
                        "Name": "prostatus",
                        "Value": 1,
                        "Children": []
                    }],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            a = {
                "PageIndex": 1,
                "PageSize": 10,
                "SeletedCount": 0,
                "Data": [{
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "pro.Description",
                    "Name": "prodes",
                    "Value": "",
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "pro.Code",
                    "Name": "procode",
                    "Value": "",
                    "Children": []
                }, {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.Description",
                    "Name": "skudes",
                    "Value": "",
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.Code",
                    "Name": "skucode",
                    "Value": "",
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.Status",
                    "Name": "skustatus",
                    "Value": 1,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "sku.IsCombined",
                    "Name": "IsCombined",
                    "Value": "0",
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "pro.Status",
                    "Name": "prostatus",
                    "Value": 1,
                    "Children": []
                }],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            };


            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                __scope__.addActivityMessage = res.data;

                //总条数
                __scope__.paginationConf.totalItems = res.total;

                InventoryVirtualGetOccupation(__scope__, res.data[0].code, true);

                __scope__.canName = res.data[0].productname;
                __scope__.canCode = res.data[0].code;
                
            }, function (res) {

            });
        };

        /**
         * 获取所有仓库
         */
        var getWarehouse = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";

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
                    __scope__.allWarehouse = klwTool.arrayToJson(res.data, 'id');
                }
            });
        };

        /**
         * 商品对应的仓库数据
         * @param __scope__
         * @constructor
         */
        var InventoryVirtualGetOccupation = function (__scope__, code, isInit) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Code",
                "Name": "Code",
                "Value": code,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                $.each(res.data, function (i, obj) {
                    if (__scope__.allWarehouse[obj.warehouseid]) {
                        obj.warename = __scope__.allWarehouse[obj.warehouseid].name
                    }
                });
                __scope__.addActivityMessage2 = res.data;

            }, function (res) {

            });
        };


        /**
         * 新增页面保存按钮  修改保存
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterSave = function (__scope__) {
            var url = "/ActivityRegister/ActivityRegister/Save";


            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "id": __scope__.modify.tableList.id,
                "BeginDate": __scope__.modify.tableList.begindate,
                "EndDate": __scope__.modify.tableList.enddate,
                "Subject": __scope__.modify.tableList.subject,
                "Remark": __scope__.modify.tableList.remark,
                "Content": __scope__.modify.tableList.content,
                //报名状态
                "RegistrationStatus": __scope__.modify.tableList.registrationstatus,
                "ActivityTypeName": __scope__.modify.tableList.activitytypename,
                "ActivityTypeId": __scope__.modify.tableList.activitytypeid,
                "Exports": 0.0,
                "ActivityTypeCode": __scope__.modify.tableList.activitytypecode,
                "StoreId": __scope__.modify.tableList.storeid,
                "StoreName": __scope__.modify.tableList.storename,
                "WarehouseOutId": __scope__.modify.tableList.warehouseoutid,
                "WarehouseOutName": __scope__.modify.tableList.warehouseoutname,
                "WarehouseInId": __scope__.modify.tableList.warehouseinid,
                "WarehouseInName": __scope__.modify.tableList.warehouseinname,
                "SalesQty": 0,
                "Details": __scope__.modify.details,
                "DeleteDetails": __scope__.modify.deleteddetails,
                "isdisabled": __scope__.modify.tableList.isdisabled,
                "islockedquantity": __scope__.modify.tableList.islockedquantity
            });


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.returnFun();
                } else {

                }
            }, function (res) {

            });
        };

        /**
         * 查询是否有活动商品
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterDetailGet = function (__scope__) {
            var url = "/ActivityRegister/ActivityRegister/DetailGet";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(__scope__.modify.tableList.id);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.data.length > 0) {
                    var data = res.data;
                    __scope__.modify.details = data;
                    __scope__.tableList1 = data;

                    if (__scope__.tableList1.length > 0) {
                        __scope__.addMessage.activityBtn = false;
                    }

                } else {
                    __scope__.modify.details = [];
                }
            }, function (res) {

            });
        };

        // public api
        return {
            "StoreGet": StoreGet,
            "WarehouseQuery": WarehouseQuery,
            "WarehouseGet": WarehouseGet,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "ActivityRegisterSave": ActivityRegisterSave,
            "ActivityRegisterDetailGet": ActivityRegisterDetailGet,
            "GeneralClassiFicationGet": GeneralClassiFicationGet,
            "getWarehouse": getWarehouse,
        };

    }]);