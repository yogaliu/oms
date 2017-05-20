/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addAdjustBillService", ["ApiService", function (ApiService) {
        /**
         * 档期名称
         * @param __scope__
         * @constructor
         */
        var VipScheduleGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipSchedule/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 6,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Status",
                "Name": "Status",
                "Value": "3,1",
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    __scope__.tableRightSideList = res.data;

                    //列表配置
                    __scope__.theadRightSideList = [
                        {name: "档期编号", tag: 'schedulecode'},
                        {name: "档期名称", tag: 'schedulename'},
                        {name: "PO单号", tag: 'pocode'},
                        {name: "开始时间", tag: 'schedulebegindate'},
                        {name: "结束时间", tag: 'schedulebegindate'},
                        {name: "备注", tag: 'note'}
                    ];

                }

            }, function (res) {

            });
        };


        /**
         * 新增活动商品列表
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

            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                //新增商品模块总数据
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
        var InventoryVirtualGetOccupation = function (__scope__, code) {
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
        var VipStockAdjustOrderSave = function (__scope__) {
            var url = "/VipOrder/VipStockAdjustOrder/Save";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": __scope__.modify.tableList.id,
                "CreateDate": __scope__.modify.tableList.creatdate,
                "Status": __scope__.statusSave,// 新建：0  修改：2
                "OutVirtualWarehouseId": __scope__.modify.tableList.outvirtualwarehouseid,
                "OutVirtualWarehouseName": __scope__.modify.tableList.outvirtualwarehousename,
                "ScheduleId": __scope__.modify.tableList.scheduleid,
                "ScheduleCode": __scope__.modify.tableList.schedulecode,
                "ScheduleName": __scope__.modify.tableList.schedulename,
                "AdjustReasonType": Number(__scope__.modify.tableList.adjustreasontype),
                "AdjustType": Number(__scope__.modify.tableList.adjusttype),
                "Remark": __scope__.modify.tableList.remark,
                "Detail": __scope__.modify.details,
                "StoreId": __scope__.modify.tableList.storeid,
                "IsUploadInventory": __scope__.modify.tableList.isUploadInventory,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true

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
         * 查询是否有商品明细
         * @__scope__
         * @constructor
         */
        var VipStockAdjustOrderDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipStockAdjustOrderDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StockAdjustOrderId",
                "Name": "StockAdjustOrderId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    __scope__.modify.details = res.data;
                    __scope__.tableList1 = res.data;

                    if( __scope__.tableList1.length>0){
                        __scope__.addMessage.activityBtn = false;
                    }

                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        // public api
        return {
            "VipScheduleGet": VipScheduleGet,
            "ProductSkuQuery": ProductSkuQuery,
            "InventoryVirtualGetOccupation": InventoryVirtualGetOccupation,
            "VipStockAdjustOrderSave": VipStockAdjustOrderSave,
            "VipStockAdjustOrderDetailGet": VipStockAdjustOrderDetailGet,
            "getWarehouse": getWarehouse
        };

    }]);