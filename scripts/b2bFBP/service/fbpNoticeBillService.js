/**
 * Created by lsd on 2017/5/12.
 */
angular.module("klwkOmsApp")
    .service("fbpNoticeBillService", ["ApiService", "APP_MENU", "toolsService", function (ApiService, APP_MENU, toolsService) {
        //配置参数
        var configData = {
            columns: [
                {name: "状态", tag: "statusname"},
                {name: "批次号", tag: "scheduleno"},
                {name: "店铺名称", tag: "storename"},
                {name: "计划单号", tag: "plancode"},
                {name: "通知单号", tag: "code"},
                {name: "调入仓库", tag: "inwarehousename"},
                {name: "调出仓库", tag: "outwarehousename"},
                {name: "制单人", tag: "createuser"},
                {name: "制单时间", tag: "createdate"},
                {name: "备注", tag: "remark"}
            ],
            //表体数据参数
            tbDatas: function (scope) {
                return JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.167",
                    "SeletedCount": 0,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false,
                    "Data": (function(){
                        if(JSON.stringify(scope.searchformData) == "{}"){
                            return [];
                        }
                        var arr=[];
                        if(scope.searchformData.Code){
                            arr.push({
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.searchformData.Code,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.ProductCode){
                            arr.push({
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ProductCode",
                                "Name": "ProductCode",
                                "Value": scope.searchformData.ProductCode,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.PlanCode){
                            arr.push({
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PlanCode",
                                "Name": "PlanCode",
                                "Value": scope.searchformData.PlanCode,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.BeginDate){
                            arr.push({
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "BeginDate",
                                "Value": scope.searchformData.BeginDate,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.EndDate){
                            arr.push({
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "EndDate",
                                "Value": scope.searchformData.EndDate,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.InWarehouseId){
                            arr.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "InWarehouseId",
                                "Name": "InWarehouseId",
                                "Value": scope.searchformData.InWarehouseId.value,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.OutWarehouseId){
                            arr.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "OutWarehouseId",
                                "Name": "OutWarehouseId",
                                "Value": scope.searchformData.OutWarehouseId.value,
                                "Children": []
                            })
                        }
                        if(scope.searchformData.Status){
                            arr.push({
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.searchformData.Status.value,
                                "Children": []
                            })
                        }
                        if (scope.searchformData.StoreId) {
                            arr.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "StoreId",
                                "Name": "StoreId",
                                "Value": scope.searchformData.StoreId.value,
                                "Children": []
                            })
                        }
                        return arr;
                    })()
                })
            },
            //调出仓库数据
            outWarehouseDatas: function () {
                return JSON.stringify(
                    [{
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
                    }]
                )
            },
            //调入仓裤数据
            inWarehouseDatas: function () {
                return JSON.stringify(
                    [{
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
                        "Value": 3,
                        "Children": []
                    }]
                )
            },
            //店铺名称
            storeDatas: function () {
                return JSON.stringify(
                    [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }]
                )
            },
        //查询数据
        searchDatas: function (scope) {
            return JSON.stringify({
                "PageIndex": 1,
                "PageSize": 20,
                "Timespan": "00:00:00.046",
                "SeletedCount": 0,
                "Data": [{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": scope.singleSearchCode,
                    "Children": []
                }],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            })
        }
    };


//dom操作集合
var DomOperate = {
    dominit: function (scope) {
        //初始化订单头
        scope.orderlistThead = configData.columns;

        //初始化右边列表配置选项
        scope.allocation = {
            "theadList": scope.orderlistThead,
            // 指令控制器的ID唯一标识
            "timestamp": null
        };
        //获取入库数据
        listInterface.getInWarehouseDatas(scope);
        //获取出库数据
        listInterface.getOutWarehouseDatas(scope);
        //获取商店数据
        listInterface.getStoreDatas(scope);

        scope.orderListCollect = {
            //高级搜索数据集合
            searchHformData: {},
            //高级搜索筛选条件集合
            searchConditions: {},
            //订单状态
            orderStatus: {},
            //店铺列表
            storeList: {},
            //平台列表
            platformList: {},
            //调出仓库
            outWarehouse: {},
            //调入仓库
            inWarehouse: {},
        };
        //高级搜索条件
        scope.formChoseData = {
        };
        scope.searchformData = [];
    }
};

var InterFace = {

    /**
     * 获取订单列表
     * @param scope scope对象
     */
    getDatas: function (url, scope, params, callback) {
        var paramObj = ApiService.getBasicParamobj();
        paramObj['body'] = params;
        var promise = ApiService.postLoad(url, paramObj);
        promise.then(function (res) {
            callback(res);
        }, function (mes) {
            console.log(mes)
        });
    },
    fastDatas: function (url, scope, params, callback) {
        var paramObj = ApiService.getBasicParamobj();
        paramObj['body'] = params;
        var promise = ApiService.post(url, paramObj);
        promise.then(function (res) {
            callback(res);
        }, function (mes) {
            console.log(mes)
        });
    },
};
//调用接口
var listInterface = {
    //获取表体
    getOrderList: function (scope) {
        var url = '/B2B/B2BAllocationOut/Query';
        InterFace.getDatas(url, scope, configData.tbDatas(scope), function (res) {
            if (res.success) {
                scope.checkAll = false;
                //对数据进行处理
                $.each(res.data, function (i, v) {
                    for (var j in APP_MENU.B2BrequisitionStatus) {
                        if (v.status == j) {
                            v.statusname = APP_MENU.B2BrequisitionStatus[j]
                        }
                    }
                });
                scope.paginationConf.totalItems = res.total;
                scope.orderListTbody = res.data;
            }
        })
    },
    //简单搜索
    getSearchList: function (scope) {
        var url = '/B2B/B2BAllocationOut/Query';
        InterFace.getDatas(url, scope, configData.searchDatas(scope), function (res) {
            scope.orderListTbody = res.data;
        })
    },
    //获取调入仓库
    getInWarehouseDatas: function (scope) {
        var url = '/BasicInformation/Warehouse/Get';
        InterFace.getDatas(url, scope, configData.inWarehouseDatas(), function (res) {
            scope.inWarehouseDatas = res.data;
            //高级搜索展示
            toolsService.setDataShowType(scope, res.data, scope.orderListCollect.inWarehouse, 5);
        })
    },
    //获取调出仓库
    getOutWarehouseDatas: function (scope) {
        var url = '/BasicInformation/Warehouse/Get';
        InterFace.getDatas(url, scope, configData.outWarehouseDatas(), function (res) {
            scope.outWarehouseDatas = res.data;
            //高级搜索展示
            toolsService.setDataShowType(scope, res.data, scope.orderListCollect.outWarehouse, 5);
        })
    },
    //获取店铺名称
    getStoreDatas: function (scope) {
        var url = '/BasicInformation/Store/Get';
        InterFace.getDatas(url, scope, configData.storeDatas(), function (res) {
            scope.storeDatas = res.data;
            //高级搜索展示
            toolsService.setDataShowType(scope, res.data, scope.orderListCollect.storeList, 5);
        })
    },
    //关闭通知单
    overOrder: function (scope, list) {
        var url = '/B2B/B2BAllocationOut/AbnormalEnd';
        var params = JSON.stringify([{
            "OperateType": 0,
            "LogicOperateType": 0,
            "AllowEmpty": false,
            "Field": "Code",
            "Name": "Code",
            "Value": list.code,
            "Children": []
        }]);
        InterFace.getDatas(url, scope, params, function (res) {
            if (res.success) {
                toolsService.alertSuccess("关闭成功");
            }
            listInterface.getOrderList(scope)
        })
    }
};

return {
    DomOperate: DomOperate,
    Interface: listInterface
}


}])
;