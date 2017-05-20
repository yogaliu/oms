/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('outOrderDetailsService', ["ApiService","$q",function(ApiService){

        /**
         * 获取商品明细
         */
        var getOutboundOrderDetail = function (__scope__){
            var url = "/Inventory/OutboundOrderDetail/Query";
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "OutboundOrderId",
                    "Name": "OutboundOrderId",
                    "Value": __scope__.outOrderDetailObj.id,
                    "Children": []
                }
            ]);

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.theadListGoods = res.data;

                    var length = __scope__.theadListGoods.length;
                    var skuList = "";
                    for(var i = 0; i < length; i++){
                        skuList = skuList + __scope__.theadListGoods[i].skuid.toLowerCase() + ",";
                    }

                    var paramObj = {
                        "WarehouseId" : __scope__.outOrderDetailObj.warehouseid,
                        "SkuId" : skuList.substr(0,skuList.length-1)
                    };

                    console.dir(paramObj);

                    // 获取指定仓库中每个SKU的可调配库存数量
                    getVirtualWarehouseCanAllocation(__scope__,paramObj)

                }
            });
        };

        /**
         * 出库仓可调出的货物数量 （仓库还有多少可以调出）
         */
        var getVirtualWarehouseCanAllocation = function (__scope__,queryCondition){
            var url = "/Inventory/InventoryVirtual/GetVirtualWarehouseCanAllocation";
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": queryCondition.WarehouseId,
                    "Children": []
                },
                {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuId",
                    "Name": "SkuId",
                    "Value": queryCondition.SkuId,
                    "Children": []
                }
            ]);
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    var skuJsonObj = klwTool.arrayToJson(res.data,"skuid");

                    var length = __scope__.theadListGoods.length;
                    for(var i = 0; i < length; i++){
                        var currentObj = __scope__.theadListGoods[i];
                        var skuId = currentObj.skuid.toLowerCase();
                        currentObj.canAllocationQuantity = skuJsonObj[skuId].canAllocationQuantity;
                    }
                }
            });
        };


        /**
         * 操作日志
         */
        var getOutboundOrderLog = function(__scope__){
            var url = "/Inventory/OutboundOrderLog/Query";
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"] = JSON.stringify([
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "OutboundOrderId",
                    "Name": "OutboundOrderId",
                    "Value": __scope__.outOrderDetailObj.id,
                    "Children": []
                }
            ]);

            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.tableListLog = res.data;
                }
            });
        };


        var currentService ={
            "getVirtualWarehouseCanAllocation" : getVirtualWarehouseCanAllocation,
            "getOutboundOrderDetail" : getOutboundOrderDetail,
            "getOutboundOrderLog" : getOutboundOrderLog
        };

        return currentService;

    }]);