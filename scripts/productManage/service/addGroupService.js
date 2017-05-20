/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('addGroupService', ["ApiService","toolsService", function (ApiService,toolsService) {
        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 商品分类
         * @constructor
         */
        var classify = function (scope) {
            var url = "/Product/ProductCategory/Get";
            var promise = ApiService.post(url,$.extend({},paramObj));
            promise.then(function (res) {
                scope.classifyList = new originArrayToTreeData(res.data);
            });
        };

        /**
         * 套装详情
         * @constructor
         */
        var groupDetail = function (scope) {
            var url = "/Product/CombinedProductDetail/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CombinedProductId",
                    "Name": "CombinedProductId",
                    "Value": scope.groupItem.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableInfoList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableInfoList, function (index,obj) {
                        // 不需要修改的数据
                        obj.editdata = true;
                        // 数据默认展示
                        obj.isShow = true;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 规格编码
                        obj.code = obj.skucode;
                        // 规格名称
                        obj.description = obj.skuname;
                    });
                    // 根据套装明细判断按钮位置
                    if(res.data.length <= 0){
                        scope.addOrder = 'addBefore';
                    } else {
                        scope.addOrder = '';
                    }
                }
            });
        };

        /**
         * 商品信息
         * @constructor
         */
        var productQuery = function (scope, PageIndex, PageSize) {
            var url = "/Product/ProductSku/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": "",
                    "Data": [
                        // 商品编码
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "sku.Code",
                            "Name": "skucode",
                            "Value": scope.productItem.productCode,
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
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //是否全选
                    scope.isalldatacheck = false;
                    //列表数据
                    scope.tableSkuList = res.data;
                    //总条数
                    scope.paginationSkuConf.totalItems = res.total;
                    $.each(scope.tableSkuList, function (index,obj) {
                        obj.isSelect = false;
                        // 不需要修改的数据
                        obj.editdata = false;
                        // 数据默认展示
                        obj.isShow = true;
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        // 销售价
                        obj.saleprice = obj.wholesaleprice;
                        // 数量,默认为1
                        obj.quantity = 1;
                        // 重量,默认为0
                        obj.weight = 0;
                        // 上传比例,默认为0
                        obj.uploadratio = 0;
                        //有效开始时间,默认当前时间
                        obj.effectivetimebegin = new Date().format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                        //有效结束时间,默认一年后
                        obj.effectivetimeend = new Date().addYears(1).format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                    });
                    // 默认关联第一条
                    scope.tableSkuList[0].isSelect = true;
                    // 默认第一条仓库数量
                    getInventory(scope, res.data[0]);
                }
            });
        };

        /**
         * 查看仓库数量
         * @constructor
         */
        var getInventory = function (scope,k) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": k.code,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
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
         * 全部仓库
         * @constructor
         */
        var warehouseGet = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body:[]
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.warehouselist = klwTool.arrayToJson(res.data,'id');
                }
            });
        };

        /**
         * 保存组合套装
         * @constructor
         */
        var save = function (scope,data) {
            var url = "/Product/CombinedProduct/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "SkuId": data.skuid?data.skuid:"00000000-0000-0000-0000-000000000000",
                    "ProductId": data.productid?data.productid:"00000000-0000-0000-0000-000000000000",
                    "Code": data.code,
                    "Description": data.description,
                    "Note": data.note,
                    "FirstPrice": data.firstprice?data.firstprice:0,
                    "RetailPrice": data.retailprice?data.retailprice:0,
                    "PurchasePrice": data.purchaseprice?data.purchaseprice:0,
                    "WholeSalePrice": data.wholesaleprice? data.wholesaleprice:0.0,
                    "CostPrice": data.costprice?data.costprice:0,
                    "PlatformPrice": data.platformprice?data.platformprice:0,
                    "Weight": data.weight?data.weight:0,
                    "Length": data.length?data.length:0,
                    "Width": data.width?data.width:0,
                    "Height": data.height?data.height:0,
                    "Volume": data.volume?data.volume:0,
                    "Quantity": data.quantity?data.quantity:0,
                    "Detail": scope.tableData,
                    "IsGift": data.isgift,
                    "ProductSize": data.productsize,
                    "IsSplit": data.issplit,
                    "CategoryId": data.categoryid?data.categoryid:"00000000-0000-0000-0000-000000000000",
                    "CategoryName": data.categoryname,
                    "IsCombined": data.iscombined,
                    "Status": data.Status?data.Status:0,
                    "CreateDate": data.createdate?data.createdate:"0001-01-01 00:00:00",
                    "IsComb": data.iscomb,
                    "ProductType": data.producttype,
                    "GiftSkuCode": data.giftskucode,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if(res.success) {
                    scope.goBack();
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content: res.errorMessage, time: 1000});
                }
            });
        };

        return {
            "classify": classify,
            "groupDetail":groupDetail,
            "productQuery":productQuery,
            "getInventory":getInventory,
            "warehouseGet":warehouseGet,
            "save": save

        };

    }]);