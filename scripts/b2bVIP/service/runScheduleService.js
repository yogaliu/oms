/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("runScheduleService", ["ApiService", "toolsService", "APP_MENU", function (ApiService, toolsService, APP_MENU) {

        /**
         * 查询档期列表
         * @__scope__
         * @constructor
         */
        var VipScheduleQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipSchedule/Query";
            var data = [];
            //搜索条件
            if (__scope__.searchForm.skuCode !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.skuCode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.scheduleCode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleCode",
                    "Name": "ScheduleCode",
                    "Value": __scope__.searchForm.scheduleCode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.poCode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PoCode",
                    "Name": "PoCode",
                    "Value": __scope__.searchForm.poCode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.startTime !== '') {
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleBeginDate",
                    "Name": "ScheduleBeginDate",
                    "Value": __scope__.searchForm.startTime,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.endTime !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleBeginDate",
                    "Name": "ScheduleEndDate",
                    "Value": __scope__.searchForm.endTime,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.outHouseId !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": __scope__.searchForm.outHouseId,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isneedupload !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "isneedupload",
                    "Name": "isneedupload",
                    "Value": __scope__.simpleSelect.isneedupload,
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
                    //活动状态 根据id匹配name
                    obj.statusName = APP_MENU.CITactivityStatus[obj.status];

                    //档期类型 根据id匹配name
                    if (obj.scheduletype !== undefined) {
                        obj.scheduletypeName = APP_MENU.CITtimelineType[obj.scheduletype];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询出库仓库
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
                __scope__.houseObj = res.data;
                if (res.success) {
                    //下拉选框插件 出库仓库
                    __scope__.selectoutHouse.info = res.data;
                    __scope__.selectoutHouse.objName = {id: __scope__.searchForm.outHouseId};
                }

            }, function (res) {

            });
        };


        /**
         * 审核
         * @param __scope__
         * @constructor
         */
        var VipScheduleAudit = function (__scope__, id) {
            var url = "/VipOrder/VipSchedule/Audit";
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
                    toolsService.alertSuccess("审核成功");
                    VipScheduleQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false);

                } else {
                    toolsService.alertSuccess(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 获取详细信息
         * @param __scope__
         * @constructor
         */
        var VipScheduleDetailGet = function (__scope__, obj) {
            var url = "/VipOrder/VipScheduleDetail/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ScheduleId",
                "Name": "ScheduleId",
                "Value": obj.id,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.details=res.data;
                    VipScheduleDetailStart(__scope__,obj);
                } else {
                    toolsService.alertSuccess(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 上传库存
         * @param __scope__
         * @constructor
         */
        var VipScheduleDetailStart = function (__scope__, obj) {
            var url = "/VipOrder/VipSchedule/DetailStart";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "ScheduleCode": obj.schedulecode,
                "Id": obj.id,
                "CreateDate": obj.createdate,
                "Status": obj.status,
                "ScheduleType": obj.scheduletype,
                "ScheduleName": obj.schedulename,
                "WarehouseId": obj.warehouseid,
                "WarehouseName": obj.warehousename,
                "OutVirtualWarehouseId": obj.outvirtualwarehouseid,
                "OutVirtualWarehouseName": obj.outvirtualwarehousename,
                "ScheduleBeginDate": obj.schedulebegindate,
                "ScheduleEndDate": obj.scheduleenddate,
                "GoodsValue": obj.goodsvalue,
                "StoreId": obj.storeid,
                "StoreName": obj.storename,
                "IsOPenPickingOrder": obj.isopenpickingorder,
                "Note": obj.note,
                "IsNeedUpload": obj.isneedupload,
                "Detail":__scope__.details,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": true
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('上传成功');
                    VipScheduleQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false);

                } else {
                    res.errorMessage?toolsService.alertError(res.errorMessage):toolsService.alertError('上传失败');
                }
            }, function (res) {

            });
        };

        /**
         * 结束上传1
         * @param __scope__
         * @constructor
         */
        var VipScheduleGetUnNoticed = function (__scope__, id) {
            var url = "/VipOrder/VipSchedule/GetUnNoticed";
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
                    VipScheduleEnd(__scope__, id);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 结束上传2
         * @param __scope__
         * @constructor
         */
        var VipScheduleEnd = function (__scope__, id) {
            var url = "/VipOrder/VipSchedule/End";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(id);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("结束上传成功");
                    VipScheduleQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false);


                } else {
                    res.errorMessage?toolsService.alertError(res.errorMessage):toolsService.alertError('结束上传失败');
                }
            }, function (res) {

            });
        };

        /**
         * 填写po单号
         * @param __scope__
         * @constructor
         */
        var VipScheduleEditPoCode = function (__scope__, id, PoCode) {
            var url = "/VipOrder/VipSchedule/EditPoCode";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": id,
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "PoCode",
                "Name": "PoCode",
                "Value": PoCode,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("修改成功");
                    VipScheduleQuery(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertSuccess(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipScheduleQuery": VipScheduleQuery,
            "WarehouseGet": WarehouseGet,
            "VipScheduleAudit": VipScheduleAudit,
            "VipScheduleEditPoCode": VipScheduleEditPoCode,
            "VipScheduleGetUnNoticed": VipScheduleGetUnNoticed,
            "VipScheduleEnd": VipScheduleEnd,
            "VipScheduleDetailGet": VipScheduleDetailGet,
            "VipScheduleDetailStart": VipScheduleDetailStart,
        };


    }]);