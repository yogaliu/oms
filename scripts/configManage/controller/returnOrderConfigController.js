/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("returnOrderConfigController", ["$scope","toolsService","ApiService" ,function($scope,toolsService,ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        function init(){
            getReturnOrderConfig();
        }
        init();
        /**
         * 获取配置
         */
        function getReturnOrderConfig(){
            var url = "/BasicInformation/SystemConfig/GetReturnOrderConfig";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    $scope.formData = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },res.data);
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
            var url = "/BasicInformation/SystemConfig/SaveReturnOrderConfig";
            var param = $.extend({
                body: JSON.stringify($scope.formData)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    getReturnOrderConfig();
                }
            });
        };

    }]);