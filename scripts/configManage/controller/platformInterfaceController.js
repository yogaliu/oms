/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("platformInterfaceController", ["$scope","$rootScope","platformInterfaceService","toolsService","ApiService" ,
        function($scope,$rootScope,platformInterfaceService,toolsService,ApiService) {
            var pageId = "#platformInterface";
            var currentService = platformInterfaceService;
            function init(){
                //表格配置
                $scope.theadList = [
                    {name: "接口名称", tag: 'name'},
                    {name: "平台类型", tag: 'platformtypename'},
                    {name: "AppKey", tag: 'appkey'},
                    {name: "AppSecret", tag: 'appsecret'},
                    {name: "AccessToken", tag: 'accesstoken'},
                    {name: "AccessToken过期时间", tag: 'accesstokenexpire'},
                    {name: "RefreshToken", tag: 'refreshtoken'},
                    {name: "RefreshToken过期时间", tag: 'refreshtokenexpire'},
                    {name: "创建时间", tag: 'createdate'},
                    {name: "服务地址", tag: 'url'},
                    {name: "回调地址", tag: 'redirecturl'}
                ];
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allPlatformType)){
                        currentService.getPlatformType(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    //请求页面数据
                    currentService.query($scope);
                });
                //当前编辑项
                $scope.activeItem = {};
            }
            init();
            /**
             * 复选框改变单条数据的isdatacheck属性
             */
            $scope.selectItem = function (i) {
                $scope.tableList[i].isdatacheck = !$scope.tableList[i].isdatacheck;
                $scope.isalldatacheck = true;
                $.each($scope.tableList,function (index, obj) {
                    if(!obj.isdatacheck){
                        $scope.isalldatacheck = false;
                    }
                })
            };
            /**
             * 复选框改变所有数据的isdatacheck属性
             */
            $scope.selectAll = function () {
                if($scope.isalldatacheck){
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = false;
                        $scope.isalldatacheck = false;
                    })
                }else{
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = true;
                        $scope.isalldatacheck = true;
                    })
                }
            };
            /**
             * 刷新
             */
            $scope.fresh = function () {
                currentService.query($scope);
            };
            /**
             * 新增 跳转页面
             */
            $scope.newItem = function () {
                $rootScope.params = {
                    'type' : 'platform',
                    'oprate' : 'creat'
                };
                $scope.addTab('平台接口：新增平台接口','../template/configManage/newPlatformInterface.html');
            };
            /**
             * 修改 跳转页面
             */
            $scope.edit = function (i) {
                $rootScope.params = {
                    'type' : 'platform',
                    'oprate' : 'edit',
                    'obj' : $scope.tableList[i]
                };
                $scope.addTab('平台接口：修改平台接口','../template/configManage/newPlatformInterface.html');
            };
            /**
             * 删除
             */
            $scope.delete = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                toolsService.alertConfirm({
                    "msg":"数据删除后不可恢复，是否继续删除？",
                    okBtn : function(index, layero){
                        currentService.deleteItem($scope,'single');
                        layer.close(index);
                    }
                });
            };
            /**
             * 批量删除
             */
            $scope.batchDelete = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    toolsService.alertConfirm({
                        "msg":"数据删除后不可恢复，是否继续删除？",
                        okBtn : function(index, layero){
                            currentService.deleteItem($scope,'batch');
                            layer.close(index);
                        }
                    });
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            /**
             * 刷新令牌
             */
            $scope.refreshToken = function (i) {
                $scope.activeItem = $.extend({
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },$scope.tableList[i]);
                currentService.refreshToken($scope);
            };
            /**
             * 重新授权 初始化弹框
             */
            $scope.isCanReauthorization = function (i) {
                $scope.activeItem = $.extend({
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },$scope.tableList[i]);
                currentService.isCanReauthorization($scope);
            };
            /**
             * 检测code
             */
            $scope.getCode = function () {
                var parameterString = $scope.activeItem.requesturl;
                var parameterList = parameterString.split('&');
                parameterList[0] = parameterList[0].substring(parameterList[0].indexOf('?')+1,parameterList[0].length);
                var temp_key = null;
                var result_obj = {};
                for(var i = 0 ; i < parameterList.length ; i++){
                    temp_key = parameterList[i].substring(0,parameterList[i].indexOf('='));
                    result_obj[temp_key] = parameterList[i].substring(parameterList[i].indexOf('=')+1,parameterList[i].length);
                }
                $scope.activeItem.reauthorizationCode = result_obj.code;
            };
            /**
             * 重新授权
             */
            $scope.saveReauthorization = function () {
                currentService.saveReauthorization($scope);
            };

    }]);