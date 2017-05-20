/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("matchGoodsBillService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {

        /**
         * 查询配货单列表数据
         * @__scope__
         * @constructor
         */
        var VipDispatchOrderQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipDispatchOrder/Query";
            var data = [];

            //搜索条件
            if (__scope__.searchForm.deliveryordercode !== '' || __scope__.searchForm.deliveryordercode !== undefined) {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "DispatchOrderCode",
                    "Name": "DispatchOrderCode",
                    "Value": __scope__.searchForm.dispatchordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.schedulecode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleCode",
                    "Name": "ScheduleCode",
                    "Value": __scope__.searchForm.schedulecode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.pocode !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PoCode",
                    "Name": "PoCode",
                    "Value": __scope__.searchForm.pocode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.begindate !== '') {
                var obj = {
                    "OperateType": 3,
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
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.enddate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.productcode !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.productcode,
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
            if (__scope__.searchForm.storageno !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageNo",
                    "Name": "StorageNo",
                    "Value": __scope__.searchForm.storageno,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.pickingcode !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PickingCode",
                    "Name": "PickingCode",
                    "Value": __scope__.searchForm.pickingcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.sendwarehouseid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SendWarehouseId",
                    "Name": "SendWarehouseId",
                    "Value": __scope__.searchForm.sendwarehouseid,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.iscreatebhed !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "iscreatebhed",
                    "Name": "iscreatebhed",
                    "Value": __scope__.simpleSelect.iscreatebhed,
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
                        obj.statusName = APP_MENU.CITdocumentStatus[obj.status];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 到货仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseGet = function (__scope__) {
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
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "WarehouseType",
                "Name": "WarehouseType",
                "Value": 1,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                __scope__.houseObj = res.data;
                if (res.success) {
                    //下拉选框插件 到货仓库
                    __scope__.selectsendwarehouse.info=res.data;
                    __scope__.selectsendwarehouse.objName={id: __scope__.searchForm.sendwarehouseid};
                }

            }, function (res) {

            });
        };

        /**
         * 查询配货单明细
         * @__scope__
         * @constructor
         */
        var VipDispatchOrderDetailQuery = function (deffer, __scope__, obj) {
            var url = "/VipOrder/VipDispatchOrderDetail/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderId",
                "Name": "DispatchOrderId",
                "Value": obj.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                if (res.success) {
                    $.each(res.data, function (i, obj) {
                        //删除该字段，否则后台会报错
                        obj.abnormal = '';
                    });
                    __scope__.details = res.data;

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
         * 查询配货单logs
         * @__scope__
         * @constructor
         */
        var VipDispatchOrderLogQuery = function (deffer, __scope__, obj) {
            var url = "/VipOrder/VipDispatchOrderLog/Query";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderId",
                "Name": "DispatchOrderId",
                "Value": obj.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                if (res.success) {
                    $.each(res.data, function (i, obj) {
                        obj.Deleted = false;
                        obj.IsUpdate = false;
                        obj.IsNew = false;
                    });
                    __scope__.logs = res.data;

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
         * 匹配异常商品
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderReLoadProduct = function (__scope__, obj) {
            var url = "/VipOrder/VipDispatchOrder/ReLoadProduct";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "DispatchOrderCode": obj.dispatchordercode,
                "Id": obj.id,
                "CreateDate": obj.createdate,
                "Status": obj.status,
                "DeliveryOrderCode": obj.deliveryordercode,
                "PoCode": obj.pocode,
                "PickingCode": obj.pickingcode,
                "OrderCate": obj.ordercate,
                "ScheduleId": obj.scheduleid,
                "WarehouseId": obj.warehouseid,
                "WarehouseName": obj.warehousename,
                "SendWarehouseId": obj.sendwarehouseid,
                "SendWarehouseName": obj.sendwarehousename,
                "StoreId": obj.storeid,
                "StoreName": obj.storename,
                "StorageNo": obj.storageno,
                "ArrivalTime": obj.arrivaltime,
                "CarrierName": obj.carriername,
                "WaybillNumber": obj.waybillnumber,
                "Details": __scope__.details,
                "Logs": __scope__.logs,
                "NoticeQtyTotal": obj.noticeqtytotal,
                "IsCreateBhed": obj.iscreatebhed,
                "DeliveryMethod": obj.deliverymethod,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('匹配成功');
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        /**
         * 生成补货单1    如果这个单跟档期有关联,生成的补货单也要有关联
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderDetailQueryMapping = function (deffer, __scope__, obj) {
            var url = "/VipOrder/VipDispatchOrderDetail/QueryMapping";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderDetailId",
                "Name": "DispatchOrderDetailId",
                "Value": obj.id,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('');
                } else {
                    toolsService.alertError(res.errorMessage);
                }
                if (deffer !== undefined) {
                    deffer.resolve();
                }
            }, function (res) {

            });
        };

        /**
         * 生成补货单2
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderSave = function (__scope__, obj) {
            var url = "/VipOrder/VipDispatchOrder/Save";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "DispatchOrderCode": obj.dispatchordercode,
                "Id": obj.id,
                "CreateDate": obj.createdate,
                "Status": obj.status,
                "DeliveryOrderCode": obj.deliveryordercode,
                "PoCode": obj.pocode,
                "PickingCode": obj.pickingcode,
                "OrderCate": obj.ordercate,
                "ScheduleId": obj.scheduleid,
                "WarehouseId": obj.warehouseid,
                "WarehouseName": obj.warehousename,
                "SendWarehouseId": obj.sendwarehouseid,
                "SendWarehouseName": obj.sendwarehousename,
                "StoreId": obj.storeid,
                "StoreName": obj.storename,
                "StorageNo": obj.storageno,
                "ArrivalTime": obj.arrivaltime,
                "CarrierName": obj.carriername,
                "WaybillNumber": obj.waybillnumber,
                "Details": __scope__.details,
                "Logs": __scope__.logs,
                "NoticeQtyTotal": obj.noticeqtytotal,
                "IsCreateBhed": obj.iscreatebhed,
                "DeliveryMethod": obj.deliverymethod,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('匹配成功');
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 选择送货单1
         * @param __scope__
         * @constructor
         */
        var VipDeliveryOrderGet = function (__scope__, obj) {
            var url = "/VipOrder/VipDeliveryOrder/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 6,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Status",
                "Name": "Status",
                "Value": "1,2",
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StoreId",
                "Name": "StoreId",
                "Value": obj.storeid,
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "SendWarehouseId",
                "Name": "SendWarehouseId",
                "Value": obj.sendwarehouseid,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.tableRightSideList = res.data;

                    //列表配置
                    __scope__.theadRightSideList = [
                        {name: "店铺名称", tag: 'storename'},
                        {name: "PO单号", tag: 'pocode'},
                        {name: "送货单号", tag: 'deliveryordercode'},
                        {name: "入库单号", tag: 'storageno'},
                        {name: "到货仓库", tag: 'sendwarehousename'},
                        {name: "备注", tag: 'note'}
                    ];
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 选择送货单2
         * @param __scope__
         * @constructor
         */
        var VipDeliveryAddDispatchOrder = function (__scope__, obj) {
            var url = "/VipOrder/VipDeliveryOrder/AddDispatchOrder";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Note",
                "Name": "Note",
                "Value": __scope__.sendObj.note,
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DeliveryOrderCode",
                "Name": "DeliveryOrderCode",
                "Value": __scope__.sendObj.deliveryordercode,
                "Children": []
            }, {
                "OperateType": 6,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderList",
                "Name": "DispatchOrderList",
                "Value": obj.dispatchordercode,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('选择送货单成功');
                    VipDispatchOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false)
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 完结
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderOrderComplete = function (__scope__, obj) {
            var url = "/VipOrder/VipDispatchOrder/OrderComplete";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderCode",
                "Name": "DispatchOrderCode",
                "Value": obj.dispatchordercode,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('完结成功');
                    VipDispatchOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 关闭
         * @param __scope__
         * @constructor
         */
        var VipDispatchOrderAbnormalEnd = function (__scope__, obj) {
            var url = "/VipOrder/VipDispatchOrder/AbnormalEnd";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "DispatchOrderCode",
                "Name": "DispatchOrderCode",
                "Value": obj.dispatchordercode,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('关闭成功');
                    VipDispatchOrderQuery(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipDispatchOrderQuery": VipDispatchOrderQuery,
            "WarehouseGet": WarehouseGet,
            "VipDispatchOrderDetailQuery": VipDispatchOrderDetailQuery,
            "VipDispatchOrderReLoadProduct": VipDispatchOrderReLoadProduct,
            "VipDeliveryOrderGet": VipDeliveryOrderGet,
            "VipDispatchOrderAbnormalEnd": VipDispatchOrderAbnormalEnd,
            "VipDeliveryAddDispatchOrder": VipDeliveryAddDispatchOrder,
            "VipDispatchOrderLogQuery": VipDispatchOrderLogQuery,
            "VipDispatchOrderSave": VipDispatchOrderSave,
            "VipDispatchOrderDetailQueryMapping": VipDispatchOrderDetailQueryMapping,
            "VipDispatchOrderOrderComplete": VipDispatchOrderOrderComplete,
        };


    }]);