/**
 * Created by lc on 2017/4/24.
 * 功能：库存上传页面请求
 */
/**
 * 定义systemInventoryService服务
 * 功能：系统库存页面请求
 * */
angular.module("klwkOmsApp")
    .factory('addLoanInService', ["ApiService","APP_COLORS","WAP_CONFIG","APP_MENU","APP_DATA","toolsService",function(ApiService,APP_COLORS,WAP_CONFIG,APP_MENU,APP_DATA,toolsService){
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
        var queryWarehouseAll = function (scope){
            var url = "/BasicInformation/Warehouse/Get";
            var paramObj = configParam.getParamObj();
            var promise = ApiService.postLoad(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.storeList = res.data;
                    APP_DATA.storeListALl=res.data;
                };
            });
        };


        /**
         * 保存新增还入单
         */
        var loanInSave = function (scope){
            var url = "/Inventory/LoanIn/Save";
            var paramObj = configParam.getParamObj();
            var data=[];
            $.each(scope.loanList,function (index, obj) {
                data.push(
                    {
                        "DetailId" : obj.detailid?obj.detailid:0,
                        "LoanInId" : obj.loaninid?obj.loaninid:0,   //借出单据ID
                        "SkuId" : obj.skuid,
                        "ReturnQuantity" : obj.returnquantity, //已归还数量
                        "InQuantity": obj.inquantity,
                        "Sku":{
                            "SkuId" : obj.sku.skuid,
                            "ProductId" : obj.sku.productid,
                            "ProductCode" : obj.sku.productcode,
                            "ProductName" : obj.sku.productname,
                            "Code" : obj.sku.code,
                            "Description" : obj.description,
                            "Color" : obj.sku.color,
                            "Size" : obj.sku.size,
                            "FirstPrice" : obj.sku.firstprice?obj.sku.firstprice:0,
                            "RetailPrice" : obj.sku.retailprice?obj.sku.retailprice:0,
                            "PurchasePrice" : obj.sku.purchaseprice?obj.purchaseprice:0,
                            "WholeSalePrice" : obj.sku.wholesaleprice?obj.sku.wholesaleprice:0,
                            "CostPrice" : obj.sku.costprice?obj.sku.costprice:0,
                            "PlatformPrice": obj.sku.platformprice?obj.sku.platformprice:0,
                            "Weight" : obj.sku.weight,
                            "Length" : obj.sku.length,
                            "Width" : obj.sku.width,
                            "Height" : obj.sku.height,
                            "Volume" : obj.sku.volume,
                            "Quantity" : obj.sku.quantity ,
                            "IsGift" : obj.sku.isgift,
                            "IsSplit" : obj.sku.issplit,
                            "CategoryId" :obj.sku.categoryid,
                            "IsCombined" : obj.sku.iscombined,
                            "Status" : obj.sku.status,
                            "CreateDate" : obj.sku.createdate,
                            "IsComb" : obj.sku.iscombined,
                            "ProductType": obj.sku.productType,
                            "Deleted": obj.sku.deleted,
                            "IsNew": obj.sku.new,
                            "IsUpdate" : obj.sku.update
                        },
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    }
                );
            });
            var param = $.extend({
                body: JSON.stringify(
                    {
                        "Id":scope.productFormDate.id,
                        "code":scope.productFormDate.code,
                        "LoanUser":scope.productFormDate.loanuser,
                        "WarehouseId":scope.productFormDate.warehouseid,
                        "CreateDate":scope.productFormDate.createdate,
                        "Note":scope.productFormDate.note,
                        "Status":scope.productFormDate.status?scope.productFormDate.status:0,
                        "Details":data,
                        "Deleted":false,"IsNew":false,"IsUpdate":false
                    }
                )
            }, paramObj);


            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.loanList = [];
                    toolsService.alertMsg({content : "保存成功!",time : 1000});
                    scope.addTab('还入单','../template/inventoryManage/loanIn.html');
                }
            });
        };


        /**
         * 查询所有用户
         */
        var queryUsers = function (scope,_callBack){
            var url = "/BasicInformation/Users/Query";
            var paramObj = configParam.getParamObj();
            var param = $.extend({
                body: JSON.stringify(
                    {
                        "PageIndex":scope.paginationProductConf.currentPage,
                        "PageSize":scope.paginationProductConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"IsDisabled",
                                "Name":"IsDisabled",
                                "Value":false,
                                "Children":[]
                            },
                            {   /*登录名条件搜索*/
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"LoginName",
                                "Name":"LoginName",
                                "Value":scope.formData.loginName,
                                "Children":[]
                            },
                            {   /*用户名条件搜索*/
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"UserName",
                                "Name":"UserName",
                                "Value":scope.formData.userName,
                                "Children":[]
                            },
                            {   /*部门条件搜索*/
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"DepartmentName",
                                "Name":"DepartmentName",
                                "Value":scope.formData.departmentName,
                                "Children":[]
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    }
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.userList =res.data;
                    scope.paginationProductConf.totalItems = res.total;
                    if( _callBack){
                        _callBack();
                    }
                };

            });
        };


        /**
         * 查询规格信息
         */
        var queryGoods = function (scope,_callBack){
            var url = "/Product/ProductSku/Query";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify({
                "PageIndex":scope.paginationSkuConf.currentPage,
                "PageSize":scope.paginationSkuConf.itemsPerPage,
                "SeletedCount": "",
                "Data": [
                    {
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Description",
                        "Name": "prodes",
                        "Value": scope.productItem.productName,
                        "Children": []
                    },
                    {
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "pro.Code",
                        "Name": "procode",
                        "Value": scope.productItem.productCode,
                        "Children": []
                    },
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
                        "OperateType": 6,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "sku.Code",
                        "Name": "skucode",
                        "Value": scope.productItem.code,
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
            });
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    scope.tableSkuList = res.data;
                    //总条数
                    scope.paginationSkuConf.totalItems = res.total;
                    // 默认第一条仓库数量
                    getProductInventory(scope, res.data[0]);

                    scope.initFunc = function () {
                        $('#getProductSpecTable').DataTable({
                            "paging": false,
                            "info": false,
                            "searching": false,
                            "scrollY": "500px",
                            "scrollX": true,
                            "scrollCollapse": true
                        });
                    };
                    if( _callBack){
                        _callBack();
                    }
                }
            });
        };

        /**
         * 查看商品库存
         * @constructor
         */
        var getProductInventory = function (scope, obj) {
            var url = "/Inventory/InventoryVirtual/GetOccupation";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Code",
                "Name": "Code",
                "Name": "Code",
                "Value": obj.code,
                "Children": []
            }]);
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data,function (index, obj) {
                        $.each(APP_DATA.storeListALl,function (index, storeObj) {
                            if(obj.warehouseid == storeObj.id){
                                obj.warehouseName = storeObj.name;
                            }
                        })
                    })
                    scope.inventoryNum = res.data;
                }
            });
        };


        return {
            "queryWarehouseAll" : queryWarehouseAll,
            "queryUsers" : queryUsers,
            "queryGoods" : queryGoods,
            "getProductInventory" : getProductInventory,
            "loanInSave" : loanInSave
        };

    }]);

/**
 * Created by dell on 2017/5/4.
 */
