/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("orderConfigController", ["$scope","$rootScope","ApiService","toolsService",
        function($scope,$rootScope,ApiService,toolsService) {
            var pageId = '#orderConfig';
            //获取身份验证
            var paramObj = ApiService.getBasicParamobj();
            function init(){
                $scope.StoreList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.wlbStoreId = obj.id;
                    }
                };
                //获取店铺选项
                getStore();
            }
            init();
            /**
             * 获取订单配置
             */
            function getOrderConfig(){
                var url = "/BasicInformation/SystemConfig/GetSalesOrderConfig";
                var promise = ApiService.post(url,paramObj);
                promise.then(function(res){
                    if(res.success){
                        $scope.formData = $.extend({
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        },res.data);
                        if($scope.formData.wlbStoreId){
                            $scope.StoreList.objName = {id:$scope.formData.wlbStoreId};
                        }
                    }
                });
            }
            /**
             * 获取店铺列表
             */
            function getStore(){
                var url = "/BasicInformation/Store/Get";
                var promise = ApiService.post(url,paramObj);
                promise.then(function(res){
                    if(res.success){
                        $scope.StoreList.info = res.data;
                        getOrderConfig();
                    }
                });
            }
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
                var url = "/BasicInformation/SystemConfig/SaveSalesOrderConfig";
                var param = $.extend({
                    body: JSON.stringify($scope.formData)
                }, paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function(res){
                    if(res.success){
                        toolsService.alertMsg({content : '操作成功',time : 1000});
                        getOrderConfig();
                    }
                });
            };

    }]);