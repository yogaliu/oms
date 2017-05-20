/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("runScheduleDetailService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {


        /**
         * 查询档期明细
         * @__scope__
         * @constructor
         */
        var VipScheduleDetailGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipScheduleDetail/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ScheduleId",
                "Name": "ScheduleId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                $.each(__scope__.tableList1, function (i, obj) {
                    //活动状态 根据id匹配name
                    obj.detailstatusName = APP_MENU.CITdetailstatus[obj.detailstatus];

                    obj.isZhengque = false;
                });

                if (isInit) {
                    //列表配置
                    __scope__.theadList1 = [
                        {name: "活动状态", tag: 'detailstatusName'},
                        {name: "商品编码", tag: 'productcode'},
                        {name: "商品名称", tag: 'productname'},
                        {name: "规格编码", tag: 'skucode'},
                        {name: "规格名称", tag: 'skuname'},
                        {name: "唯品规格编码", tag: 'vipskucode'},
                        {name: "计划数量", tag: 'planqty'},
                        {name: "锁定数量", tag: 'lockqty'},
                        {name: "拣货单占用数量", tag: 'occupationquantity'},
                        {name: "出库数量", tag: 'outqty'},
                        {name: "释放数量", tag: 'releaseqty'},
                        {name: "供货价(含税)", tag: 'supplyprice'},
                        {name: "上传错误信息", tag: ''}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询操作日志
         * @__scope__
         * @constructor
         */
        var VipScheduleLogGet = function (__scope__, isInit) {
            var url = "/VipOrder/VipScheduleLog/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ScheduleId",
                "Name": "ScheduleId",
                "Value": __scope__.params.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList2 = res.data;

                if (isInit) {
                    //列表配置
                    __scope__.theadList2 = [
                        {name: "操作人", tag: 'operateuser'},
                        {name: "操作日期", tag: 'createdate'},
                        {name: "日志信息", tag: 'remark'}
                    ];
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 开始活动
         * @param __scope__
         * @constructor
         */
        var VipScheduleDetailStart = function (__scope__, detail) {
            var url = "/VipOrder/VipSchedule/DetailStart";
            var paramObj = ApiService.getBasicParamobj();
            paramObj['body'] = JSON.stringify({
                "ScheduleCode": __scope__.params.tableList.schedulecode,
                "Id": __scope__.params.tableList.id,
                "CreateDate": __scope__.params.tableList.createdate,
                "Status": __scope__.params.tableList.status,
                "ScheduleType": __scope__.params.tableList.scheduletype,
                "ScheduleName": __scope__.params.tableList.schedulename,
                "WarehouseId": __scope__.params.tableList.warehouseid,
                "WarehouseName": __scope__.params.tableList.warehousename,
                "OutVirtualWarehouseId": __scope__.params.tableList.outvirtualwarehouseid,
                "OutVirtualWarehouseName": __scope__.params.tableList.outvirtualwarehousename,
                "ScheduleBeginDate": __scope__.params.tableList.schedulebegindate,
                "ScheduleEndDate": __scope__.params.tableList.scheduleenddate,
                "GoodsValue": __scope__.params.tableList.goodsvalue,
                "StoreId": __scope__.params.tableList.storeid,
                "StoreName": __scope__.params.tableList.storename,
                "IsOPenPickingOrder": __scope__.params.tableList.isopenpickingorder,
                "Note": __scope__.params.tableList.note,
                "IsNeedUpload": __scope__.params.tableList.isneedupload,
                "Detail": detail,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('结束成功');
                    VipScheduleQuery(__scope__, __scope__.paginationConf.currentPage, __scope__.paginationConf.itemsPerPage, 0, true);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        /**
         * 结束活动
         * @param __scope__
         * @constructor
         */
        var VipScheduleDetailEnd = function (__scope__, obj) {
            var url = "/VipOrder/VipSchedule/DetailEnd";
            var paramObj = ApiService.getBasicParamobj();
            var detail = [obj];

            paramObj['body'] = JSON.stringify({
                "ScheduleCode": __scope__.params.tableList.schedulecode,
                "Id": __scope__.params.tableList.id,
                "CreateDate": __scope__.params.tableList.createdate,
                "Status": __scope__.params.tableList.status,
                "ScheduleType": __scope__.params.tableList.scheduletype,
                "ScheduleName": __scope__.params.tableList.schedulename,
                "WarehouseId": __scope__.params.tableList.warehouseid,
                "WarehouseName": __scope__.params.tableList.warehousename,
                "OutVirtualWarehouseId": __scope__.params.tableList.outvirtualwarehouseid,
                "OutVirtualWarehouseName": __scope__.params.tableList.outvirtualwarehousename,
                "ScheduleBeginDate": __scope__.params.tableList.schedulebegindate,
                "ScheduleEndDate": __scope__.params.tableList.scheduleenddate,
                "GoodsValue": __scope__.params.tableList.goodsvalue,
                "StoreId": __scope__.params.tableList.storeid,
                "StoreName": __scope__.params.tableList.storename,
                "IsOPenPickingOrder": __scope__.params.tableList.isopenpickingorder,
                "Note": __scope__.params.tableList.note,
                "IsNeedUpload": __scope__.params.tableList.isneedupload,
                "Detail": detail,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('结束成功');
                    VipScheduleQuery(__scope__, __scope__.paginationConf.currentPage, __scope__.paginationConf.itemsPerPage, 0, true);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipScheduleDetailGet": VipScheduleDetailGet,
            "VipScheduleLogGet": VipScheduleLogGet,
            "VipScheduleDetailEnd": VipScheduleDetailEnd,
            "VipScheduleDetailStart": VipScheduleDetailStart,
        };

    }]);