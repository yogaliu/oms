/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("returnGoodsBillService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {

        /**
         * 查询退货单列表数据
         * @__scope__
         * @constructor
         */
        var VipReturnOrderQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipReturnOrder/Query";
            var data = [];
            //搜索条件
            if (__scope__.searchForm.returnordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ReturnOrderCode",
                    "Name": "ReturnOrderCode",
                    "Value": __scope__.searchForm.returnordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.vipreturnordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VipReturnOrderCode",
                    "Name": "VipReturnOrderCode",
                    "Value": __scope__.searchForm.vipreturnordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.pocode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PoCode",
                    "Name": "PoCode",
                    "Value": __scope__.searchForm.pocode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.inwarehouseid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "InWarehouseId",
                    "Name": "InWarehouseId",
                    "Value": __scope__.searchForm.inwarehouseid,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.productcode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.productcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.begindate !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "BeginDate",
                    "Value": __scope__.searchForm.begindate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.enddate !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.enddate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.status !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Status",
                    "Name": "Status",
                    "Value": __scope__.searchForm.status,
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
                        obj.statusName = APP_MENU.CITreturnStatus[obj.status];
                    }
                    //单据类型 根据id匹配name
                    if (obj.returntype !== undefined) {
                        obj.returntypeName = APP_MENU.B2BreturnReturnType[obj.returntype];
                    }
                    //签收类型 根据id匹配name
                    if (obj.returnsigntype !== undefined) {
                        obj.returnsigntypeName = APP_MENU.B2BreturnReturnSignType[obj.returnsigntype];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 签收仓库  //签收弹框内的收货仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseGet = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([
                {
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
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageType",
                    "Name": "StorageType",
                    "Value": 0,
                    "Children": []
                }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    //下拉选框插件 签收仓库
                    __scope__.selectInWareHouse.info = res.data;
                    __scope__.selectInWareHouse.objName = {id: __scope__.searchForm.inwarehouseid};

                    //下拉选框插件 签收弹框的收货仓库
                    __scope__.selectInWareHouse2.info = res.data;
                    __scope__.selectInWareHouse2.objName = {id: __scope__.signInObj.inwarehouseid};
                }
            }, function (res) {

            });
        };

        /**
         * 签收
         * @param __scope__
         * @constructor
         */
        var VipReturnOrderSave = function (__scope__) {
            var url = "/VipOrder/VipReturnOrder/Save";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "VipReturnOrderCode": __scope__.signInObj.vipreturnordercode,
                "Id": __scope__.signInObj.id,
                "CreateDate": __scope__.signInObj.createdate,
                "Status": 2,//多次尝试，只能为2时才能签收成功且状态变为已签收，否则能签收成功，状态仍为已审核
                "ReturnOrderCode": __scope__.signInObj.returnordercode,
                "ReturnType": __scope__.signInObj.returntype,
                "ReturnSignType": __scope__.signInObj.returnsigntype,/////
                "WarehouseId": __scope__.signInObj.warehouseid,
                "WarehouseName": __scope__.signInObj.warehousename,
                "InWarehouseId": __scope__.signInObj.inwarehouseid,//
                "InWarehouseName": __scope__.signInObj.inwarehousename,//
                "OutDate": __scope__.signInObj.outdate,
                "TotalCases": __scope__.signInObj.totalcases,
                "TotalSkus": __scope__.signInObj.totalskus,
                "TotalQtys": __scope__.signInObj.totalqtys,
                "Note": __scope__.signInObj.note,//
                "Detail": [],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("已签收");
                    $('#returnGoodsBill .signIn-modal').modal('hide');
                    // 查询数据
                    VipReturnOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errormessage);
                }
            }, function (res) {

            });
        };

        /**
         * 作废
         * @param __scope__
         * @constructor
         */
        var VipReturnOrderObDeleteButton = function (__scope__, id) {
            var url = "/VipOrder/VipReturnOrder/ObDeleteButton";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": id,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("已作废");
                    // 查询数据
                    VipReturnOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errormessage);
                }
            }, function (res) {

            });
        };

        /**
         * 生成通知单1  //判断是否扫描唯品退货单
         * @param __scope__
         * @constructor
         */
        var SystemConfigGetVipOrderConfig = function (__scope__, obj) {
            var url = "/BasicInformation/SystemConfig/GetVipOrderConfig";
            var paramObj = ApiService.getBasicParamobj();

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {

                    if (res.data.isScanVipReturnOrder) {
                        //取VIpreturnorderdetail里面InQty大于0的明细
                        VipReturnOrderDetailGet(__scope__, obj, true);
                    } else {
                        //取ReturnQty大于0的数量
                        VipReturnOrderDetailGet(__scope__, obj, false);
                    }
                } else {
                    toolsService.alertError(res.errormessage);
                }
            }, function (res) {

            });
        };

        /**
         * 查询退货单明细
         * @__scope__
         * @constructor
         */
        var VipReturnOrderDetailGet = function (__scope__, obj, isTrue) {
            var url = "/VipOrder/VipReturnOrderDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ReturnOrderId",
                "Name": "ReturnOrderId",
                "Value": obj.id,
                "Children": []
            }]);

            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    var returnDetails = [];
                    if (isTrue) {
                        //取VIpreturnorderdetail里面InQty大于0的明细
                        $.each(res.data, function (i, obj) {
                            if (obj.inqty > 0) {
                                returnDetails.push(obj);
                            }
                        });
                        if (returnDetails.length > 0) {
                            VipReturnOrderNoticeSave(__scope__, obj, returnDetails);
                        } else {
                            //没有找到大于0的就不能生成 提示可生成通知单数量为0
                            toolsService.alertMsg('可生成通知单数量为0');
                        }
                    } else {
                        //取ReturnQty大于0的数量
                        $.each(res.data, function (i, obj) {
                            if (obj.returnqty > 0) {
                                returnDetails.push(obj);
                            }
                        });
                        if (returnDetails.length > 0) {
                            VipReturnOrderNoticeSave(__scope__, obj, returnDetails);
                        } else {
                            //没有找到大于0的就不能生成 提示可生成通知单数量为0
                            toolsService.alertMsg('可生成通知单数量为0');
                        }
                    }
                }

            }, function (res) {

            });
        };
        /**
         * 生成通知单2
         * @param __scope__
         * @constructor
         */
        var VipReturnOrderNoticeSave = function (__scope__, obj, returnDetails) {
            var url = "/VipOrder/VipReturnOrderNotice/Save";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": 0,
                "CreateDate": "0001-01-01 00:00:00",
                "Status": 1,
                "ReturnOrderCode": obj.returnordercode,
                "VipReturnOrderCode": obj.vipreturnordercode,
                "ReturnType": obj.returntype,
                "ReturnSignType": obj.returnsigntype,
                "WarehouseId": obj.warehouseid,
                "WarehouseName": obj.warehousename,
                "InWarehouseId": obj.inwarehouseid,
                "InWarehouseName": obj.inwarehousename,
                "OutDate": obj.outdate,
                "TotalCases": obj.totalcases,
                "TotalSkus": obj.totalskus,
                "TotalQtys": obj.totalqtys,
                "Detail": returnDetails,
                "Deleted": false,
                "IsNew": true,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    VipReturnOrderBuildNotice(__scope__, obj)
                } else {
                    toolsService.alertError(res.errormessage);
                }
            }, function (res) {

            });
        };

        /**
         * 生成通知单3 //修改退货单状态为已生成通知单
         * @param __scope__
         * @constructor
         */
        var VipReturnOrderBuildNotice = function (__scope__, obj) {
            var url = "/VipOrder/VipReturnOrder/BuildNotice";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": obj.id,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("已生成通知单");
                    // 查询数据
                    VipReturnOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errormessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipReturnOrderQuery": VipReturnOrderQuery,
            "WarehouseGet": WarehouseGet,
            "VipReturnOrderSave": VipReturnOrderSave,
            "VipReturnOrderObDeleteButton": VipReturnOrderObDeleteButton,
            "SystemConfigGetVipOrderConfig": SystemConfigGetVipOrderConfig,
            "VipReturnOrderDetailGet": VipReturnOrderDetailGet,
            "VipReturnOrderNoticeSave": VipReturnOrderNoticeSave,
            "VipReturnOrderBuildNotice": VipReturnOrderBuildNotice,
        };


    }]);