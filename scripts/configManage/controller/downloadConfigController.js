/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("downloadConfigController", ["$scope","APP_MENU","downloadConfigService","ApiService","validateService" ,
        function($scope,APP_MENU,downloadConfigService,ApiService,validateService) {
            var pageId = "#downloadConfig";
            var currentService = downloadConfigService;
            function init(){
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
                //下拉组件 店铺
                $scope.storeList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeid = obj.id;
                        $scope.activeItem.sellernick = obj.name;
                        $scope.activeItem.platformtype = obj.platformtype;
                        $(pageId + " #creatModal #sellernick").removeClass('klw-input-error').addClass('klw-input-success');
                    }
                };
                //下拉组件 下载类型
                $scope.downloadTypeList = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.downloadType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.downloadtype = obj.id;
                    }
                };
                //配置时间控件
                $(pageId + ' #begindate').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 0,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "补单", tag: 'isfill'},
                    {name: "JIT", tag: 'isjit'},
                    {name: "云推", tag: 'iscloudpush'},
                    {name: "卖家昵称", tag: 'sellernick'},
                    {name: "平台类型", tag: 'platformtypename'},
                    {name: "下载类型", tag: 'downloadtypename'},
                    {name: "开始时间", tag: 'begindate'},
                    {name: "创建时间", tag: 'createdate'},
                    {name: "延迟时间（分钟）", tag: 'beforetime'},
                    {name: "时间片段（分钟）", tag: 'intervalstep'},
                    {name: "预付款订单下载", tag: 'downloadpresellorder'},
                    {name: "自动创建唯品拣货单", tag: 'isautocreatepick'}
                ];
                //当前编辑项
                $scope.activeItem = {};
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
                validateService.initValidate(pageId);
            }
            init();
            /**
             * 刷新
             */
            $scope.fresh = function () {
                currentService.query($scope);
            };
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
             * 修改 显示弹框
             */
            $scope.edit = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改!',time : 1000});
                }else {
                    $scope.activeItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.tableList[i]);
                    currentService.getStore($scope,'edit');
                    $scope.downloadTypeList.setValue({id:$scope.activeItem.downloadtype});
                    validateService.clearValidateClass(pageId,"#creatModal");
                    $(pageId + " #creatModal").modal('show');
                }
            };
            /**
             * 新增 显示弹框
             */
            $scope.addItem = function () {
                $scope.activeItem = {
                    "id": "00000000-0000-0000-0000-000000000000",
                    "sellernick": "", //卖家昵称
                    "begindate": new Date().format('YYYY-MM-DD hh:mm:ss'), //开始时间
                    "createdate": "0001-01-01 00:00:00", //记录时间
                    "beforetime": 15, //延迟时间
                    "intervalstep": 10, //时间片段
                    "isdisabled": false, //状态
                    "isfill": false, //是否补单
                    "isjit": false, //是否JIT
                    "iscloudpush": false, //云推
                    "downloadpresellorder": false, //下载预付款订单
                    "isautocreatepick": false, //是否自动创建拣货单
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                currentService.getStore($scope,'creat');
                $scope.downloadTypeList.init();
                validateService.clearValidateClass(pageId,"#creatModal");
                $(pageId + " #creatModal").modal('show');
            };
            /**
             * 修改&新增
             */
            $scope.newItem = function () {
                if(validateService.validateAll(pageId,"#creatModal")){
                    currentService.newItem($scope);
                }
            };
            /**
             * 复选项公用方法
             */
            $scope.checkItem = function (name) {
                $scope.activeItem[name] = !$scope.activeItem[name];
            };
            /**
             * 启用
             */
            $scope.enabledItem = function (i) {
                if($scope.tableList[i].isdisabled){
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    currentService.enabledItem($scope,'single');
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
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据禁用后不可使用，是否继续禁用？",
                        okBtn : function(index, layero){
                            currentService.disabledItem($scope,'single');
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