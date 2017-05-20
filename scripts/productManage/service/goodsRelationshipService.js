/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('goodsRelationshipService', ["ApiService", "toolsService", function (ApiService, toolsService) {
        var pageId = '#goodsRelationship'; // 页面Id
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 店铺
         * @constructor
         */
        var getStore = function (scope, deffer) {
            var url = "/BasicInformation/Store/Get ";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.storeData = res.data;
                    $.each(res.data, function (index, obj) {
                        // 默认显示
                        obj.isHide = false;
                    });
                    // 铺货下载
                    scope.selectStore1.info = res.data;
                    // 平台查询
                    scope.selectStore2.info = res.data;
                    // 扣减方式
                    scope.selectStore3.info = res.data;
                    // 列表显示需要数据
                    scope.storelist = klwTool.arrayToJson(res.data,'id');
                    // 搜索展示数据
                    scope.searchStore = res.data;
                    // 店铺数据数据转换(A,B,C...)
                    scope.singleWordData = toolsService.setDataShowType(scope, res.data, [], 6);
                    if (deffer !== undefined) {
                        deffer.resolve();
                    }
                } else {
                    if (deffer !== undefined) {
                        deffer.reject();
                    }
                }
            });
        };

        /**
         * 仓库
         * @constructor
         */
        var warehouseGet = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: []
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.warehouselist = klwTool.arrayToJson(res.data,'id');
                }
            });
        };

        /**
         * 铺货下载列表
         * @constructor
         */
        var query = function (scope, PageIndex, PageSize, data) {
            var url = "/Product/Distribution/Get";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": '',
                    "Data": !data ? [] : [
                        // 店铺
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "StoreId",
                            "Name": "StoreId",
                            "Value": scope.searchItem.storeid,
                            "Children": []
                        },
                        //平台商品ID
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformId",
                            "Name": "PlatformId",
                            "Value": scope.searchItem.PlatformId,
                            "Children": []
                        },
                        // 平台规格ID
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformSkuId",
                            "Name": "PlatformSkuId",
                            "Value": scope.searchItem.PlatformSkuId,
                            "Children": []
                        },
                        // 商家商品编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformOutCode",
                            "Name": "PlatformOutCode",
                            "Value": scope.searchItem.PlatformOutCode,
                            "Children": []
                        },
                        // 商家规格编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformSkuOutCode",
                            "Name": "PlatformSkuOutCode",
                            "Value": scope.searchItem.PlatformSkuOutCode,
                            "Children": []
                        },
                        // 系统商品编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "dp.ProductCode",
                            "Name": "ProductCode",
                            "Value": scope.searchItem.ProductCode,
                            "Children": []
                        },
                        // 系统规格编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "dp.ProductSkuCode",
                            "Name": "ProductSkuCode",
                            "Value": scope.searchItem.ProductSkuCode,
                            "Children": []
                        },
                        // 平台状态
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "PlatformStatus",
                            "Name": "PlatformStatus",
                            "Value": scope.searchItem.PlatformStatus,
                            "Children": []
                        },
                        // 扣减方式
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "DeductionMethod",
                            "Name": "DeductionMethod",
                            "Value": scope.searchItem.DeductionMethod,
                            "Children": []
                        },
                        // 关联
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsAssociated",
                            "Name": "IsAssociated",
                            "Value": scope.searchItem.isassociated,
                            "Children": []
                        },
                        // 自动上传
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsAutoUploadInventory",
                            "Name": "IsAutoUploadInventory",
                            "Value": scope.queryItem.isautouploadinventory,
                            "Children": []
                        },
                        // 自动上架
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsAutoListing",
                            "Name": "IsAutoListing",
                            "Value": scope.queryItem.isautolisting,
                            "Children": []
                        },
                        // 自动下架
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsAutoDelisting",
                            "Name": "IsAutoDelisting",
                            "Value": scope.queryItem.isautodelisting,
                            "Children": []
                        }
                    ],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {

                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    //列表数据
                    scope.tableList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index, obj) {
                        obj.isQuerySelect = false;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        if (obj.storeid !== undefined) {
                            obj.storename = scope.storelist[obj.storeid].name;
                        }
                    });
                    if(res.data.length!=0) {
                        // 默认第一条关联商品
                        scope.association = res.data[0].product?res.data[0].product:'';
                        scope.tableList[0].isQuerySelect = true;
                        // 默认第一条商品Id
                        scope.associationId = scope.tableList[0].id;
                    }


                }
            });
        };

        /**
         * 自动上传
         * @constructor
         */
        var autoUpload = function (scope, value, type) {
            var data = [];
            if (type == 'single') {
                // 后台所需 否则报错("can not cast to int, value : false")
                scope.activeItem.product = scope.activeItem.product?$.extend({
                    "IsManual": true
                },scope.activeItem.product):{};
                data.push(scope.activeItem);
            } else if (type == 'batch') {
                $.each(scope.tableList, function (index, obj) {
                    if (obj.isdatacheck) {
                        // 后台所需 否则报错("can not cast to int, value : false")
                        obj.product = obj.product?$.extend({
                            "IsManual": true
                        },obj.product):{};
                        data.push(obj);
                    }
                });
            }
            var url = "/Product/Distribution/SetIsAutoUploadInventory";
            var param = $.extend({
                value: value,
                body: JSON.stringify(data)
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItem = {};
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }

            });
        };

        /**
         * 自动上架
         * @constructor
         */
        var autoListing = function (scope, value, type) {
            var data = [];
            if (type == 'single') {
                // 后台所需 否则报错("can not cast to int, value : false")
                scope.activeItem.product = scope.activeItem.product?$.extend({
                    "IsManual": true
                },scope.activeItem.product):{};
                data.push(scope.activeItem);
            } else if (type == 'batch') {
                $.each(scope.tableList, function (index, obj) {
                    if (obj.isdatacheck) {
                        // 后台所需 否则报错("can not cast to int, value : false")
                        obj.product = obj.product?$.extend({
                            "IsManual": true
                        },obj.product):{};
                        data.push(obj);
                    }
                });
            }
            var url = "/Product/Distribution/SetIsAutoListing";
            var param = $.extend({
                value: value,
                body: JSON.stringify(data)
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItem = {};
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 自动下架
         * @constructor
         */
        var autoDeListing = function (scope, value, type) {
            var data = [];
            if (type == 'single') {
                // 后台所需 否则报错("can not cast to int, value : false")
                scope.activeItem.product = scope.activeItem.product?$.extend({
                    "IsManual": true
                },scope.activeItem.product):{};
                data.push(scope.activeItem);
            } else if (type == 'batch') {
                $.each(scope.tableList, function (index, obj) {
                    if (obj.isdatacheck) {
                        // 后台所需 否则报错("can not cast to int, value : false")
                        obj.product = obj.product?$.extend({
                            "IsManual": true
                        },obj.product):{};
                        data.push(obj);
                    }
                });
            }
            var url = "/Product/Distribution/SetIsAutoDeListing";
            var param = $.extend({
                value: value,
                body: JSON.stringify(data)
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItem = {};
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 删除
         * @constructor
         */
        var deleteGoods = function (scope, type) {
            var data = [];
            if (type == 'single') {
                data.push(scope.activeItem.id);
            } else if (type == 'batch') {
                $.each(scope.tableList, function (index, obj) {
                    if (obj.isdatacheck) {
                        data.push(obj.id);
                    }
                });
            }
            var url = "/Product/Distribution/DeleteByIds";
            var param = $.extend({
                body: JSON.stringify(data)
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    if (type == 'single') {
                        $(pageId + " #deleteModal").modal('hide');
                    } else if (type == 'batch') {
                        $(pageId + " #batchDeleteModal").modal('hide');
                    }
                    scope.activeItem = {};
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 设置上下架阀值
         * @constructor
         */
        var setThreshold = function (scope, type) {
            var data = [];
            if (type == 'single') {
                // 后台所需 否则报错("can not cast to int, value : false")
                scope.activeItem.product = scope.activeItem.product?$.extend({
                    "IsManual": true
                },scope.activeItem.product):{};
                data.push(scope.activeItem);
            } else if (type == 'batch') {
                $.each(scope.tableList, function (index, obj) {
                    if (obj.isdatacheck) {
                        // 后台所需 否则报错("can not cast to int, value : false")
                        obj.product = obj.product?$.extend({
                            "IsManual": true
                        },obj.product):{};
                        data.push(obj);
                    }
                });
            }
            var url = "/Product/Distribution/SetThreshold";
            var param = $.extend({
                ListingThreshold: scope.activeItem.topThreshold,
                DeListingThreshold: scope.activeItem.bottomThreshold,
                Distributions: JSON.stringify(data)
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItem = {};
                    if (type == 'single') {
                        $(pageId + " #setThresholdModal").modal('hide');
                    } else if (type == 'batch') {
                        $(pageId + " #batchSetThresholdModal").modal('hide');
                    }
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }

            });
        };

        /**
         * 库存扣减方式
         * @constructor
         */
        var updateItem = function (scope) {
            var url = "/Product/Distribution/UpdateItem";
            var param = $.extend({
                "status": scope.deductionItem.status,
                "outstock": scope.deductionItem.outstock,
                "numiid": scope.deductionItem.numiid,
                "storeid": scope.deductionItem.storeid,
                "interfaceid": scope.deductionItem.interfaceid
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    $(pageId + " #inventoryWayModal").modal('hide');
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }

            });
        };


        /**
         * 铺货下载
         * @constructor
         */
        var download = function (scope) {
            // 后台所需 否则报错("can not cast to int, value : false")
            scope.downloadItem.Store = $.extend({
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            },scope.downloadItem.Store);
            scope.downloadItem.Store.storeSetting = scope.downloadItem.Store.storeSetting?$.extend({
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            },scope.downloadItem.Store.storeSetting):{};
            var url = "/Product/Distribution/Download";
            var param = $.extend({
                body: JSON.stringify({
                    'Store': scope.downloadItem.Store,
                    "ProductId": scope.downloadItem.ProductId,
                    "ProductCode": scope.downloadItem.ProductCode,
                    "BeginDate": scope.downloadItem.BeginDate,
                    "EndDate": scope.downloadItem.EndDate,
                    "CoverSetting": scope.downloadItem.isDefault,
                    "Status": scope.downloadItem.productStatus,
                    "YiHaoDianProductType": 0,
                    "UserId": "00000000-0000-0000-0000-000000000000",
                    "IsAutoListing": scope.downloadItem.isPutaway,
                    "IsAutoDeListing": scope.downloadItem.isSoldout,
                    "IsAutoUploadInventory": scope.downloadItem.isUpload,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    $(pageId + " #shopDownloadModal").modal('hide');
                    $(pageId + " #wholeShopDownloadModal").modal('hide');
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 平台库存查询
         * @constructor
         */
        var platformQuery = function (scope) {
            // 后台所需 否则报错("can not cast to int, value : false")
            scope.platformItem.store = $.extend({
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            },scope.platformItem.store);
            scope.platformItem.store.storeSetting = scope.platformItem.store.storeSetting?$.extend({
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            },scope.platformItem.store.storeSetting):{};
            var url = "/Product/Distribution/InventoryQuery";
            var param = $.extend({
                body: JSON.stringify({
                    "Store": scope.platformItem.store,
                    "ProductId": scope.platformItem.productId,
                    "ProductCode": scope.platformItem.productCode,
                    "CoverSetting": false,
                    "Status": 0,
                    "YiHaoDianProductType": 0,
                    "UserId": "00000000-0000-0000-0000-000000000000",
                    "IsAutoListing": false,
                    "IsAutoDeListing": false,
                    "IsAutoUploadInventory": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    $(pageId + " #inventoryQueryModal").modal('hide');
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 删除关联商品
         * @constructor
         */
        var deleteProduct = function (scope) {
            var url = "/Product/Distribution/DeleteProduct";
            var param = $.extend({
                body: JSON.stringify({
                    "DistributionId": scope.associationId,
                    "ProductId": scope.association.productid,
                    "ProductCode": scope.association.productcode,
                    "ProductTitle": scope.association.poducttitle,
                    "ProductSkuId": scope.association.productskuid,
                    "ProductSkuCode": scope.association.productskucode,
                    "ProductSkuTitle": scope.association.productskutitle,
                    "ProductType": scope.association.producttype,
                    "ListingThreshold": scope.association.listingthreshold,
                    "DeListingThreshold": scope.association.delistingthreshold,
                    "IsManual": true,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 保存关联商品
         * @constructor
         */
        var saveProduct = function (scope, data) {
            var url = "/Product/Distribution/SaveProduct";
            var param = $.extend({
                body: JSON.stringify({
                    "DistributionId": scope.associationId,
                    "ProductId": data.productid,
                    "ProductCode": data.productcode,
                    "ProductTitle": data.producttitle ? data.producttitle : data.productname,
                    "ProductSkuId": data.productskuid ? data.productskuid : data.skuid,
                    "ProductSkuCode": data.productskucode ? data.productskuid : data.skuid,
                    "ProductSkuTitle": data.productskutitle ? data.productskutitle : data.description,
                    "ProductType": data.producttype,
                    "ListingThreshold": data.listingthreshold?data.listingthreshold:0,
                    "DeListingThreshold": data.delistingthreshold?data.delistingthreshold:0,
                    "IsManual": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    query(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        /**
         * 获取关联商品规格信息
         * @constructor
         */
        var productQuery = function (scope, PageIndex, PageSize) {
            var url = "/Product/ProductSku/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [
                        // 商品代码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Code",
                            "Name": "procode",
                            "Value": scope.productItem.productCode,
                            "Children": []
                        },
                        // 商品名称
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Description",
                            "Name": "prodes",
                            "Value": scope.productItem.productName,
                            "Children": []
                        },
                        // 规格代码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Code",
                            "Name": "skucode",
                            "Value": scope.productItem.code,
                            "Children": []
                        },
                        // 规格名称
                        {
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Description",
                            "Name": "skudes",
                            "Value": scope.productItem.description,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Status",
                            "Name": "skustatus",
                            "Value": 1,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.IsCombined",
                            "Name": "IsCombined",
                            "Value": "0",
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Status",
                            "Name": "prostatus",
                            "Value": 1,
                            "Children": []
                        }
                    ],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    $.each(res.data, function (index, obj) {
                        obj.isProductSelect = false;
                        // 转换数据
                        obj.producttype = obj.productType;
                    });
                    scope.tableSkuList = res.data;
                    //总条数
                    scope.paginationSkuConf.totalItems = res.total;
                    // 默认第一条仓库数量
                    scope.tableSkuList[0].isProductSelect = true;
                    getInventory(scope, res.data[0]);
                }
            });
        };

        /**
         * 查看仓库数量
         * @constructor
         */
        var getInventory = function (scope, data) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": data.code,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.inventoryNum = res.data;
                    $.each(scope.inventoryNum, function (index, obj) {
                        if (obj.warehouseid !== undefined) {
                            if(scope.warehouselist[obj.warehouseid]) {
                                obj.warehousename = scope.warehouselist[obj.warehouseid].name;
                            } else {
                                obj.warehousename = '**未知数据**';
                            }
                        }
                    });
                }
            });
        };

        /**
         * 获取关联组合套装信息
         * @constructor
         */
        var getGroup = function (scope, PageIndex, PageSize) {
            var url = "/Product/CombinedProduct/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": '',
                    "Data": [{
                        // 套装名称
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Description",
                        "Name": "Description",
                        "Value": scope.groupItem.description,
                        "Children": []
                    }, {
                        // 套装代码
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.groupItem.code,
                        "Children": []
                    }, {
                        // 规格编码
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "SkuCode",
                        "Name": "SkuCode",
                        "Value": scope.groupItem.skuCode,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Status",
                        "Name": "Status",
                        "Value": 1,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableGroupList = res.data;
                    $.each(res.data, function (index, obj) {
                        obj.isGroupSelect = false;
                        // 转换数据
                        obj.producttype = obj.productType;
                    });
                    //总条数
                    scope.paginationGroupConf.totalItems = res.total;
                }
            });
        };

        return {
            "getStore": getStore,
            "query": query,
            "autoUpload": autoUpload,
            "autoListing": autoListing,
            "autoDeListing": autoDeListing,
            "deleteGoods": deleteGoods,
            "setThreshold": setThreshold,
            "updateItem": updateItem,
            "download": download,
            "platformQuery": platformQuery,
            "deleteProduct": deleteProduct,
            "saveProduct": saveProduct,
            "productQuery": productQuery,
            "getInventory": getInventory,
            "warehouseGet": warehouseGet,
            "getGroup": getGroup
        };

    }]);