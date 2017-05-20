/**
 * Created by xs on 2017/3/23.
 */
angular.module("klwkOmsApp")
    .controller("peeringStrategyController", ["$scope","$rootScope","peeringStrategyService","ApiService","toolsService","APP_MENU","validateService" ,
        function($scope,$rootScope,peeringStrategyService,ApiService,toolsService,APP_MENU,validateService) {
            var pageId = "#peeringStrategy";
            var currentService = peeringStrategyService;
            function init(){
                //表格筛选条件
                $scope.formData = {
                    "storeId":""
                };
                validateService.initValidate(pageId);
                //请求店铺数据 配置下拉列表
                currentService.getStore($scope);
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
                            $scope.batchEnabledPeeringStrategy();
                        }else if(index == 1){
                            $scope.batchDisabledPeeringStrategy();
                        }
                    }
                };
                //配置新增和修改配货策略弹框中的快递选项
                //非货到付款默认快递
                $scope.notcodExpressList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.currentPeeringItem.defaultexpressid = obj.id;
                    }
                };
                //货到付款默认快递
                $scope.codExpressList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.currentPeeringItem.defaultcodexpressid = obj.id;
                    }
                };
                //配置新增关联仓库弹框中的选项
                //仓库
                $scope.warehouseList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.currentWarehouseItem.warehouseid = obj.id;
                    }
                };
                //配货类型
                $scope.matchedTypeList = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.matchedType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.currentWarehouseItem.warehousedispatchtype = obj.id;
                    }
                };
                //当前服务中没有所有快递或所有仓库时请求获取 用于过滤字段
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allExpress)){
                        currentService.getAllExpress($scope,deffer);
                    }else{
                        deffer.resolve();
                    }
                },function(deffer){
                    if($.isEmptyObject(currentService.allWarehouse)){
                        currentService.getAllWarehouse($scope,deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    //查询主表
                    currentService.query($scope);
                });
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "名称", tag: 'name'},
                    {name: "非货到付款默认快递", tag: 'defaultexpressname'},
                    {name: "货到付款默认快递", tag: 'defaultcodexpressname'},
                    {name: "创建日期", tag: 'createdate'},
                    {name: "修改人", tag: 'updater'},
                    {name: "修改日期", tag: 'updatedate'},
                    {name: "备注", tag: 'note'}
                ];
                $scope.topTheadList = [
                    {name: "暂停", tag: 'isdisabled'},
                    {name: "仓库名称", tag: 'warehousename'},
                    {name: "配货类型", tag: 'warehousedispatchtypename'},
                    {name: "优先级", tag: 'orderid'}
                ];
                $scope.bottomTheadList = [
                    {name: "快递名称", tag: 'expressname'},
                    {name: "优先级", tag: 'orderid'}
                ];
                //查询关联配货仓库 配货策略项
                $scope.queryItem = {};
                //当前编辑配货策略项
                $scope.currentPeeringItem = {};
                //查询关联配货快递 关联仓库项
                $scope.queryWarehouseItem = {};
                //当前编辑关联仓库项
                $scope.currentWarehouseItem = {};
                //当前编辑关联快递项
                $scope.activeExpressItem = {};
            }
            init();
            /**
             * 查询主表 配货策略
             */
            $scope.search = function () {
                currentService.query($scope);
            };
            /**
             * 清空搜索条件
             */
            $scope.clearOnly = function () {
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                }
                $scope.StoreList.init();
            };
            /**
             * 查询关联配货仓库
             */
            $scope.queryAssociation = function (i) {
                $scope.currentIndex = i;
                $scope.queryItem = $.extend({},$scope.tableList[i]);
                currentService.queryAssociation($scope);
            };
            /**
             * 查询关联配货快递
             */
            $scope.queryExpresses = function (i) {
                $scope.currentRightIndex = i;
                $scope.queryWarehouseItem = $.extend({},$scope.topTableList[i]);
                if($scope.topTableList[i].expresses){
                    $scope.bottomTableList = $scope.topTableList[i].expresses;
                    $.each($scope.bottomTableList,function (index, obj) {
                        //快递名称 id查找name
                        if(obj.expressid){
                            obj.expressname = currentService.allExpress[obj.expressid].name;
                        }
                    });
                }else {
                    $scope.bottomTableList = [];
                }
            };
            /**
             * 新增配货策略 显示弹框
             */
            $scope.showAddPeeringModal = function () {
                $scope.currentPeeringItem = {
                    "id": "00000000-0000-0000-0000-000000000000",
                    "code": "", //编码
                    "name": "", //名称
                    "note": "", //备注
                    "isdisabled": true,
                    "createdate": "0001-01-01 00:00:00",
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                currentService.getExpress($scope,'creat');
                validateService.clearValidateClass(pageId,"#editPeeringStrategyModal");
                //新增时编码字段可编辑，修改时编码字段不可编辑
                $(pageId + " #editPeeringStrategyModal #templatecode").attr('disabled',false);
                $(pageId + " #editPeeringStrategyModal").modal('show');
            };
            /**
             * 修改配货策略 显示弹框
             */
            $scope.showEditPeeringModal = function (i) {
                if($scope.tableList[i].isdisabled){
                    $scope.currentPeeringItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.tableList[i]);
                    currentService.getExpress($scope,'edit');
                    validateService.clearValidateClass(pageId,"#editPeeringStrategyModal");
                    //新增时编码字段可编辑，修改时编码字段不可编辑
                    $(pageId + " #editPeeringStrategyModal #templatecode").attr('disabled',true);
                    $(pageId + " #editPeeringStrategyModal").modal('show');
                }else {
                    toolsService.alertMsg({content : '数据已启用，暂不可修改',time : 1000});
                }
            };
            /**
             * 新增&修改配货策略
             */
            $scope.editPeeringItem = function () {
                if(validateService.validateAll(pageId,"#editPeeringStrategyModal")){
                    currentService.editPeeringItem($scope);
                }
            };
            /**
             * 启用配货策略
             */
            $scope.enabledPeeringStrategy = function (i) {
                if($scope.tableList[i].isdisabled) {
                    $scope.currentPeeringItem = $.extend({}, $scope.tableList[i]);
                    currentService.enabledPeeringStrategy($scope, 'single');
                }else {
                    toolsService.alertMsg({content : '选中数据为启用状态,无需启用!',time : 1000});
                }
            };
            /**
             * 批量启用配货策略
             */
            $scope.batchEnabledPeeringStrategy = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    currentService.enabledPeeringStrategy($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            /**
             * 禁用配货策略
             */
            $scope.disabledPeeringStrategy = function (i) {
                if($scope.tableList[i].isdisabled) {
                    toolsService.alertMsg({content : '选中数据为禁用状态,无需禁用!',time : 1000});
                }else {
                    $scope.currentPeeringItem = $.extend({}, $scope.tableList[i]);
                    toolsService.alertConfirm({
                        "msg": "数据禁用后不可使用，是否继续禁用？",
                        okBtn: function (index, layero) {
                            currentService.disabledPeeringStrategy($scope, 'single');
                            layer.close(index);
                        }
                    });
                }
            };
            /**
             * 批量禁用配货策略
             */
            $scope.batchDisabledPeeringStrategy = function () {
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
                            currentService.disabledPeeringStrategy($scope,'batch');
                            layer.close(index);
                        }
                    });
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }

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
             * 新增关联仓库 显示弹框
             */
            $scope.addWarehouse = function () {
                if($scope.queryItem.isdisabled){
                    //新建关联仓库项
                    $scope.currentWarehouseItem = {
                        "TemplateWarehouseId": "00000000-0000-0000-0000-000000000000",
                        "TemplateId": $scope.queryItem.id, //配货策略id
                        "IsDisabled": false,
                        "orderid": 0, //优先级
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    currentService.getWarehouse($scope,'creat');
                    validateService.clearValidateClass(pageId,"#addWarehouseModal");
                    $(pageId + " #addWarehouseModal").modal('show');
                }else {
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }
            };
            /**
             * 修改关联仓库 显示弹框
             */
            $scope.editWarehouse = function (i) {
                if($scope.queryItem.isdisabled){
                    $scope.currentWarehouseItem = $.extend({
                        "TemplateId": $scope.queryItem.id, //配货策略id
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.topTableList[i]);
                    currentService.getWarehouse($scope,'edit');
                    validateService.clearValidateClass(pageId,"#addWarehouseModal");
                    $(pageId + " #addWarehouseModal").modal('show');
                }else {
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }
            };
            /**
             * 新增&修改 关联仓库
             */
            $scope.addWarehouseItem = function () {
                for(var i=0;i<$scope.topTableList.length;i++){
                    if($scope.topTableList[i].warehouseid == $scope.currentWarehouseItem.warehouseid){
                        toolsService.alertMsg({content : '所选仓库已存在',time : 1000});
                        return;
                    }
                }
                if(validateService.validateAll(pageId,"#addWarehouseModal")){
                    currentService.addWarehouseItem($scope);
                }
            };
            /**
             * 删除关联仓库
             */
            $scope.deleteWarehouse = function (i) {
                if($scope.queryItem.isdisabled){
                    $scope.currentWarehouseItem = $.extend({},$scope.topTableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据删除后不可恢复，是否继续删除？",
                        okBtn : function(index, layero){
                            currentService.deleteWarehouse($scope);
                            layer.close(index);
                        }
                    });
                }else {
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }
            };
            /**
             * 启用关联仓库
             */
            $scope.enableWarehouse = function (i) {
                if(!$scope.queryItem.isdisabled){
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }else if(!$scope.topTableList[i].isdisabled){
                    toolsService.alertMsg({content : '选中数据为启用状态,无需启用!',time : 1000});
                }else{
                    $scope.currentWarehouseItem = $.extend({},$scope.topTableList[i]);
                    currentService.enableWarehouse($scope);
                }
            };
            /**
             * 禁用关联仓库
             */
            $scope.disableWarehouse = function (i) {
                if(!$scope.queryItem.isdisabled){
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }else if($scope.topTableList[i].isdisabled){
                    toolsService.alertMsg({content : '选中数据为禁用状态,无需禁用!',time : 1000});
                }else{
                    $scope.currentWarehouseItem = $.extend({},$scope.topTableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据禁用后不可使用，是否继续禁用？",
                        okBtn : function(index, layero){
                            currentService.disabledWarehouse($scope);
                            layer.close(index);
                        }
                    });
                }
            };
            /**
             * 设置关联配货快递 显示弹框
             */
            $scope.showSetModal = function () {
                if($scope.queryItem.isdisabled){
                    currentService.getExpress($scope,'set');
                    $(pageId + " #setExpress").modal('show');
                }else {
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});
                }
            };
            /**
             * 选择快递
             */
            $scope.checkExpress = function (i) {
                $scope.expressList[i].ischecked = !$scope.expressList[i].ischecked;
            };
            /**
             * 修改优先级
             */
            $scope.editOrder = function (e) {
                var obj = $(e.target);
                obj.closest('.item').find('.order').hide();
                obj.closest('.item').find('.order-edit').css('display','inline').focus();
            };
            /**
             * 保存优先级
             */
            $scope.saveOrder = function (e,i) {
                var keycode = e.keyCode;
                var obj = $(e.target);
                if(keycode == 13){
                    obj.closest('.item').find('.order').css('display','inline');
                    obj.closest('.item').find('.order-edit').hide();
                    $scope.expressList[i].seq = obj.val();
                }
            };
            /**
             * 保存快递设置
             */
            $scope.setExpress = function () {
                $scope.selectExpressList = [];
                $.each($scope.expressList,function (index, obj) {
                    if(obj.ischecked){
                        var o = $.extend({},obj);
                        $scope.selectExpressList.push(o);
                    }
                });
                $.each($scope.selectExpressList,function (index, obj) {
                    var o = {
                        "TemplateExpressId": obj.templateexpressid, //关联快递id
                        "TemplateId": $scope.queryItem.id, //配货策略id
                        "TemplateWarehouseId": $scope.queryWarehouseItem.templatewarehouseid, //关联配货仓库id
                        "ExpressId": obj.id,
                        "OrderId": obj.seq,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    $scope.selectExpressList[index] = o;
                });
                currentService.setExpress($scope);
            };
            /**
             * 删除关联快递
             */
            $scope.deleteExpress = function (i) {
                if($scope.queryItem.isdisabled){
                    $scope.activeExpressItem = $.extend({},$scope.bottomTableList[i]);
                    toolsService.alertConfirm({
                        "msg":"数据删除后不可恢复，是否继续删除？",
                        okBtn : function(index, layero){
                            currentService.deleteExpress($scope);
                            layer.close(index);
                        }
                    });
                }else {
                    toolsService.alertMsg({content : '配货策略已启用，暂不可操作',time : 1000});

                }
            };

    }]);