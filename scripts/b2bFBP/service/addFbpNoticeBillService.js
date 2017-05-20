/**
 * Created by yoga on 2017/5/12.
 */

angular.module('klwkOmsApp')
    .service('addFbpNoticeBillService', ['ApiService', 'toolsService', 'APP_MENU',
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
                        "name": "通知数量", "tag": "NoticeQty"
                    },
                    {
                        "name": "导入数量", "tag": "ImportQty"
                    },
                    {
                        "name": "可出库数量", "tag": "CanOutQty"
                    },
                    {
                        "name": "单价", "tag": "Price"
                    },
                    {
                        "name": "金额", "tag": "Amount"
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
                //    "/B2B/B2BAllocationOut/Save"
                //    [{
                //    "Id": 0,
                //    "PlanId": 21,
                //    "PlanCode": "BAT1703294066900",
                //    "OutWarehouseId": "9c96078f-b480-429d-8583-c4f357c56811",
                //    "OutWarehouseName": "孩子王实体仓库",
                //    "InWarehouseId": "2e22949b-b2cf-4f5a-a662-678c4ad848ef",
                //    "InWarehouseName": "俪人购仓",
                //    "VirtualWarehouseId": "30fc7fb4-d25e-4f66-9a06-69a4f99aa08e",
                //    "VirtualWarehouseName": "广州孩子王专卖店",
                //    "StoreId": "525d3988-997a-46e7-bf3c-e24f49d52da3",
                //    "StoreName": "030388",
                //    "Details": [{
                //        "Id": 0,
                //        "ProductId": "34f3cf15-1bb8-48eb-9a5a-6570d382899e",
                //        "ProductCode": "VOP70970932530",
                //        "ProductName": "VOP70970932530",
                //        "ProductSkuId": "8856aa26-460d-42c7-a984-a20fcd4b9fcb",
                //        "ProductSkuCode": "VOP70970932530",
                //        "ProductSkuName": "VOP70970932530",
                //        "NoticeQty": 1,
                //        "OutQty": 0,
                //        "InQty": 0,
                //        "Price": 0.0,
                //        "Amount": 0.0,
                //        "ImportQty": 1,
                //        "CanOutQty": 0,
                //        "Deleted": false,
                //        "IsNew": false,
                //        "IsUpdate": false
                //    }],
                //    "Deleted": false,
                //    "IsNew": false,
                //    "IsUpdate": false
                //}]
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
            var orderListDomOperate = {
                dominit: function (scope) {
                    //初始化订单头
                    scope.productListThead = configData.productListcolumns;
                    //初始化订单详情头
                    scope.productListInfoThead = configData.productListInfocolumns;
                    //初始化选择商品详情头
                    scope.selectProductThead = configData.selectProductcolumns;

                    //初始请求
                    var url = "/B2B/B2BAllocationPlan/Get";
                    var parmas = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Status",
                        "Name": "Status",
                        "Value": 1,
                        "Children": []
                    }]);
                    InterFace.fastDatas(url, scope, parmas, function (res) {
                        scope.planCode = res.data;
                        $.each(scope.planCode, function (i, v) {
                            v.name = v.code;
                        });
                        //定义
                        scope.searchConfig.planCode.info = scope.planCode;
                    });
                    //初始化右边列表配置选项
                    scope.allocation = {
                        "theadList": scope.orderListThead,
                        // 指令控制器的ID唯一标识
                        "timestamp": null
                    };
                    scope.searchConfig = {
                        //调出仓库下拉信息的配置
                        planCode: {
                            isshow: false,
                            info: [],
                            validate: true,
                            onChange: function (obj, index) {	//点击之后的回调
                                scope.formData.PlanId = obj.id;
                                scope.formData.ScheduleNo = obj.scheduleno;
                                scope.formData.PlanCode = obj.code;
                                scope.formData.VirtualWarehouseId = obj.virtualwarehouseid;
                                scope.formData.VirtualWarehouseName = obj.virtualwarehousename;
                            },
                        },
                        outWarehouse: {
                            isshow: false,
                            info: scope.outWarehouseDatas,
                            validate: true,
                            onChange: function (obj, index) {	//点击之后的回调
//调入仓库Id
                                scope.formData.OutWarehouseId = obj.id;
                                //调入仓库名称
                                scope.formData.OutWarehouseName = obj.name;
                            },
                        },
                        //调入仓库下拉信息的配置
                        inWarehouse: {
                            isshow: false,
                            info: scope.inWarehouseDatas,
                            validate: true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //调入仓库Id
                                scope.formData.InWarehouseId = obj.id;
                                //调入仓库名称
                                scope.formData.InWarehouseName = obj.name;
                            }
                        },
                        storename: {
                            isshow: false,
                            info: scope.storeDatas,
                            validate: true,
                            onChange: function (obj, index) {	//点击之后的回调
                                //商店id
                                scope.formData.StoreId = obj.id;
                                //商店名称
                                scope.formData.StoreName = obj.name;
                            }
                        }
                    }
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
                                console.log(v);
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
                getProductQty: function (scope) {
                    var url = "/Inventory/InventoryVirtual/GetVirtualWarehouseCanAllocation";
                    InterFace.fastDatas(url, scope, configData.getProductQtyDatas(scope), function (res) {
                        //获取录入数量
                        $.each(scope.productSelectList, function (i, v) {
                            $.each(res.data, function (index, cur) {
                                //必须skuid相匹配才可以
                                if (v.ProductSkuId == cur.skuid.toLowerCase()) {
                                    //获取可调数量
                                    //如果小于0或不存在 那么默认为0
                                    v.CanOutQty = cur.canAllocationQuantity < 0 || !cur.canAllocationQuantity ? 0 : cur.canAllocationQuantity;
                                    //获取录入数量
                                    //如果小于0或不存在 那么默认为1
                                    v.ImportQty = cur.quantity < 0 || !cur.quantity ? 1 : cur.quantity;
                                }
                            })
                        })
                    })
                },
                //保存订单
                saveFbpPlanBill: function (scope) {
                    var url = "/B2B/B2BAllocationOut/Save";
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