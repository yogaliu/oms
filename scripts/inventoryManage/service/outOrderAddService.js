/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('outOrderAddService', ["ApiService","$q",function(ApiService){

        /**
         * 查询入库订单
         */
        var getStorageOrderList = function (__scope__,userCondition){
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
                    "Timespan": "00:00:00.107",
                    "SeletedCount": 0,
                    "Data": [],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                });
            }

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableOutOrderList = res.data;
                    __scope__.paginationOuterOrderConf.totalItems = res.total;
                }
            });
        };

        /**
         * 获取产品的SKU 列表
         */
        var getSkuList = function (__scope__,userCondition){
            var url = "/Product/ProductSku/Query";
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
                    __scope__.tableSkuList = res.data;
                    __scope__.paginationConf.totalItems = res.total;
                }
            });
        };



        function getSubWarehouseListById(__scope__, id){
            var url = "/BasicInformation/Warehouse/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"IsDisabled","Name":"IsDisabled","Value":false,"Children":[]},
                {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"ParentId","Name":"ParentId",
                    "Value":id,
                    "Children":[]}
            ]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.selectConfig.warehouseSubList.info = res.data;
                }
            });
        }

        /**
         * 根据SKU的规格编码 获取存货清单
         */
        function getInventoryVirtualBySkuid(__scope__,skuId){
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": skuId,
                    "Children": []
                }
            ]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.generalClassiFication = res.data;
                    for(var i = 0; i <res.data.length; i++ ){
                        var currentObj = res.data[i];
                        //console.dir(currentObj);
                        //console.log(currentObj["warehouseid"]);
                        if(currentObj["warehouseid"] === undefined){
                            currentObj["warehouseid"] = "";
                        }
                        currentObj["warehouseobj"] =  currentService.allWarehouseInfo[currentObj["warehouseid"].toLowerCase()];
                    }
                    __scope__.tableInventoryList = res.data;
                }
            });
        }

        /**
         * 获取所有的仓库的信息
         */
        function getAllWarehouseInfo(__scope__,deferred){
            var url = "/BasicInformation/Warehouse/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            var promise = ApiService.postCache(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allWarehouseInfo = klwTool.arrayToJson(res.data,"id") ;
                    if(deferred !== undefined){
                        deferred.resolve(currentService.allWarehouseInfo);
                    }
                }else{
                    if(deferred !== undefined){
                        deferred.reject("发送请求失败");
                    }
                }
            });
        }

        /**
         * 获取出库订单列表
         * @param __scope__
         */
        function getOuterOrderList(__scope__){
            var url = "/Inventory/OutboundOrder/Query";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.paginationOuterOrderConf.currentPage,
                    "PageSize":__scope__.paginationOuterOrderConf.itemsPerPage,
                    "SeletedCount":0,
                    //"Data":[
                    //    {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"sku.Status","Name":"skustatus","Value":1,"Children":[]},
                    //    {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"sku.IsCombined","Name":"IsCombined","Value":"0","Children":[]},
                    //    {"OperateType":0,"LogicOperateType":0,"AllowEmpty":false,"Field":"pro.Status","Name":"prostatus","Value":1,"Children":[]}
                    //],
                    "Deleted":false,"IsNew":false,"IsUpdate":false
                });
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableOutOrderList = res.data;
                    __scope__.paginationOuterOrderConf.totalItems = res.total;
                }
            });

        }

        /**
         * 获取出库订单详情
         */
        function getOutboundOrderDetail(){
            var url = "/Inventory/OutboundOrderDetail/Query";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify({
                "PageIndex":__scope__.paginationOuterOrderConf.currentPage,
                "PageSize":__scope__.paginationOuterOrderConf.itemsPerPage,
                "SeletedCount":0,
                "Data":[{
                    "OperateType":0,
                    "LogicOperateType":0,
                    "AllowEmpty":false,
                    "Field":"OutboundOrderId",
                    "Name":"OutboundOrderId",
                    "Value":12886545813832704,
                    "Children":[]
                }],
                "Deleted":false,"IsNew":false,"IsUpdate":false
            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableOutOrderList = res.data;
                    __scope__.paginationOuterOrderConf.totalItems = res.total;
                }
            });
        }

        /**
         * 获取 存货清单 详情
         */
        function getStorageOrderDetailById(__scope__,OutboundOrderId){
            var url = "/Inventory/StorageOrderDetail/Query";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StorageOrderId",
                    "Name": "StorageOrderId",
                    "Value": OutboundOrderId,
                    "Children": []
                }
            ]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    var tableOutOrderOfSkuList = res.data;
                    var length = tableOutOrderOfSkuList.length;
                    for(var i = 0; i < length; i++){
                        var tempObj = tableOutOrderOfSkuList[i];
                        tempObj["code"] = tempObj["skucode"];
                        tempObj["description"] = tempObj["skuname"];
                        tempObj["PlanQty"] = 1;
                        __scope__.tableInfoList.push(tempObj);
                    }
                }
            });
        }

        /**
         * 获取所有的仓库名称
         * @param __scope__
         */
        function saveOutboundOrder(__scope__,userParams){
            var url = "/Inventory/OutboundOrder/Save";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify(userParams);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    alert("保存成功");
                }
            });
        }

        var currentService ={
            "getStorageOrderList" : getStorageOrderList,
            "getSkuList" : getSkuList,
            // 根据SKU的规格编码 获取存货清单
            "getInventoryVirtualBySkuid" : getInventoryVirtualBySkuid,
            // 获取 存货清单 详情
            "getStorageOrderDetailById" : getStorageOrderDetailById,
            "getSubWarehouseListById" : getSubWarehouseListById,
            "allWarehouseInfo" : {},
            "getAllWarehouseInfo" : getAllWarehouseInfo,
            //"getOutboundOrderDetail" : getOutboundOrderDetail,
            //"getOuterOrderList" : getOuterOrderList
            "saveOutboundOrder" : saveOutboundOrder
        };

        return currentService;

    }]);