/**
 * Created by lc on 2017/4/24.
 * 功能：库存上传页面请求
 */
/**
 * 定义lendListService服务
 * 功能：还褥单页面请求
 * */
angular.module("klwkOmsApp")
    .factory('loanInService', ["ApiService","APP_COLORS","WAP_CONFIG","APP_MENU","APP_DATA","toolsService",function(ApiService,APP_COLORS,WAP_CONFIG,APP_MENU,APP_DATA,toolsService){
        var configParam = {
            getParamObj: function () {
                return {
                    UserId : APP_COLORS.UserId,
                    UserName : APP_COLORS.username,
                    TimeStamp : ApiService.getMd5code().timestamp,
                    sign : ApiService.getMd5code().code,
                    Version : WAP_CONFIG.version,
                    LoginKey : APP_COLORS.LoginKey
                };
            }
        };
        /**
         * 查询仓库所有
         */
        var queryWarehouse = function (scope){
            var url = "/BasicInformation/Warehouse/Get";
            var paramObj = configParam.getParamObj();
            var param = $.extend({
                body: JSON.stringify([
                        {
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"IsDisabled",
                            "Name":"IsDisabled",
                            "Value":false,
                            "Children":[]
                        },
                        {
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"WarehouseType",
                            "Name":"WarehouseType",
                            "Value":1,"Children":[]
                        },
                        {
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"StorageType",
                            "Name":"StorageType",
                            "Value":0,"Children":[]
                        }
                    ]
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.storeList = res.data;
                    APP_DATA.storeList = res.data;
                    queryLoanIn(scope);
                };
            });
        };


        /**
         * 还入单列表数据
         */
        var queryLoanIn = function (scope){
            var url = "/Inventory/LoanIn/Query";
            var paramObj = configParam.getParamObj();
            var data = [];
            if(scope.formData.code){
                data.push(
                    {                         //单号条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Code",
                        "Name":"Code",
                        "Value":scope.formData.code,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.productCode){
                data.push(
                    {                         //商品编码条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"sku.ProductCode",
                        "Name":"ProductCode",
                        "Value":scope.formData.productCode,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.skuCode){
                data.push(
                    {                         //规格编码条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"sku.Code",
                        "Name":"SkuCode",
                        "Value":scope.formData.skuCode,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.loanUser){
                data.push(
                    {                         //借调人条件搜索
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"LoanUser",
                        "Name":"LoanUser",
                        "Value":scope.formData.loanUser,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.warehouseId){
                data.push(
                    {                         //仓库条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"WarehouseId",
                        "Name":"WarehouseId",
                        "Value":scope.formData.warehouseId,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.loanUser){
                data.push(
                    {                         //开始时间条件搜索
                        "OperateType":3,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"l.CreateDate",
                        "Name":"BeginCreateDate",
                        "Value":scope.formData.beginCreateDate,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.beginCreateDate){
                data.push(
                    {                         //开始时间条件搜索
                        "OperateType":4,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"l.CreateDate",
                        "Name":"EndCreateDate",
                        "Value":scope.formData.beginCreateDate,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.status){
                data.push(
                    {                         //状态条件搜索
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Status",
                        "Name":"InStatus",
                        "Value":scope.formData.status,
                        "Children":[]
                    }
                )
            };
            var param = $.extend({
                body: JSON.stringify(
                    {
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:00.236",
                        "SeletedCount":0,
                        "Data":data,
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    }
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    $.each(res.data,function (index, obj) {
                        /*获取仓库名称*/
                        $.each(scope.storeList,function (storeindex, storeObj) {
                            if(storeObj.id.toUpperCase() == obj.warehouseid){
                                obj.warehousename = storeObj.name;
                            };
                        });
                        /*过滤借出单状态*/
                        if(obj.status !== undefined){
                            obj.statusText = APP_MENU.inventoryAlsoInStatus[obj.status];
                        };
                    });
                    if(res.data.length>0){
                        queryLoanDetail(scope,res.data[0],function () {
                            scope.loanList = res.data;
                            scope.paginationConf.totalItems = res.total;
                        });
                    }else{
                        scope.productList =''
                        scope.loanList = '';
                        scope.paginationConf.totalItems = res.total;
                    };
                };
            });
        };


        /**
         * 根据还入单id查询还入单明细
         */
        var queryLoanDetail = function (scope,obj,_callBank){
            var url = "/Inventory/LoanIn/GetDetail";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify(obj.id);
            var promise = ApiService.postLoad(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.productList = res.data;
                    /*保存当前还入单明细*/
                    scope.loanDetailList = res.data;
                };
                if( _callBank){
                    _callBank();
                };
            });
        };



        /**
         * 作废还入单
         */
        var Invalid = function (obj,detail) {
            var url = "/Inventory/LoanIn/Invalid";
            var paramObj = configParam.getParamObj();
            var data=[];
            $.each(detail,function (index,detailObj) {
                data.push({
                    "DetailId": detailObj.detailid,
                    "LoanOutId": detailObj.loanoutid,
                    "SkuId": detailObj.skuid,
                    "ReturnQuantity": detailObj.returnquantity,
                    "InQuantity": detailObj.inquantity?detailObj.inquantity:0,
                    "Sku": {
                        "SkuId": detailObj.sku.skuid,
                        "ProductId": detailObj.sku.productid,
                        "ProductCode": detailObj.sku.productcode,
                        "ProductName": detailObj.sku.productname,
                        "Code": detailObj.sku.code,
                        "Description": detailObj.sku.description,
                        "Color": detailObj.sku.color,
                        "Size": detailObj.sku.size,
                        "Note": detailObj.sku.note,
                        "FirstPrice": detailObj.sku.firstprice,
                        "RetailPrice": detailObj.sku.retailprice,
                        "PurchasePrice": detailObj.sku.purchaseprice,
                        "WholeSalePrice": detailObj.sku.wholeSaleprice,
                        "CostPrice": detailObj.sku.costprice,
                        "PlatformPrice": detailObj.sku.platformprice,
                        "Weight": detailObj.sku.weight,
                        "Length": detailObj.sku.length,
                        "Width": detailObj.sku.width,
                        "Height": detailObj.sku.height,
                        "Volume": detailObj.sku.volume,
                        "Quantity": detailObj.sku.quantity,
                        "IsGift": detailObj.sku.isgift ? detailObj.sku.isgift : false,
                        "IsSplit": detailObj.sku.Issplit ? detailObj.sku.Issplit : false,
                        "CategoryId": detailObj.sku.categoryid ? detailObj.sku.categoryid : false,
                        "IsCombined": detailObj.sku.iscombined ? detailObj.sku.iscombined : false,
                        "Status": detailObj.sku.status,
                        "CreateDate": detailObj.sku.createdate ? detailObj.sku.createdate : false,
                        "IsComb":detailObj.sku.isComb ? detailObj.sku.isComb : false,
                        "ProductType":detailObj.sku.productType,
                        "Deleted": detailObj.sku.deleted ,
                        "IsNew": detailObj.sku.new,
                        "IsUpdate": detailObj.sku.update
                    },
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                });
            });
            var param = $.extend({
                body: JSON.stringify({
                        "Id": obj.id,
                        "Code": obj.code,
                        "LoanUser": obj.loanuser,
                        "WarehouseId": obj.warehouseid,
                        "CreateUser": obj.createuser,
                        "CreateDate": obj.createdate,
                        "AuditUser":  obj.audituser,
                        "AuditDate": obj.auditdate,
                        "Status": obj.status,
                        "Note" : obj.note,
                        "Details": data,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    console.log('单据已作废');
                }else{
                    toolsService.alertMsg({content : res.errorMessage,time : 1000});
                };
            });
        }


        /**
         *
         * 通知仓库
         */
        var audit = function (scope,obj,detail) {
            var url = "/Inventory/LoanIn/Audit";
            var paramObj = configParam.getParamObj();
            var data=[];
            $.each(detail,function (index,detailObj) {
                data.push({
                    "DetailId": detailObj.id,
                    "LoanOutId": detailObj.loanoutid,
                    "SkuId": detailObj.skuid,
                    "ReturnQuantity": detailObj.returnquantity,
                    "InQuantity": detailObj.inquantity?detailObj.inquantity:0,
                    "Sku": {
                        "SkuId": detailObj.sku.skuid,
                        "ProductId": detailObj.sku.productid,
                        "ProductCode": detailObj.sku.productcode,
                        "ProductName": detailObj.sku.productname,
                        "Code": detailObj.sku.code,
                        "Description": detailObj.sku.description,
                        "Color": detailObj.sku.color,
                        "Size": detailObj.sku.size,
                        "Note": detailObj.sku.note,
                        "FirstPrice": detailObj.sku.firstprice,
                        "RetailPrice": detailObj.sku.retailprice,
                        "PurchasePrice": detailObj.sku.purchaseprice,
                        "WholeSalePrice": detailObj.sku.wholeSaleprice,
                        "CostPrice": detailObj.sku.costprice,
                        "PlatformPrice": detailObj.sku.platformprice,
                        "Weight": detailObj.sku.weight,
                        "Length": detailObj.sku.length,
                        "Width": detailObj.sku.width,
                        "Height": detailObj.sku.height,
                        "Volume": detailObj.sku.volume,
                        "Quantity": detailObj.sku.quantity,
                        "IsGift": detailObj.sku.isgift ? detailObj.sku.isgift : false,
                        "IsSplit": detailObj.sku.Issplit ? detailObj.sku.Issplit : false,
                        "CategoryId": detailObj.sku.categoryid ? detailObj.sku.categoryid : false,
                        "IsCombined": detailObj.sku.iscombined ? detailObj.sku.iscombined : false,
                        "Status": detailObj.sku.status,
                        "CreateDate": detailObj.sku.createdate ? detailObj.sku.createdate : false,
                        "IsComb":detailObj.sku.isComb ? detailObj.sku.isComb : false,
                        "ProductType":detailObj.sku.productType,
                        "Deleted": detailObj.sku.deleted ,
                        "IsNew": detailObj.sku.new,
                        "IsUpdate": detailObj.sku.update
                    },
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                });
            });
            var param = $.extend({
                body: JSON.stringify({
                        "Id": obj.id,
                        "Code": obj.code,
                        "LoanUser": obj.loanuser,
                        "WarehouseId": obj.warehouseid,
                        "CreateUser": obj.createuser,
                        "CreateDate": obj.createdate,
                        "Status": obj.status,
                        "Details": data,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    queryLoanIn(scope);
                    toolsService.alertMsg({content : "已通知仓库发货!",time : 1000})
                }else{
                    toolsService.alertMsg({content : res.errorMessage,time : 1000});
                };
            });
        };


        return {
            "queryWarehouse" : queryWarehouse,
            "queryLoanIn" : queryLoanIn,
            "queryLoanDetail" : queryLoanDetail,
            "Invalid" : Invalid,
            "audit" : audit,
        };

    }]);

