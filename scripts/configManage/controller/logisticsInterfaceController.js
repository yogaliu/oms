/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("logisticsInterfaceController", ["$scope","$rootScope","logisticsInterfaceService","toolsService" ,
        function($scope,$rootScope,logisticsInterfaceService,toolsService) {
            var pageId = "#logisticsInterface";
            var currentService = logisticsInterfaceService;
            function init(){
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "菜鸟", tag: 'iscainiao'},
                    {name: "推送库存异动", tag: 'ispushstockchange'},
                    {name: "接口名称", tag: 'name'},
                    {name: "服务商编码", tag: 'code'},
                    {name: "AppKey", tag: 'appkey'},
                    {name: "AppSecret", tag: 'appsecret'},
                    {name: "客户编码", tag: 'accesstoken'},
                    {name: "接口地址", tag: 'url'},
                    {name: "创建时间", tag: 'createdate'}
                ];
                //配置批量操作菜单
                $scope.menuInfo ={
                    isshow:false,
                    info:[
                        {name:'批量启用'},
                        {name:'批量禁用'}
                    ],
                    objName:{name:'批量操作'},
                    onChange: function(obj,index){	//点击之后的回调
                        if(index == 0){
                            $scope.batchEnabledItem();
                        }else if(index == 1){
                            $scope.batchDisabledItem();
                        }
                    }
                };
                //获取表格数据
                currentService.query($scope);
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
                    'type' : 'logistics',
                    'oprate' : 'creat'
                };
                $scope.addTab('物流接口：新增物流接口','../template/configManage/newPlatformInterface.html');
            };
            /**
             * 修改 跳转页面
             */
            $scope.edit = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改!',time : 1000});
                }else {
                    $rootScope.params = {
                        'type': 'logistics',
                        'oprate': 'edit',
                        'obj': $scope.tableList[i]
                    };
                    $scope.addTab('物流接口：修改物流接口','../template/configManage/newPlatformInterface.html');
                }
            };
            /**
             * 启用
             */
            $scope.enabledItem = function (i) {
                if($scope.tableList[i].isdisabled){
                    $scope.activeItem = $.extend({}, $scope.tableList[i]);
                    currentService.enabledItem($scope, 'single');
                }else {
                    toolsService.alertMsg({content : '选中数据为启用状态,无需启用!',time : 1000});
                }
            };
            /**
             * 启用店铺 批量
             */
            $scope.batchEnabledItem = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    currentService.enabledItem($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            /**
             * 禁用
             */
            $scope.disabledItem = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '选中数据为禁用状态,无需禁用!',time : 1000});
                }else {
                    $scope.activeItem = $.extend({}, $scope.tableList[i]);
                    toolsService.alertConfirm({
                        "msg": "数据禁用后不可使用，是否继续禁用？",
                        okBtn: function (index, layero) {
                            currentService.disabledItem($scope, 'single');
                            layer.close(index);
                        }
                    });
                }
            };
            /**
             * 批量禁用
             */
            $scope.batchDisabledItem = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    toolsService.alertConfirm({
                        "msg":"数据禁用后不可使用，是否继续禁用？",
                        okBtn : function(index, layero){
                            currentService.disabledItem($scope,'batch');
                            layer.close(index);
                        }
                    });
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

    }]);