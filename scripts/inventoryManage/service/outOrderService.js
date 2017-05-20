/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('outOrderService', ["ApiService","$q",function(ApiService){

        /**
         * 根据条件查询入库订单的数据
         */
        var getOutboundOrder = function (__scope__,userCondition){
            var url = "/Inventory/OutboundOrder/Query";
            var paramObj = ApiService.getBasicParamobj();
            if(userCondition !== undefined){
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":userCondition,
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }else{
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":[],
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.outOrderTableList = res.data;
                    __scope__.paginationConf.totalItems = res.total;
                }
            });
        };

        /**
         * 根据条件查询入库订单的数据
         */
        var getOutboundOrderDetail = function (__scope__,userCondition){
            var url = "/Inventory/OutboundOrderDetail/Query";
            var paramObj = ApiService.getBasicParamobj();
            if(userCondition !== undefined){
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":userCondition,
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }else{
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":[],
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableList = res.data;
                    __scope__.paginationConf.totalItems = res.total;
                }
            });
        };

        /**
         * 根据条件查询入库订单的数据
         */
        var getOutboundOrderLog = function (__scope__,userCondition){
            var url = "/Inventory/OutboundOrderLog/Query";
            var paramObj = ApiService.getBasicParamobj();
            if(userCondition !== undefined){
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":userCondition,
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }else{
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.queryCondition["PageIndex"],
                    "PageSize":__scope__.queryCondition["PageSize"],
                    "SeletedCount":0,
                    "Data":[],
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                });
            }

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableList = res.data;
                    __scope__.paginationConf.totalItems = res.total;
                }
            });
        };

        /**
         * 获取出库仓库 信息
         */
        function getAllWarehouseInfo(__scope__){
            var url = "/BasicInformation/Warehouse/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                },
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                },
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageType",
                    "Name": "StorageType",
                    "Value": 0,
                    "Children": []
                }
            ]);

            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allWarehouseInfo = res.data;
                    __scope__.warehouseList = currentService.allWarehouseInfo;
                }
            });
        }

        /**
         * 获取出库类型 信息
         */
        function getGeneralClassiFication(__scope__){
            var url = "/BasicInformation/GeneralClassiFication/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                },
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ClassiFicationType",
                    "Name": "ClassiFicationType",
                    "Value": 27,
                    "Children": []
                }
            ]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.generalClassiFication = res.data;
                    __scope__.inWarehouseTypeList = currentService.generalClassiFication;
                }
            });
        }


        var currentService ={
            "getOutboundOrder" : getOutboundOrder,
            "getOutboundOrderDetail" : getOutboundOrderDetail,
            "getOutboundOrderLog" : getOutboundOrderLog,
            // 获取出库类型 信息
            "getGeneralClassiFication" : getGeneralClassiFication,
            "generalClassiFication" : {},
            // 获取出库仓库 信息
            "getAllWarehouseInfo" : getAllWarehouseInfo,
            "allWarehouseInfo" : {},
            // 缓存选中的对象（用来查看其详情）
            "outOrderDetailObj" : {}

        };

        return currentService;

    }]);