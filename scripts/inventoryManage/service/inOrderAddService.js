/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('inOrderAddService', ["ApiService","$q",function(ApiService){

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
        function getOuterOrderList(__scope__,userCondition){
            var url = "/Inventory/OutboundOrder/Query";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            // 检查用户是否输入了查询条件
            if(userCondition !== undefined){
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.paginationOuterOrderConf.currentPage,
                    "PageSize":__scope__.paginationOuterOrderConf.itemsPerPage,
                    "Timespan": "00:00:00.154",
                    "SeletedCount": 0,
                    "Data": userCondition,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                });
            }else{
                paramObj["body"] = JSON.stringify({
                    "PageIndex":__scope__.paginationOuterOrderConf.currentPage,
                    "PageSize":__scope__.paginationOuterOrderConf.itemsPerPage,
                    "Timespan": "00:00:00.154",
                    "SeletedCount": 0,
                    "Data": [],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                });
            }

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
        function getOutboundOrderDetailById(__scope__,OutboundOrderId){
            var url = "/Inventory/OutboundOrderDetail/Query";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "OutboundOrderId",
                    "Name": "OutboundOrderId",
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
         * 获取出库类型
         */
        function getOutWarehouseTypeList(__scope__){
            // 如果缓存了数据
            if(currentService.outWarehouseTypeListObj){
                // 出库类型
                __scope__.outOrderQueryObj.outWarehouseTypeList.info = currentService.outWarehouseTypeListObj;
            }else{
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
                        // 出库类型
                        currentService.outWarehouseTypeListObj = res.data;
                        __scope__.outOrderQueryObj.outWarehouseTypeList.info = res.data;
                    }
                });
            }
        }


        /**
         * 获取所有的仓库名称
         * @param __scope__
         */
        function getAllWarehouseList(__scope__){
            // 如果缓存了数据
            if(currentService.outWarehouseTypeListObj){
                // 出库类型
                __scope__.outOrderQueryObj.allWarehouseList.info = currentService.outWarehouseTypeListObj;
            }else{
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
                    }
                ]);
                var promise = ApiService.post(url, paramObj);
                promise.then(function(res){
                    if(res.success){
                        // 出库类型
                        currentService.allWarehouseListObj = res.data;
                        //$scope.outOrderQueryObj.allWarehouseList = {
                        __scope__.outOrderQueryObj.allWarehouseList.info = res.data;
                    }
                });
            }
        }

        /**
         * 获取所有的仓库名称
         * @param __scope__
         */
        function saveStorageOrder(__scope__,userParams){
            var url = "/Inventory/StorageOrder/Save";
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
            "getSkuList" : getSkuList,
            "getInventoryVirtualBySkuid" : getInventoryVirtualBySkuid,
            "getSubWarehouseListById" : getSubWarehouseListById,
            "allWarehouseInfo" : {},
            "getAllWarehouseInfo" : getAllWarehouseInfo,
            "getOutboundOrderDetailById" : getOutboundOrderDetailById,
            // 获取出库类型
            "getOutWarehouseTypeList" : getOutWarehouseTypeList,
            // 缓存出库类型对象
            "outWarehouseTypeListObj" : null,
            // 获取所有的仓库名称
            "getAllWarehouseList" : getAllWarehouseList,
            // 缓存所有的仓库对象
            "allWarehouseListObj" : null,
            "getOuterOrderList" : getOuterOrderList,
            // 添加订单
            "saveStorageOrder" : saveStorageOrder
        };

        return currentService;

    }]);