/**
 * Created by lsd on 2017/5/12.
 */
angular.module('klwkOmsApp')
    .service('addFbpPlanBillService', ['ApiService', 'toolsService', 'APP_MENU',
        function (ApiService, toolsService, APP_MENU) {
            //配置参数
            var configData = {
                //查询占用仓库
                occWarehouseDatas: function (obj) {
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
                            "Field": "ParentId",
                            "Name": "ParentId",
                            "Value": obj.id,
                            "Children": []
                        }]
                    )
                },
                //查询商品信息
                productListcolumns: [
                    {name: "商品编码", tag: "productcode"},
                    {name: "商品名称", tag: "productname"},
                    {name: "规格编码", tag: "code"},
                    {name: "规格名称", tag: "description"},
                    {name: "市场价", tag: "firstprice"},
                    {name: "重量", tag: "weight"},
                    {name: "备注", tag: "remark"},
                ]
                ,
                productListInfocolumns: [
                    {name: "仓库名称", tag: "warehousename"},
                    {name: "库存数", tag: "quantity"},
                    {name: "可用数", tag: "canUseQuantity"},
                    {name: "可销数", tag: "canSaleQuantity"}
                ]
                ,
                productListDatas: function (scope) {
                    return JSON.stringify(
                        {
                            "PageIndex":  scope.paginationConf.currentPage,
                            "PageSize": scope.paginationConf.itemsPerPage,
                            "Timespan": "00:00:13.148",
                            "SeletedCount": 0,
                            "Data": [{
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
                        }
                    )
                },
                //查询商品详情信息
                productInfoDatas: function (list) {
                    return JSON.stringify(
                        [{
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Code",
                            "Name": "Code",
                            "Value": list.code,
                            "Children": []
                        }]
                    )
                },
                //选择商品得到详情信息
                selectProductcolumns: [
                    {name: "商品编码", tag: "ProductCode"},
                    {name: "商品名称", tag: "ProductName"},
                    {
                        name: "规格编码", tag: "ProductSkuCode"
                    },
                    {
                        name: "规格名称", tag: "ProductSkuName"
                    },
                    {
                        "name": "计划数量", "tag": "PlanQty"
                    },
                    {
                        "name": "录入数量", "tag": "InputQty"
                    },
                    {
                        "name": "可调数量", "tag": "OutCanAllocationQty"
                    },
                    {
                        "name": "单价", "tag": "Price"
                    },
                    {
                        "name": "金额", "tag": "Amount"
                    }
                ],
                //获取商品库存信息
                getProductQtyDatas:function(scope){
                    return JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                        //占用仓库Id
                    "Value": scope.formData.VirtualWarehouseId,
                    "Children": []
                }, {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuId",
                    "Name": "SkuId",
                        //商品们的skuId
                    "Value": scope.productsSkuId,
                    "Children": []
                }])}
                //发送保存的信息
                //saveDatas:function(scope) {
                //   return  [{
                //        "Id": 0,
                //        "OutWarehouseId": scope.formData.InWarehouseId,
                //        "OutWarehouseName": scope.formData.OutWarehouseName,
                //        "InWarehouseId":scope.formData.InWarehouseId,
                //        "InWarehouseName": scope.formData.InWarehouseName,
                //        "VirtualWarehouseId": scope.formData.VirtualWarehouseId,
                //        "VirtualWarehouseName": scope.formData.VirtualWarehouseName,
                //        "StoreId": scope.formData.StoreId,
                //        "StoreName": scope.formData.StoreName,
                //        "Details": [{
                //            "Id": 0,
                //            "ProductId": "aef01449-49a0-45d4-8e00-1df9c962d3c2",
                //            "ProductCode": "2209",
                //            "ProductName": "2209",
                //            "ProductSkuId": "ffff2657-7c70-47a8-9bcb-d00c72667e5d",
                //            "ProductSkuCode": "2209-I01107",
                //            "ProductSkuName": "白色-I01 17码-107",
                //            "PlanQty": 78,
                //            "LockedQty": 0,
                //            "OutQty": 0,
                //            "InQty": 0,
                //            "Price": 45.0000,
                //            "Amount": 3510.0000,
                //            "InputQty": 1,
                //            "OutCanAllocationQty": 0,
                //            "CanNoticeQty": 0,
                //            "Deleted": false,
                //            "IsNew": false,
                //            "IsUpdate": false
                //        }, {
                //            "Id": 0,
                //            "ProductId": "77e01cb6-d668-4c1c-975a-b313c0cf8ffe",
                //            "ProductCode": "EM0036",
                //            "ProductName": "EM0036",
                //            "ProductSkuId": "fffd6b64-462f-411c-9eb8-9c5564709cf4",
                //            "ProductSkuCode": "EM0036-I0834",
                //            "ProductSkuName": "米灰色-I08 34-34",
                //            "PlanQty": 72,
                //            "LockedQty": 0,
                //            "OutQty": 0,
                //            "InQty": 0,
                //            "Price": 54.7800,
                //            "Amount": 3944.1600,
                //            "InputQty": 1,
                //            "OutCanAllocationQty": 0,
                //            "CanNoticeQty": 0,
                //            "Deleted": false,
                //            "IsNew": false,
                //            "IsUpdate": false
                //        }],
                //        "Deleted": false,
                //        "IsNew": false,
                //        "IsUpdate": false
                //    }]
                //}
            };


