/**
 * Created by xs on 2017/4/1.
 */
angular.module("klwkOmsApp")
    .factory('uploadConfigService', ["ApiService","WAP_CONFIG","APP_COLORS",function(ApiService,WAP_CONFIG,APP_COLORS){

        /**
         * 获取所有的店铺信息
         */
        function getAllStoreInfo(__scope__){
            // 判断是否已经缓存了数据，如果没有缓存，发送ajax请求
            if(currentService.allStoreInfoArray == null){
                var url = "/BasicInformation/Store/Get";
                // 获取默认传递参数对象
                var paramObj = ApiService.getBasicParamobj();
                paramObj["body"] = JSON.stringify([
                    {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }
                ]);

                var promise = ApiService.post(url,paramObj);
                promise.then(function(res){
                    if(res.success){
                        currentService.allStoreInfo = klwTool.arrayToJson(res.data,"id");
                        // 缓存数据店铺信息
                        currentService.allStoreInfoArray = res.data;
                        if(__scope__ !== undefined){
                            __scope__.selectConfig.storeList.info = currentService.allStoreInfoArray;
                        }

                        // 搜索内容
                        currentService.search(__scope__);
                    }
                });
            }
            // 如果缓存了数据，则直接那数据显示
            else{
                __scope__.selectConfig.storeList.info = currentService.allStoreInfoArray;
                // 搜索内容
                currentService.search(__scope__);
            }
        }

        /**
         * 获取品牌信息
         */
        function getAllbrandList(__scope__){
            // 判断是否已经缓存了数据，如果没有缓存，发送ajax请求
            if(currentService.allBrandInfoArray == null){
                var url = "/BasicInformation/GeneralClassiFication/Get";
                // 获取默认传递参数对象
                var paramObj = ApiService.getBasicParamobj();
                paramObj["body"] = JSON.stringify([
                    {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    },
                    {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ClassiFicationType",
                        "Name": "ClassiFicationType",
                        "Value": 2,
                        "Children": []
                    }
                ]);
                var promise = ApiService.post(url,paramObj);
                promise.then(function(res){
                    if(res.success){
                        // 缓存数据店铺信息
                        currentService.allBrandInfoArray = res.data;
                        __scope__.selectConfig.brandList.info = currentService.allBrandInfoArray;
                    }
                });
            }
            // 如果缓存了数据，则直接那数据显示
            else{
                __scope__.selectConfig.brandList.info = currentService.allBrandInfoArray;
            }
        }

        /**
         * 获取所有的仓库信息
         */
        function getAllWarehouseInfo(__scope__){
            var url = "/BasicInformation/Warehouse/Get";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            var promise = ApiService.postCache(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    __scope__.selectConfig.warehouseList.info = res.data;
                    currentService.allWarehouseInfo = klwTool.arrayToJson(res.data,"id");
                    // console.log(klwTool.obj2str(currentService.allStoreInfo));
                }
            });
        }

        /**
         * 根据条件搜索上传配置信息
         * @param __scope__
         */
        function search(__scope__){
            var url = "/Inventory/UploadConfig/Get";
            var promise = ApiService.post(url);
            promise.then(function(res){
                if(res.success){
                    var originArray = res.data;
                    var length = originArray.length;
                    // 关联查询的数据，让 店铺的IP  于店铺的对象关联起来
                    for(var i = 0; i < length; i++){
                        var currentObj = originArray[i];
                        var key = currentObj["storeid"].toLowerCase();
                        currentObj["storeObject"] = currentService.allStoreInfo[key];
                    }
                    __scope__.uploadConfigList = originArray;
                }
            });
        }

        /**
         * 根据 店铺的ID ，获取相关仓库的信息
         * @param __scope__
         * @param storeId
         */
        function showRepertory(__scope__,storeId){
            var url = "/Inventory/UploadConfig/Warehouse/Get";

            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            // 需要传递的参数
            paramObj["body"] = [
                {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": storeId,
                    "Children": []
                }
            ];
            // 将参数对象序列化
            paramObj["body"] = JSON.stringify(paramObj["body"]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    // console.log(klwTool.obj2str(res));
                    // console.dir(res);
                    var originArray = res.data;
                    var length = originArray.length;
                    // 关联查询的数据，让 店铺的IP  于店铺的对象关联起来
                    for(var i = 0; i < length; i++){
                        var currentObj = originArray[i];
                        var key = currentObj["warehouseid"].toLowerCase();
                        currentObj["warehouseObject"] = currentService.allWarehouseInfo[key];
                    }
                    //console.log(klwTool.obj2str(originArray));
                    __scope__.warehouseList = originArray;

                }
            });
        }


        /**
         * 保存添加的上传配置
         * @param __scope__
         * @param storeId
         */
        function saveAddUploadConfig(__scope__){
            var url = "/Inventory/UploadConfig/Save";

            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();

            paramObj["body"]  =  JSON.stringify({
                "StoreId": __scope__.addConfigObj["storeId"],
                "BrandId":  __scope__.addConfigObj["brandListIds"],
                "BrandName": __scope__.addConfigObj["brandListNames"],
                "IsUpload": __scope__.addConfigObj.IsUpload,
                "IsManualUpload": __scope__.addConfigObj.IsManualUpload,
                "CreateDate": "0001-01-01 00:00:00",
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    alert("添加成功");
                    __scope__.search();
                }
            });
        }

        /**
         * 删除上传配置
         * @param __scope__
         * @param storeId
         */
        function delUploadConfigItem(itemObj,__scope__){
            var url = "/Inventory/UploadConfig/Delete";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"]  =  JSON.stringify([itemObj.storeid]);
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    alert("删除成功");
                    __scope__.search();
                }
            });
        }

        /**
         * 新增仓库比例
         * @param __scope__
         * @param storeId
         */
        function saveAddWarehouseScale(__scope__){
            var url = "/Inventory/UploadConfig/Warehouse/Save";
            // 获取默认传递参数对象
            var paramObj = ApiService.getBasicParamobj();
            paramObj["body"]  =  JSON.stringify({
                "Id": "00000000-0000-0000-0000-000000000000",
                "StoreId": "c3555682-6d8b-4b58-a9d7-2056c0b8d88e",
                "WarehouseId": "b908c36a-afdd-4845-b061-ce794bc31c60",
                "WarehouseType": 2,
                "Scale": 10,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function(res){
                if(res.success){
                    alert("新增仓库比例成功");
                    __scope__.search();
                }
            });
        }

        var currentService = {
            "getUploadConfig" : null,
            // 获取所有的店铺信息
            "getAllStoreInfo" : null,
            // 获取所有的仓库信息
            "getAllWarehouseInfo" : null,
            // 根据条件搜索店铺信息信息
            "search" : null,
            // 根据 店铺的ID ，获取相关仓库的信息
            "showRepertory" : null,
            // 该字段用来缓存所有的店铺
            "allStoreInfo" : null,
            "allStoreInfoArray" : null,
            // 品牌信息（数组的形式）
            "allBrandInfoArray" : null,
            // 该字段用来缓存所有的仓库信息
            "allWarehouseInfo" : {}
        };

        currentService["getAllStoreInfo"] = getAllStoreInfo;
        currentService["showRepertory"] = showRepertory;
        currentService["search"] = search;
        currentService["getAllWarehouseInfo"] = getAllWarehouseInfo;
        currentService["getAllbrandList"] = getAllbrandList;
        currentService["saveAddUploadConfig"] = saveAddUploadConfig;
        currentService["delUploadConfigItem"] = delUploadConfigItem;
        currentService["saveAddWarehouseScale"] = saveAddWarehouseScale;

        return currentService;

    }]);