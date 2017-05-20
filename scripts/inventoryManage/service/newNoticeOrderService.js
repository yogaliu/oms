/**
 * Created by xs on 2017/4/10.
 */
angular.module("klwkOmsApp")
    .factory('newNoticeOrderService', ["ApiService","toolsService",
        function (ApiService,toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 计划单号
         */
        var allocationPlan = function (scope) {
            var url = "/Inventory/AllocationPlan/Get ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Status",
                    "Name": "Status",
                    "Value": 1,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableCodeList = res.data;
                    $.each(scope.tableCodeList, function (index, obj) {
                        // 默认全部显示
                        obj.isHide = false;
                    });
                }
            });
        };

        /**
         * 实物调拨明细
         */
        var getMaterialDetail = function (scope,data) {
            var url = "/Inventory/AllocationPlanDetail/Query";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "AllocationPlanCode",
                    "Name": "AllocationPlanCode",
                    "Value": data.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.materialData = res.data;
                    $.each(scope.materialData, function (index,obj) {
                        // 导入数量,默认为1
                        obj.importqty = 1;
                        // 默认ID为0
                        obj.id = 0;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                    });
                }
            });
        };

        /**
         * 调拨通知单明细
         */
        var getTransferDetail = function (scope) {
            var url = "/Inventory/AllocationPlanDetail/QueryCanNoticeQty";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": scope.formData.AllocationPlanCode,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableInfoList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableInfoList, function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 导入数量,默认为1
                        obj.importqty = 1;
                        // 数据默认展示
                        obj.isShow = true;
                        // 需要修改的数据
                        obj.editdata = true;
                    });
                    // 根据商品明细判断按钮位置
                    if (res.data.length <= 0) {
                        scope.addOrder = 'addBefore';
                    } else {
                        scope.addOrder = '';
                    }
                }
            });
        };


        /**
         * 调入仓库
         */
        var getInWarehouse = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
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
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.selectInWarehouse.info = res.data;
                    if (scope.formData.type == 'edit') {
                        if (scope.formData.InWarehouseId) {
                            scope.selectInWarehouse.setValue({id: scope.formData.InWarehouseId});
                        }
                    } else if (scope.formData.type == 'new') {
                        scope.selectInWarehouse.init();
                    }
                }
            });
        };

        /**
         * 保存
         */
        var save = function (scope, data) {
            var url = "/Inventory/AllocationOut/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Id": data.id ? data.id : 0,
                    "AllocationPlanCode": data.AllocationPlanCode,
                    "OutWarehouseId": data.OutWarehouseId,
                    "OutWarehouseName": data.OutWarehouseName,
                    "InWarehouseId": data.InWarehouseId,
                    "InWarehouseName": data.InWarehouseName,
                    "ExpressFee": 0,
                    "Remark": data.Remark,
                    "VirtualWarehouseId": data.VirtualWarehouseId,
                    "VirtualWarehouseName": data.VirtualWarehouseName,
                    "Details": scope.tableData,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                })
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content: res.errorCode, time: 1000});
                }
            });
        };

        return {
            "allocationPlan": allocationPlan,
            "getMaterialDetail":getMaterialDetail,
            "getInWarehouse": getInWarehouse,
            "save": save,
            "getTransferDetail": getTransferDetail
        };

    }]);