//初始化操作集合
            var orderListDomOperate = {
                dominit: function (scope) {
                    //初始化订单头
                    scope.productListThead = configData.productListcolumns;
                    //初始化订单详情头
                    scope.productListInfoThead = configData.productListInfocolumns;
                    //初始化选择商品详情头
                    scope.selectProductThead = configData.selectProductcolumns;
                    //初始化右边列表配置选项
                    scope.allocation = {
                        "theadList": scope.orderListThead,
                        // 指令控制器的ID唯一标识
                        "timestamp": null
                    };
                    scope.searchConfig = {
                        //调出仓库下拉信息的配置
                        outWarehouse: {
                            isshow: false,
                            info: scope.outWarehouseDatas,
                            validate:true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //调出仓库Id
                                scope.formData.OutWarehouseId = obj.id;
                                //调出仓库名称
                                scope.formData.OutWarehouseName = obj.name;

                                var url = "/BasicInformation/Warehouse/Get";
                                InterFace.fastDatas(url, scope, configData.occWarehouseDatas(obj), function (res) {
                                    scope.searchConfig.occWarehouse.info = res.data
                                })

                            }
                        },
                        //调入仓库下拉信息的配置
                        inWarehouse: {
                            isshow: false,
                            info: scope.inWarehouseDatas,
                            validate:true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //调入仓库Id
                                scope.formData.InWarehouseId = obj.id;
                                //调入仓库名称
                                scope.formData.InWarehouseName = obj.name;
                            }
                        },
                        storeName: {
                            isshow: false,
                            info: scope.storeDatas,
                            validate:true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //商店id
                                scope.formData.StoreId = obj.id;
                                //商店名称
                                scope.formData.StoreName = obj.name;
                            }
                        },
                        occWarehouse: {
                            isshow: false,
                            info: null,
                            validate:true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //占用仓库id
                                scope.formData.VirtualWarehouseId = obj.id;
                                //占用仓库名称
                                scope.formData.VirtualWarehouseName = obj.name;
                            }
                        }
                    };
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
                        toolsService.alertError(mes)
                    });
                },
                fastDatas: function (url, scope, params, callback) {
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['body'] = params;
                    var promise = ApiService.post(url, paramObj);
                    promise.then(function (res) {
                        callback(res);
                    }, function (mes) {
                        toolsService.alertError(mes)
                    });
                },
            };

//调用接口
            var OrderListInterface = {
                //获取表体
                getProductList: function (scope) {
                    var url = '/Product/ProductSku/Query';
                    InterFace.getDatas(url, scope, configData.productListDatas(scope), function (res) {
                        scope.productListTbody = res.data;
                        $.each(res.data, function (i, v) {
                            v.isdatacheck = false;
                        });
                        scope.paginationConf.totalItems = res.total;
                    });

                },
                //获取商品详情
                getProductInfoList: function (scope, list) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    InterFace.fastDatas(url, scope, configData.productInfoDatas(list), function (res) {

                        $.each(res.data, function (i, v) {
                            if (v.warehouseid !== undefined) {
                                v.warehousename = scope.warehouseNameList[v.warehouseid.toLowerCase()].name
                            }
                        });
                        scope.productListInfoTbody = res.data;
                    })
                },
                //获取仓库名
                getWarehouseNameList: function (scope) {
                    var url = "/BasicInformation/Warehouse/Get";
                    InterFace.fastDatas(url, scope, [], function (res) {
                        scope.warehouseNameList = klwTool.arrayToJson(res.data, 'id');
                    })
                },
                //获取商品
                getProductQty:function(scope){
                    var url = "/Inventory/InventoryVirtual/GetVirtualWarehouseCanAllocation";
                    InterFace.fastDatas(url, scope, configData.getProductQtyDatas(scope), function (res) {
                        //获取录入数量
                        $.each(scope.productSelectList,function(i,v){
                            $.each(res.data,function(index,cur){
                                //必须skuid相匹配才可以
                                if(v.ProductSkuId==cur.skuid.toLowerCase()){
                                    //获取可调数量
                                    //如果小于0或不存在 那么默认为0
                                    v.OutCanAllocationQty= cur.canAllocationQuantity<0 || !cur.canAllocationQuantity? 0 : cur.canAllocationQuantity;
                                    //获取录入数量
                                    //如果小于0或不存在 那么默认为1
                                    v.InputQty=cur.quantity<0 || !cur.quantity ? 1 : cur.quantity;
                                }
                            })
                        })
                    })
                },
                //保存订单
                saveFbpPlanBill: function (scope) {
                    var url = "/B2B/B2BAllocationPlan/Save";
                    InterFace.fastDatas(url, scope, JSON.stringify(scope.formData), function (res) {
                        if(res.success){ toolsService.alertSuccess("保存成功")
                            scope.goBack();
                        };
                    })
                }
            };

            return {
                DomOperate: orderListDomOperate,
                Interface: OrderListInterface,
            }
        }]
)
;