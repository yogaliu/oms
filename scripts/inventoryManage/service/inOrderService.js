/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('inOrderService', ["ApiService","$q",function(ApiService){

        /**
         * 根据条件查询入库订单的数据
         */
        var getStorageOrder = function (__scope__,userCondition){
            var url = "/Inventory/StorageOrder/Query";

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
         * 获取所有的店铺信息
         */
        function getAllWarehouseInfo(__scope__){
            var url = "/BasicInformation/Warehouse/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"IsDisabled","Name":"IsDisabled","Value":false,"Children":[]},
                {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"WarehouseType","Name":"WarehouseType","Value":1,"Children":[]},
                {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"StorageType","Name":"StorageType","Value":0,"Children":[]}
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
         * 入库类型
         */
        function getGeneralClassiFication(__scope__){
            var url = "/BasicInformation/GeneralClassiFication/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify([{
                "OperateType":0,
                "LogicOperateType":0,
                "AllowEmpty":false,
                "Field":"IsDisabled",
                "Name":"IsDisabled",
                "Value":false,
                "Children":[]
            },
                {"OperateType":0,
                    "LogicOperateType":0
                    ,"AllowEmpty":false,
                    "Field":"ClassiFicationType",
                    "Name":"ClassiFicationType",
                    "Value":28,
                    "Children":[]
                }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.generalClassiFication = res.data;
                    __scope__.inWarehouseTypeList = currentService.generalClassiFication;
                }
            });
        }

        var currentService ={
            "getStorageOrder" : getStorageOrder,
            "getGeneralClassiFication" : getGeneralClassiFication,
            "allWarehouseInfo" : {},
            "generalClassiFication" : {},
            // 查看该对象的详情
            "inOrderDetailObj" : null,
            "getAllWarehouseInfo" : getAllWarehouseInfo
        };

        return currentService;

    }]);