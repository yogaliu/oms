/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inventoryConfigController", ["$scope","toolsService","ApiService" ,function($scope,toolsService,ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        var pageId = '#inventoryConfig';
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
                getInventoryConfig();
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
        function getInventoryConfig(){
            var url = "/BasicInformation/SystemConfig/GetInventoryConfig";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    $scope.formData = res.data;
                    if($scope.formData.uploadStores.length == 0){
                        //已选店铺名
                        $scope.storeName = '请选择...';
                        //已选店铺列表
                        $scope.selectStoreList = [];
                    }else{
                        //根据已选店铺id得到店铺名和selectStoreList
                        $scope.selectStoreList = [];
                        $.each($scope.formData.uploadStores,function (index, obj) {
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
            var uploadStores = [];
            $.each($scope.selectStoreList,function (index, obj) {
                uploadStores.push(obj.id);
            });
            var url = "/BasicInformation/SystemConfig/SaveInventoryConfig";
            var param = $.extend({
                body: JSON.stringify({
                    "WarningQuantity": 3, //预警数量
                    "EnableOnPassage": $scope.formData.enableOnPassage, //启用在途
                    "CalcCanSellWithOnPassage": true, //调拨可销计算在途
                    "UploadLessQuantity": $scope.formData.uploadLessQuantity, //库存小于此值上传到固定店铺
                    "UploadStores": uploadStores,
                    "UploadRounding": $scope.formData.uploadRounding, //库存上传四舍五入
                    "HistoryUrl": $scope.formData.historyUrl, //历史库存地址
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    getInventoryConfig();
                }
            });
        };

    }]);