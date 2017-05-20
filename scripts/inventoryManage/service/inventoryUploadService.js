/**
 * Created by lc on 2017/4/24.
 * 功能：库存上传页面请求
 */
/**
 * 定义systemInventoryService服务
 * 功能：系统库存页面请求
 * */
angular.module("klwkOmsApp")
    .factory('inventoryUploadService', ["ApiService","APP_COLORS","WAP_CONFIG","APP_MENU",function(ApiService,APP_COLORS,WAP_CONFIG,APP_MENU){
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
         * 查询配置店铺
         */
        var queryStore = function (scope){
            var url = "/Inventory/UploadConfig/GetStore";
            var paramObj = configParam.getParamObj();
            var promise = ApiService.postLoad(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.pullInfo = {
                        isshow:false,
                        info:res.data,
                        onChange: function(obj,index){	//点击之后的回调
                            scope.formData.count = 1;  //激活上传清空按钮
                            scope.StoreId = obj.id;
                        }
                    }
                };
            });
        };

        /**
         * 查询规格信息
         */
        var queryGoods = function (scope,PageIndex,PageSize,_callBack){
            var url = "/Product/ProductSku/Query";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
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
         * 查询商品信息
         */
        var queryproduct = function (scope,PageIndex,PageSize,_callBack){
            var url = "/Product/Product/Query";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify({
                "PageIndex":PageIndex,
                "PageSize":PageSize,
                "SeletedCount":0,
                "Data":[
                    {
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Status",
                        "Name":"prostatus",
                        "Value":1,
                        "Children":[]},
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
                ],
                "Deleted":false,
                "IsNew":false,
                "IsUpdate":false
            });
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {

                    $.each( res.data,function (index, obj) {
                        /*过滤商品状态*/
                        if(obj.status !== undefined){
                            obj.status = APP_MENU.productStatus[obj.status];
                        }

                        /*过滤商品类型*/
                        if(obj.producttype !== undefined){
                            obj.producttype = APP_MENU.productType[obj.producttype];
                        }

                        /*过滤是否有配件*/
                        if(obj.spareparts !== undefined){
                            obj.spareparts = APP_MENU.spareparts[obj.spareparts];
                        }

                        scope.tableSkuList = res.data;
                    })
                    //总条数
                    scope.paginationGroupConf.totalItems = res.total;
                    scope.initFunc = function () {
                        $('#getProductTable').DataTable({
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
         * 查询组合套装信息
         */
        var queryGroup = function (scope,PageIndex,PageSize,_callBack){
            var url = "/Product/CombinedProduct/Query";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify(
                {
                    "PageIndex":PageIndex,
                    "PageSize":PageSize,
                    "Timespan":"00:00:00.761",
                    "SeletedCount":0,
                    "Data":[
                        {
                            "OperateType":8,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"SkuCode",
                            "Name":"SkuCode",
                            "Value":scope.productItem.code,
                            "Children":[]
                        },
                        {
                            "OperateType":8,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Description",
                            "Name":"Description",
                            "Value":scope.productItem.productName,
                            "Children":[]
                        },
                        {
                            "OperateType":8,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Code",
                            "Name":"Code",
                            "Value":scope.productItem.productCode,
                            "Children":[]
                        },
                        {
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Status",
                            "Name":"Status",
                            "Value":1,
                            "Children":[]
                        }
                    ],
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                }
            );
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data,function (index, obj) {
                        /*过滤套装是否可拆分*/
                        if(obj.issplit !== undefined){
                            if(obj.issplit=='False'){
                                obj.issplit='否'
                            }else{
                                obj.issplit='是'
                            }
                        }
                        /*过滤套装是否为礼盒*/
                        if(obj.isgift !== undefined){
                            if(obj.isgift=='False'){
                                obj.isgift='否'
                            }else{
                                obj.isgift='是'
                            }
                        }
                    })
                    scope.tableSkuList = res.data;

                    //总条数
                    scope.paginationProductConf.totalItems = res.total;
                    scope.initFunc = function () {
                        $('#getGroupTable').DataTable({
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
         * 查看仓库数量
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
                "Value": obj.code,
                "Children": []
            }]);
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    scope.inventoryNum = res.data;
                }
            });
        };

        /**
         * 根据商品sku查询商品规格
         * @constructor
         */
        var getProductSpec = function (scope, obj ,_callBack) {
            var url = "/Product/ProductSku/Get";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify(obj.productid);
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    obj.productSpec = res.data;  //商品规格
                    obj.isShow = false;    //默认不显示规格
                    obj.specNumber = res.data.length;   //规格数量
                    _callBack();
                }
            });
        };

        /**
         * 上传商品
         * @constructor
         */
        var uploadProduct = function (scope, obj ,_callBack) {
            var url = "/Inventory/Upload ";
            var paramObj = configParam.getParamObj();
            paramObj.IsIncrement = scope.ischeck;
            paramObj.StoreId = scope.StoreId;
            paramObj.body = JSON.stringify(obj);
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                alert(res.errorMessage +'我也不知道什么鬼  客户端也不能成功!');
            });
        };

        /**
         * 获取上传结果
         * @constructor
         */
        var getUploadLog= function (scope,PageIndex,PageSize,_callBack) {
            var url = "/Inventory/UploadLog/Get";
            var paramObj = configParam.getParamObj();
            paramObj.body = JSON.stringify(
                {
                    "PageIndex":PageIndex,
                    "PageSize":PageSize,
                    "Timespan":"00:00:00.134",
                    "SeletedCount":0,
                    "Data":[
                        {
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"l.Status",
                            "Name":"Status",
                            "Value":scope.statusIndex,
                            "Children":[]
                        }
                    ],
                    "Deleted":false,
                    "IsNew":false,
                    "IsUpdate":false
                }
            );
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    scope.paginationUploadLogConf.totalItems = res.data.length;
                    $.each(res.data,function (index, obj) {
                        /*过滤套装上传状态*/
                        if(obj.status !== undefined){
                            obj.status = APP_MENU.inventoryUploadStatus[obj.status];
                        }
                    })
                    scope.tableUploadLog = res.data;
                    scope.initFunc = function () {
                        $('#UploadLogTable').DataTable({
                            "paging": false,
                            "info": false,
                            "searching": false,
                            "scrollY": "500px",
                            "scrollX": true,
                            "scrollCollapse": true
                        });
                    };
                    if(scope.statusIndex==1){
                        scope.isFail = false;
                    }else{
                        scope.isFail = true;
                    }

                    if( _callBack){
                        _callBack();
                    }
                }
            });
        }



        /**
         * 失败重传
         * @constructor
         */
        var failUpload = function (scope, obj ,_callBack) {
            var url = "/Inventory/Upload ";
            var paramObj = configParam.getParamObj();
            paramObj.IsIncrement = false;
            paramObj.StoreId = obj.storeid;
            paramObj.body = JSON.stringify(obj);
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                alert(res.errorMessage +'我也不知道什么鬼  客户端也不能成功!');
            });
        };

        return {
            "queryStore" : queryStore,
            "queryGoods" : queryGoods,
            "getProductInventory" : getProductInventory,
            "getProductSpec" : getProductSpec,
            "uploadProduct" : uploadProduct,
            "queryproduct" : queryproduct,
            "queryGroup" : queryGroup,
            "getUploadLog" : getUploadLog,
            "failUpload" : failUpload
        };

    }]);

