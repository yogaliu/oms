/**
 * Created by lsd on 2017/5/18.
 */
angular.module('klwkOmsApp')
    .service('addFbpSellOutputBillService', ['ApiService', 'toolsService', 'APP_MENU',
        function (ApiService, toolsService, APP_MENU) {
            //配置参数
            var configData = {
                columns: [
                    {name: "状态", tag: "statusname"},
                    {name: "店铺名称", tag: "storename"},
                    {name: "批次号", tag: "qwe"},
                    {name: "调拨单号", tag: "code"},
                    {name: "调出仓库", tag: "outwarehousename"},
                    {name: "占用仓库", tag: "virtualwarehousename"},
                    {name: "调入仓库", tag: "inwarehousename"},
                    {name: "制单人", tag: "createuser"},
                    {name: "制单时间", tag: "createdate"},
                    {name: "审核人", tag: "audituser"},
                    {name: "审核时间", tag: "auditdate"},
                    {name: "备注", tag: "remark"}
                ],
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
                            "PageIndex": scope.paginationConf.currentPage,
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
                        "name": "数量", "tag": "Qty"
                    },
                    {
                        "name": "单价", "tag": "SellingPrice"
                    },
                    {
                        "name": "总金额", "tag": "Amount"
                    }
                ],
                //获取商品库存信息
                getProductQtyDatas: function (scope) {
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
                    }])
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

            //操作集合
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
                    //scope.searchConfig = {
                    //   //出货仓库
                    //    outWarehouse: {
                    //        isshow: false,
                    //        info: scope.outWarehouseDatas,
                    //        validate: true,
                    //        onChange: function (obj, index) {	//点击之后的回调
                    //            //调入仓库Id
                    //            scope.formData.OutWarehouseId = obj.id;
                    //            //调入仓库名称
                    //            scope.formData.OutWarehouseName = obj.name;
                    //        }
                    //    },
                    //    storename: {
                    //        isshow: false,
                    //        info: scope.storeDatas,
                    //        validate: true,
                    //        onChange: function (obj, index) {	//点击之后的回调
                    //            //商店id
                    //            scope.formData.StoreId = obj.id;
                    //            //商店名称
                    //            scope.formData.StoreName = obj.name;
                    //        }
                    //    }
                    //}
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
                            if (v.warehouseid != undefined) {
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
                //保存订单
                saveFbpPlanBill: function (scope) {
                    var url = "/B2B/B2BSalesOrder/Save";
                    InterFace.fastDatas(url, scope, JSON.stringify(scope.formData), function (res) {
                        if (res.success) {
                            toolsService.alertSuccess("保存成功")
                            scope.goBack();
                        }
                    })
                }
            };

            return {
                DomOperate: orderListDomOperate,
                Interface: OrderListInterface
            }
        }]
)
;