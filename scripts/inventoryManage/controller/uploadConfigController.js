/**
 * Created by xs on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("uploadConfigController", ["$scope","$rootScope","uploadConfigService" ,
        function($scope,$rootScope,uploadConfigService) {


            //进入页面需要执行的方法
            function init(){

                // 新增上传配置的对象
                $scope.addConfigObj = {
                    // 表示自动上传
                    IsUpload : false,
                    // 表示手动上传
                    IsManualUpload : false
                };

                // 该对象用来缓存查询数据的查询条件
                $scope.conditionObj = {};

                // 判断是否缓存了所有仓库的信息
                if($.isEmptyObject(uploadConfigService.allWarehouseInfo)){
                    uploadConfigService.getAllWarehouseInfo($scope);
                }

                $scope.selectConfig = {
                    // 该对象用于存储用户的值
                    values : {},
                    // 新增配置店铺  选择店铺
                    storeList : {
                        info:[],
                        onChange : function(obj,index){
                            $scope.addConfigObj["storeId"] = obj.id;
                        }
                    },
                    // 新增配置店铺  选择品牌
                    "brandList" : {
                        info : [],
                        onChange:function(brandList,index){
                            var brandListIds = "";
                            var brandListNames = "";
                            for(var i=0; i<brandList.length; i++){
                                var currentObj = brandList[i];
                                brandListIds = brandListIds + currentObj["id"] + ",";
                                brandListNames = brandListNames + currentObj["name"] + ",";
                            }
                            $scope.addConfigObj["brandListIds"] = brandListIds.substr(0,brandListIds.length - 1);
                            $scope.addConfigObj["brandListNames"] = brandListNames.substr(0,brandListNames.length - 1)
                        }
                    },
                    // 新增配置仓库  选择仓库
                    "warehouseList" : {
                        info : [],
                        onChange:function(obj,index){
                            $scope.selectConfig.values["warehouseList"] = obj;
                        }
                    }
                };

                // 获取店铺信息
                uploadConfigService.getAllStoreInfo($scope);
                // 获取所有的品牌信息
                uploadConfigService.getAllbrandList($scope);

                // 默认选中的店铺对象
                $scope.selectedStoreObj = {};
            }
            init();


            //刷新列表
            $scope.fresh = function () {
                uploadConfigService.getUploadConfig($scope);
            };

            // 搜索内容
            $scope.search = function(){
                uploadConfigService.search($scope);
            };

            /**
             * 根据店铺，显示仓库信息
             * @param selectedStoreObj  选中店铺的对象
             */
            $scope.showRepertory = function(selectedStoreObj){
                uploadConfigService.showRepertory($scope,selectedStoreObj.storeid);

                $scope.selectedStoreObj = selectedStoreObj;
            };

            //列操作菜单toggle
            $scope.oprateTr = function (e) {
                $(e.target).closest('.tr-oprate').find('ul').toggle();
            };

            // 获取第一个店铺的仓库信息
            $scope.getFirstStoreWarehouse = function(){
                $(".storeListTbody tr").first().click();
            };


            // 用时间戳作为 添加配置信息面板的唯一标识
            $scope.AddConfigModalId = new Date().getTime();
            // 显示添加配置面板
            $scope.showAddConfigModal = function(type,itemObj){
                $("#" + $scope.AddConfigModalId).modal("show");
                // 添加上传配置
                if(type == "add"){
                    // 重置下拉
                    $scope.addConfigObj = {};
                    $scope.selectConfig.brandList.init();
                    $scope.selectConfig.storeList.init();
                    $scope.addConfigObj.IsUpload = false;
                    $scope.addConfigObj.IsManualUpload = false;
                }
                // 修改上传配置
                else if(type == "update"){
                    // 设置店铺选中的内容
                    $scope.selectConfig.storeList.setValue({"id":itemObj.storeid});
                    var brandIds = itemObj.brandid.split(",");
                    var brandsArray = [];
                    for(var i = 0; i < brandIds.length; i++){
                        brandsArray.push({
                           id: brandIds[i]
                        });
                    }
                    //设置下拉多选的值
                    $scope.selectConfig.brandList.setValue(brandsArray);

                    $scope.addConfigObj["storeId"] = itemObj.storeid;
                    $scope.addConfigObj["brandListIds"] = itemObj.brandid;
                    $scope.addConfigObj["brandListNames"] = itemObj.brandname;
                    $scope.addConfigObj.IsUpload = itemObj["isupload"];
                    $scope.addConfigObj.IsManualUpload =  itemObj["ismanualupload"];
                }
            };
            // 隐藏添加配置面板
            $scope.hideAddConfigModal = function(){
                $("#" + $scope.AddConfigModalId).modal("hide");
            };


            // 用时间戳作为 店铺对应的添加仓库比例的配置面板
            $scope.AddWarehouseConfigModalId = new Date().getTime() + "Warehouse";
            // 显示 店铺对应的添加仓库比例的配置面板
            $scope.showWarehouseAddConfigModal = function(){
                $("#" + $scope.AddWarehouseConfigModalId).modal("show");
            };
            // 隐藏 店铺对应的添加仓库比例的配置面板
            $scope.hideWarehouseAddConfigModal = function(){
                $("#" + $scope.AddWarehouseConfigModalId).modal("hide");
            };


            // 保存 新增上传配置信息
            $scope.saveAddUploadConfig = function(){
                if($scope.addConfigObj["storeId"] === undefined){
                    alert("请选择店铺");
                    return false;
                }
                if($scope.addConfigObj["brandListIds"] === undefined){
                    alert("请选择品牌");
                    return false;
                }
                uploadConfigService.saveAddUploadConfig($scope);
                $scope.hideAddConfigModal();
            };

            // 修改 新增上传配置信息
            $scope.updateUploadConfigItem = function(itemObj){
                // 显示修改控制面板
                $("#" + $scope.AddConfigModalId).modal("show");
                // 设置修改面板的对象的内容

            };

            // 删除 新增上传配置信息
            $scope.delUploadConfigItem = function(itemObj){
                uploadConfigService.delUploadConfigItem(itemObj,$scope);
            };

            // 新增仓库比例
            $scope.saveAddWarehouseScale = function(){
                uploadConfigService.saveAddWarehouseScale($scope);
            };

    }]);