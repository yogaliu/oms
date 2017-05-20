/**
 * 定义systemInventoryService服务
 * 功能：系统库存页面请求
 * */
angular.module("klwkOmsApp")
    .factory('systemInventoryService', ["ApiService","APP_COLORS","WAP_CONFIG","toolsService",function(ApiService,APP_COLORS,WAP_CONFIG,toolsService){
        var paramObj = {
            "UserId" : APP_COLORS.UserId,
            "UserName" : APP_COLORS.username,
            "TimeStamp" : ApiService.getMd5code().timestamp,
            "sign" : ApiService.getMd5code().code,
            "Version" : WAP_CONFIG.version,
            "LoginKey": APP_COLORS.LoginKey,
        };
        /**
         * 查询系统库存
         */
        var queryInventory = function (scope){
            var url = "/Inventory/InventoryVirtual/QueryInventory";
            var data=[];
            if(scope.OperateType==0){
                data.push(
                    {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Quantity",
                        "Name": "Quantity",
                        "Value": 0,
                        "Children": []
                    }
                );
            };
            if(scope.OperateType==2){
                data.push(
                    {
                        "OperateType": 2,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Quantity",
                        "Name": "Quantity",
                        "Value": 0,
                        "Children": []
                    }
                );
            };
            if(scope.formChoseData.WarehouseId){
                data.push( 
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseId",
                        "Name": "WarehouseId",
                        "Value": scope.formChoseData.WarehouseId.value,
                        "Children": []
                     }
                );
            };
            if(scope.formChoseData.Brand){
                data.push(
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Brand",
                        "Name": "Brand",
                        "Value": scope.formChoseData.Brand.value,
                        "Children": []
                    }
                );
            };
            if(scope.formData.productName){
                data.push(
                    {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductName",
                        "Name": "ProductName",
                        "Value": scope.formData.productName,
                        "Children": []
                    }
                );
            };
            if(scope.formData.productCode){
                data.push(
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductCode",
                        "Name": "ProductCode",
                        "Value": scope.formData.productCode,
                        "Children": []
                    }
                );
            };
            if(scope.formData.skuCode){
                data.push(
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": scope.formData.skuCode,
                        "Children": []
                    }
                );
            };


            paramObj.body = JSON.stringify();
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "SeletedCount": 0,
                    "Timespan": "00:00:09.959",
                    "Data": data,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    $.each(res.data,function (inde ,obj) {
                        $.each(scope.warehouse,function (inde ,warehouseObj) {
                            if(obj.warehouseid==warehouseObj.id){
                                obj.warehouseName= warehouseObj.name;
                            };
                        });
                    });
                    scope.inventoryList = res.data;
                    scope.paginationConf.totalItems = res.total;
                };
            });
        };

        /**
         * 查询仓库
         */
        var queryWarehouse = function (scope,_callBack){
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
                    "OperateType": 1,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.warehouse =res.data;
                    toolsService.setDataShowType(scope, res.data,scope.inventoryAdvan.commendWareHouse,5);
                    queryInventory(scope);
                    if(_callBack){
                        _callBack();
                    }
                }

            });
        };


        /**
         * 查询品牌
         */
        var queryBrand = function (scope,_callBack){
            var url = "/BasicInformation/GeneralClassiFication/Get";
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
                    "Field": "ClassiFicationType",
                    "Name": "ClassiFicationType",
                    "Value": 2,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.setDataShowType(scope, res.data,scope.inventoryAdvan.commendBrand,5);
                    if(_callBack){
                        _callBack();
                    }
                }

            });
        };


        /**
         * 同步所选仓库库存
         */
        var  inventoryVirtual= function (scope,_callBack){
            var url = "/Inventory/InventoryVirtual/SyncInventory";
            var param = $.extend({
                body: JSON.stringify([{
                    "SkuId": scope.synchronizeItem.skuid,
                    "ProductId": scope.synchronizeItem.productid,  //商品iD
                    "ProductCode": scope.synchronizeItem.productcode, //商品编码
                    "ProductName": scope.synchronizeItem.productname,  //商品名称
                    "Code":  scope.synchronizeItem.code,  // 商品规格
                    "Description":  scope.synchronizeItem.description, //规格名称
                    "FirstPrice":  scope.synchronizeItem.firstprice,
                    "RetailPrice":  scope.synchronizeItem.retailprice,
                    "PurchasePrice":  scope.synchronizeItem.purchaseprice,
                    "WholeSalePrice":  scope.synchronizeItem.wholesaleprice,
                    "CostPrice":  scope.synchronizeItem.costprice,
                    "PlatformPrice": scope.synchronizeItem.platformprice,
                    "Weight":  scope.synchronizeItem.weight,
                    "Length":  scope.synchronizeItem.length,
                    "Width":  scope.synchronizeItem.width,
                    "Height":  scope.synchronizeItem.height,
                    "Volume":  scope.synchronizeItem.volume,
                    "Quantity":  scope.synchronizeItem.quantity,
                    "IsGift":  scope.synchronizeItem.isgift,
                    "IsSplit":  scope.synchronizeItem.issplit,
                    "CategoryId":  scope.synchronizeItem.categoryid,
                    "IsCombined":  scope.synchronizeItem.iscombined,
                    "Status":  scope.synchronizeItem.status,
                    "CreateDate":  scope.synchronizeItem.createdate,
                    "IsComb":  false,
                    "ProductType": scope.synchronizeItem.productType,
                    "Deleted": scope.synchronizeItem.deleted,
                    "IsNew": scope.synchronizeItem.isnew,
                    "IsUpdate": scope.synchronizeItem.isupdate
                }]),
                warehouseId: scope.synchronizeItem.synchronizewarehouseId
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.warehouse =  res.data;
                    if(_callBack){
                        _callBack();
                    }
                }
            });
        };


        // public api
        return {
            "queryInventory" : queryInventory,
            "queryWarehouse" : queryWarehouse,
            "queryBrand" : queryBrand,
            "inventoryVirtual" : inventoryVirtual
        };

    }]);

