/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("productConfigController", ["$scope","toolsService","ApiService" ,function($scope,toolsService,ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        var pageId = '#productConfig';
        function init(){
            //全部店铺
            $scope.storeList = {};
            var promise = ApiService.listenAll(function(deffer){
                if($.isEmptyObject($scope.storeList)){
                    getAllStore(deffer);
                }else{
                    deffer.resolve();
                }
            });
            promise.then(function(){
                getProductConfig();
            });
        }
        init();
        /**
         * 获取所有店铺
         */
        function getAllStore(deffer) {
            var url = "/BasicInformation/Store/Get";
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
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    $scope.storeList = res.data;
                    $scope.isalldatacheck = false;
                    $.each($scope.storeList,function (index, obj) {
                        obj.isdatacheck = false;
                    });
                    if(deffer !== undefined){
                        deffer.resolve();
                    }
                }else{
                    if(deffer !== undefined){
                        deffer.reject();
                    }
                }
            });
        }
        /**
         * 获取配置
         */
        function getProductConfig(){
            var url = "/BasicInformation/SystemConfig/GetProductConfig";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    $scope.formData = res.data;
                    if($scope.formData.mainPictureStoreIds.length == 0){
                        //已选店铺名
                        $scope.storeName = '请选择...';
                        //已选店铺列表
                        $scope.selectStoreList = [];
                    }else{
                        //根据已选店铺id得到店铺名和selectStoreList
                        $scope.selectStoreList = [];
                        $.each($scope.formData.mainPictureStoreIds,function (index, obj) {
                            $.each($scope.storeList,function (i,o) {
                                if(o.id == obj){
                                    o.isdatacheck = true;
                                    $scope.selectStoreList.push(o);
                                    return false;
                                }
                            })
                        });
                        $scope.storeName = "";
                        $.each($scope.selectStoreList,function (index, obj) {
                            $scope.storeName = $scope.storeName + obj.name + ';';
                        });
                        if($scope.selectStoreList.length == $scope.storeList.length){
                            $scope.isalldatacheck = true;
                        }
                    }
                }
            });
        }
        /**
         * 显示店铺多选弹框
         */
        $scope.showShopModal = function () {
            $(pageId + " #shopModal").modal('show');
        };
        /**
         * 选择单个店铺
         */
        $scope.selectOneStore = function (i) {
            $scope.storeList[i].isdatacheck = !$scope.storeList[i].isdatacheck;
            $scope.selectStoreList = [];
            $.each($scope.storeList,function (index, obj) {
                if(obj.isdatacheck){
                    $scope.selectStoreList.push(obj);
                }
            });
            if($scope.selectStoreList.length < $scope.storeList.length){
                $scope.isalldatacheck = false;
            }else{
                $scope.isalldatacheck = true;
            }
        };
        /**
         * 选择所有店铺
         */
        $scope.selectAllStore = function () {
            if($scope.isalldatacheck){
                $scope.isalldatacheck = false;
                $scope.selectStoreList = [];
                $.each($scope.storeList,function (index, obj) {
                    obj.isdatacheck = false;
                })
            }else{
                $scope.isalldatacheck = true;
                $scope.selectStoreList = [];
                $.each($scope.storeList,function (index, obj) {
                    obj.isdatacheck = true;
                    $scope.selectStoreList.push(obj);
                })
            }
        };
        /**
         * 删除单个店铺
         */
        $scope.deleteOneStore = function (i) {
            var id = $scope.selectStoreList[i].id;
            $.each($scope.storeList,function (index, obj) {
                if(obj.id == id){
                    obj.isdatacheck = false;
                }
            });
            $scope.selectStoreList = [];
            $.each($scope.storeList,function (index, obj) {
                if(obj.isdatacheck){
                    $scope.selectStoreList.push(obj);
                }
            });
        };
        /**
         * 选择店铺 确认
         */
        $scope.showStores = function () {
            if($scope.selectStoreList.length > 0){
                $scope.storeName = "";
                $.each($scope.selectStoreList,function (index, obj) {
                    $scope.storeName = $scope.storeName + obj.name + ';';
                })
            }else{
                $scope.storeName = "请选择...";
            }
            $(pageId + " #shopModal").modal('hide');
        };
        /**
         * 复选项公用方法
         */
        $scope.checkItem = function (name) {
            $scope.formData[name] = !$scope.formData[name];
        };
        /**
         * 保存
         */
        $scope.save = function () {
            var mainPictureStoreIds = [];
            $.each($scope.selectStoreList,function (index, obj) {
                mainPictureStoreIds.push(obj.id);
            });
            var url = "/BasicInformation/SystemConfig/SaveProductConfig";
            var param = $.extend({
                body: JSON.stringify({
                    "SkuSeparator": $scope.formData.skuSeparator, //规格编码分隔符
                    "EnabledPriceModify": true, //启用变价单
                    "IsSendWms": $scope.formData.isSendWms, //是否转入WMS
                    "EnabledSkuPrice": $scope.formData.enabledSkuPrice, //启用SKU价格
                    "IsUseSCMTransit": $scope.formData.isUseSCMTransit, //启用SCM在途
                    "MainPictureStoreIds": mainPictureStoreIds, //主图店铺
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    getProductConfig();
                }
            });
        };

    }]);