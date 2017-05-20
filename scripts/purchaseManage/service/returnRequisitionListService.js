/**
 * Created by cj on 2017/4/8.
 */
angular.module("klwkOmsApp")
    .factory('returnRequisitionService', ["ApiService","APP_MENU","toolsService", function (ApiService,APP_MENU,toolsService) {
        var pageId = '#returnRequisitionList';  // 页面Id
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 采购退货单信息
         * @constructor
         */
        var query = function (scope, PageIndex, PageSize, data) {
            var url = "/Purchase/PurchaseReturnOrder/Query";
            var param = $.extend({
                body:JSON.stringify({
                    "PageIndex": PageIndex,
                    "PageSize": PageSize,
                    "SeletedCount": 0,
                    "Data": !data ? [] : [{
                        // 开始时间
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "BeginDate",
                        "Name": "PurchaseDate",
                        "Value": scope.searchItem.BeginDate,
                        "Children": []
                    }, {
                        // 结束时间
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "EndDate",
                        "Name": "PurchaseDate",
                        "Value": scope.searchItem.EndDate,
                        "Children": []
                    },{
                        // 采购退货单
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.searchItem.Code,
                        "Children": []
                    },{
                        // 退货仓库
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseID",
                        "Name": "WarehouseID",
                        "Value": scope.searchItem.WarehouseID,
                        "Children": []
                    },{
                        // 单据状态
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Status",
                        "Name": "Status",
                        "Value": scope.searchItem.Status,
                        "Children": []
                    }, {
                        // 商品编码
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductCode",
                        "Name": "ProductCode",
                        "Value": scope.searchItem.ProductCode,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function (res) {
                if (res.success) {
                    //列表数据
                    scope.tableList = res.data;
                    //总条数
                    scope.paginationConf.totalItems = res.total;
                    $.each(scope.tableList, function (index,obj) {
                        //状态根据id匹配name
                        if(obj.status !== undefined){
                            obj.statusname = APP_MENU.purchaseReturnStatus[obj.status];
                        }
                    });
                }
            });

        };


        /**
         * 退货仓库
         * @constructor
         */
        var warehouseGet = function (scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
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
                }])
            }, paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        // 默认显示
                        obj.isHide = false;
                    });
                    scope.warehouseData = res.data;
                    // 店铺数据数据转换(A,B,C...)
                    scope.singleWordData = toolsService.setDataShowType(scope,res.data,[],6);
                }
            });
        };

        /**
         * 审核
         * @constructor
         */
        var audit = function (scope) {
            var url = "/Purchase/PurchaseReturnOrder/Approval";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #auditModal').modal('hide');
                    returnPurchaseList(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItemList = [];
                }

            });
        };

        /**
         * 关闭
         * @constructor
         */
        var cancel = function (scope) {
            var url = "/Purchase/PurchaseReturnOrder/Close";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Id",
                    "Name": "Id",
                    "Value": scope.activeItem.id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $(pageId + ' #cancelModal').modal('hide');
                    returnPurchaseList(scope, scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                    scope.activeItemList = [];
                }

            });
        };

        return {
            "query": query,
            "warehouseGet": warehouseGet,
            "audit": audit,
            "cancel": cancel
        };

    }]);