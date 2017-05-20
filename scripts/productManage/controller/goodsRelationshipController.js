/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("goodsRelationshipController", ["$scope", "$rootScope","APP_MENU", "goodsRelationshipService","toolsService","ApiService","validateService",
        function ($scope, $rootScope,APP_MENU, goodsRelationshipService,toolsService,ApiService,validateService) {
            var pageId = '#goodsRelationship';   // 页面Id
            //进入页面需要执行的方法
            function init() {
                // 初始化表单验证
                validateService.initValidate(pageId);
                /**
                 * getStore 获取店铺数据
                 * query 监听以上店铺数据有值时才查询页面数据 否则请求以上
                 */
                var promise = ApiService.listenAll(function(deffer){
                    goodsRelationshipService.getStore($scope,deffer);
                });
                promise.then(function(){
                    goodsRelationshipService.query($scope,1,10);
                });
                // 初始化全部仓库
                goodsRelationshipService.warehouseGet($scope);
                //铺货关系列表配置
                $scope.theadList = [
                    {name: "已关联", tag: 'isassociated'},
                    {name: "自动上传", tag: 'isautouploadinventory'},
                    {name: "自动上架", tag: 'isautolisting'},
                    {name: "自动下架", tag: 'isautodelisting'},
                    {name: "店铺", tag: 'storename'},
                    {name: "平台商品ID", tag: 'platformid'},
                    {name: "平台规格ID", tag: 'platformskuid'},
                    {name: "商家商品编码", tag: 'platformoutcode'},
                    {name: "商家规格编码", tag: 'platformoutcode'},
                    {name: "平台商品名称", tag: 'platformtitle'},
                    {name: "平台规格名称", tag: 'platformskutitle'},
                    {name: "平台库存", tag: 'platforminventory'},
                    {name: "库存扣减方式", tag: 'deductionmethod'},
                    {name: "平台状态", tag: 'platformstatus'},
                    {name: "创建日期", tag: 'createdate'},
                    {name: "更新人", tag: 'updater'},
                    {name: "更新日期", tag: 'updatedate'}
                ];
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'goodsConfig'
                };
                // 商品信息列表配置
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                // 组合套装列表配置
                $scope.theadGroupList = [
                    {name: "不可拆分", tag: 'issplit'},
                    {name: "套装代码", tag: 'code'},
                    {name: "套装名称", tag: 'description'},
                    {name: "套装分类", tag: 'categoryname'},
                    {name: "套装规格", tag: 'productsize'},
                    {name: "礼盒", tag: 'isgift'},
                    {name: "重量", tag: 'weight'},
                    {name: "销售价", tag: 'wholesaleprice'},
                    {name: "备注", tag: 'note'}
                ];
                // 批量操作插件配置
                $scope.batch ={
                    isshow:false,
                    info:[
                        {name:'库存上传'},
                        {name:'修改库存扣减方式'},
                        {name:'设置上下架阈值'},
                        {name:'启动自动上传'},
                        {name:'停用自动上传'},
                        {name:'启动自动上架'},
                        {name:'停用自动上架'},
                        {name:'启动自动下架'},
                        {name:'停用自动下架'},
                        {name:'删除'}
                    ],
                    objName:{name:'批量操作'},
                    onChange: function(obj,index){	//点击之后的回调
                        switch(index) {
                            case 0:
                                //库存上传
                                $scope.addTab('库存上传','../template/inventoryManage/inventoryUpload.html');
                                break;
                            case 1:
                                // 修改库存扣减方式
                                $scope.batchInventory();
                                break;
                            case 2:
                                // 设置上下架阀值
                                $scope.showModal(-1,'batchSetThresholdModal');
                                break;
                            case 3:
                                // 启动自动上传
                                $scope.batchEnableAutoUpload(true);
                                break;
                            case 4:
                                // 停用自动上传
                                $scope.batchDisableAutoUpload(false);
                                break;
                            case 5:
                                // 启动自动上架
                                $scope.batchEnableAutoListing(true);
                                break;
                            case 6:
                                //停用自动上架
                                $scope.batchDisableAutoListing(false);
                                break;
                            case 7:
                                // 启动自动下架
                                $scope.batchEnableAutoDeListing(true);
                                break;
                            case 8:
                                // 启动自动下架
                                $scope.batchDisableAutoDeListing(false);
                                break;
                            case 9:
                                //删除
                                $scope.batchDelete();
                                break;
                        }
                    }
                };
                // 铺货关系 批量操作插件配置
                $scope.relation ={
                    isshow:false,
                    info:[
                        {name:'铺货下载'},
                        {name:'全店下载'}
                    ],
                    objName:{name:'铺货下载'},
                    onChange: function(obj,index){	//点击之后的回调
                        switch(index) {
                            case 0:
                                // 铺货下载
                                $scope.showModal(-1,'shopDownloadModal','shopDownload');
                                break;
                            case 1:
                                // 全店下载
                                $scope.showModal(-1,'shopDownloadModal','wholeShopDownload');
                                break;
                        }
                    }
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //搜索项
                $scope.searchItem = {};
                // 查询条件项
                $scope.queryItem = {
                    // 关联
                    'isassociated':'',
                    // 自动上传
                    'isautouploadinventory':'',
                    // 自动上架
                    'isautolisting':'',
                    // 自动下架
                    'isautodelisting':''
                };
                // 店铺
                $scope.store = 'radio';
                $scope.radioStore = {
                    'status':'selecting'
                };
                // 存储搜索显示项
                $scope.num = [];
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

                /*铺货下载初始化下拉框*/
                //店铺
                $scope.selectStore1 = {
                    isshow:false,
                    info:[],
                    validate:true,
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.downloadItem.Store = obj;
                    }
                };
                //商品状态
                $scope.selectStatus ={
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.productStatusList,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.downloadItem.productStatus = index;
                    }
                };
                /*平台库存查询下拉框*/
                //店铺
                $scope.selectStore2 ={
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.platformItem.store = obj;
                    }
                };

                /*扣减方式初始化下拉框*/
                //店铺
                $scope.selectStore3 ={
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.deductionItem.storeid = obj.id;
                        $scope.deductionItem.interfaceid = obj.interfaceid;
                    }
                };
                //商品状态
                $scope.selectGoodStatus ={
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.goodStatus,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.deductionItem.outstock = index;
                    }
                };
                //扣减方式
                $scope.selectReduce ={
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.marketingInventoryDeduction,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.deductionItem.status = (index+1);
                    }
                };
                //表格当前编辑项
                $scope.activeItem = {};
                // 商品搜索项
                $scope.productItem = {};
                //商品当前编辑项
                $scope.acitveProductItem = {};
                // 组合套装搜索项
                $scope.groupItem = {};
                //组合套装当前编辑项
                $scope.acitveGroupItem = {};

                // 时间控件初始化
                $(pageId + ' .datePlugin').datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            }
            init();

            //联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    goodsRelationshipService.query($scope,1,10,1);
                }
            };

            // 条件搜索
            $scope.queryCondition = function (name) {
                var list = ['',true,false];
                $.each(list,function (index, obj) {
                    if($scope.queryItem[name] === obj){
                        if(index == list.length - 1){
                            $scope.queryItem[name] = list[0];
                            return false;
                        }else {
                            $scope.queryItem[name] = list[index+1];
                            return false;
                        }
                    }
                });
                goodsRelationshipService.query($scope,1,10,1);
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    goodsRelationshipService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.radioStore.status = 'selecting';
                    $scope.num = [];
                }
            };

            // 筛选条件关闭
            $scope.closeSelect = function (module,item,type) {
                $scope[module] = {
                    'status': 'selecting',
                    'content': ''
                };
                $scope.searchItem[item] = '';
                $scope.num.pop();
                // 默认显示单选状态
                $scope[type] = 'radio';
                $scope.searchStore = $scope.singleWordData['data'];
            };

            // 单选公用方法
            $scope.radioList = function (module,item,name,id) {
                $scope[module] = {
                    'status': 'selected',
                    'content': name
                };
                $scope.searchItem[item] = id;
                $scope.num.push(Math.random());
            };

            //高级搜索类型（单选&多选&更多）
            $scope.module = function (module,type) {
                $scope[module] = type;
                $scope.searchStore = $scope.singleWordData['data'];
            };

            // 字母查询
            $scope.singleWordQuery = function (name,module,data,e) {
                $scope[data] = $scope[module]['data'];  // 将数据还原
                $(e.target).closest('span').addClass('current').siblings().removeClass('current');
                if(name == '全部') {
                    $scope[data] = $scope[module]['data'];
                } else {
                    $scope[data] = $scope[module][name];
                }
            };

            // 搜索查询
            $scope.singleWordSearch = function (field,module) {
                $(pageId + ' .wordSearch span').removeClass('current');
                $scope.searchStore = $scope[module]['data'];
                $.each($scope[module]['data'],function (index,obj) {
                    if (JSON.stringify(obj.name).indexOf(field) != -1) {
                        obj.isHide = false;
                    } else {
                        obj.isHide = true;
                    }
                });
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };

            //查看关联商品
            $scope.associationFunc = function (i) {
                $scope.association = $.extend({},$scope.tableList[i].product);
                $scope.associationId = $scope.tableList[i].id;
                $.each($scope.tableList, function (index,obj) {
                    obj.isQuerySelect = false;
                });
                $scope.tableList[i].isQuerySelect = true;
            };

            // 删除关联商品
            $scope.productDelete = function () {
                goodsRelationshipService.deleteProduct($scope);
            };

            // 保存关联商品
            $scope.productSave = function () {
                goodsRelationshipService.saveProduct($scope,$scope.association);
            };

            /*选择关联商品*/
            $scope.associationProduct = {
                // 搜索
                search:function () {
                    goodsRelationshipService.productQuery($scope,1,6);
                },
                // 搜索取消
                searchCancel:function () {
                    $scope.productItem = {};
                    goodsRelationshipService.productQuery($scope,1,6);
                },
                // 查看仓库
                select:function (obj,i) {
                    goodsRelationshipService.getInventory($scope,obj);
                    $scope.acitveProductItem = $.extend({},obj);
                    $.each($scope.tableSkuList, function (index,obj) {
                        obj.isProductSelect = false;
                    });
                    $scope.tableSkuList[i].isProductSelect = true;
                },
                // 保存
                save:function () {
                    $scope.association = $.extend({},$scope.acitveProductItem);
                    $scope.hideModal('productSelectModal');
                }
            };

            /*选择关联组合*/
            $scope.associationGroup = {
                // 搜索
                search:function () {
                    goodsRelationshipService.getGroup($scope,1,10);
                },
                // 搜索取消
                searchCancel:function () {
                    $scope.groupItem = {};
                    goodsRelationshipService.getGroup($scope,1,10);
                },
                // 查看仓库
                select:function (obj,i) {
                    $.each($scope.tableGroupList, function (index,obj) {
                        obj.isGroupSelect = false;
                    });
                    $scope.tableGroupList[i].isGroupSelect = true;
                    $scope.acitveGroupItem = $.extend({},obj);
                },
                // 保存
                save:function () {
                    $scope.association = $.extend({},$scope.acitveGroupItem);
                    $scope.hideModal('groupSelectModal');
                }
            };

            //复选框改变单条数据的isdatacheck属性
            $scope.selectItem = function (i) {
                $scope.tableList[i].isdatacheck = !$scope.tableList[i].isdatacheck;
                $scope.isalldatacheck = true;
                $.each($scope.tableList,function (index, obj) {
                    if(!obj.isdatacheck){
                        $scope.isalldatacheck = false;
                    }
                })
            };

            //复选框改变所有数据的isdatacheck属性
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

            // 复选框公用方法
            $scope.checkItem = function (item,name) {
                item[name] = !item[name];
            };

            //启用自动上传
            $scope.enableAutoUpload = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if(!$scope.activeItem.isautouploadinventory) {
                    goodsRelationshipService.autoUpload($scope,value,'single');
                }
            };
            // 停用自动上传
            $scope.disableAutoUpload  = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.isautouploadinventory) {
                    goodsRelationshipService.autoUpload($scope,value,'single');
                }
            };
            // 批量启用自动上传
            $scope.batchEnableAutoUpload  = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoUpload($scope, value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            // 批量停用自动上传
            $scope.batchDisableAutoUpload  = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoUpload($scope, value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //启用自动上架
            $scope.enableAutoListing = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if(!$scope.activeItem.isautolisting) {
                    goodsRelationshipService.autoListing($scope,value,'single');
                }
            };
            // 停用自动上架
            $scope.disableAutoListing = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.isautolisting) {
                    goodsRelationshipService.autoListing($scope,value,'single');
                }
            };
            //批量启用自动上架
            $scope.batchEnableAutoListing = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoListing($scope,value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            //批量停用自动上架
            $scope.batchDisableAutoListing = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoListing($scope,value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //启用自动下架
            $scope.enableAutoDeListing = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if(!$scope.activeItem.isautodelisting) {
                    goodsRelationshipService.autoDeListing($scope,value,'single');
                }
            };
            // 停用自动下架
            $scope.disableAutoDeListing = function (i,value) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.isautodelisting) {
                    goodsRelationshipService.autoDeListing($scope,value,'single');
                }
            };
            //批量启用自动下架
            $scope.batchEnableAutoDeListing = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoDeListing($scope,value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            //批量停用自动下架
            $scope.batchDisableAutoDeListing = function (value) {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.autoDeListing($scope,value,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //删除
            $scope.delete = function () {
                goodsRelationshipService.deleteGoods($scope,'single');
            };
            //批量删除提示
            $scope.batchDelete = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    $scope.showModal(-1,'batchDeleteModal');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            // 批量删除操作
            $scope.batchDeleteOp= function () {
                goodsRelationshipService.deleteGoods($scope,'batch');
            };

            //设置上下架阀值
            $scope.setthreshold = function () {
                goodsRelationshipService.setThreshold($scope,'single');
            };
            // 批量设置上下架阀值
            $scope.batchSetthreshold = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    goodsRelationshipService.setThreshold($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //铺货下载
            $scope.goodDownLoad = function () {
                if(validateService.validateAll(pageId,'#shopDownloadModal')) {
                    goodsRelationshipService.download($scope);
                }
            };

            // 平台库存查询
            $scope.inventoryQuery = function () {
                if(validateService.validateAll(pageId,'#inventoryQueryModal')) {
                    goodsRelationshipService.platformQuery($scope);
                }
            };

            //库存扣减方式
            $scope.inventory = function () {
                if(validateService.validateAll(pageId,'#inventoryWayModal')) {
                    goodsRelationshipService.updateItem($scope);
                }
            };
            //批量库存扣减方式
            $scope.batchInventory = function () {
                $scope.inventoryItem = [];
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    // 添加勾选项
                    $.each($scope.tableList, function (index,obj) {
                        if(obj.isdatacheck) {
                            $scope.inventoryItem.push(obj);
                        }
                    });
                    // 判断当前是否选的相同店铺
                    for(var i = 0; i < $scope.inventoryItem.length; i++) {
                        for (var j = 0; j < $scope.inventoryItem.length; j++) {
                            if ($scope.inventoryItem[i].storeid != $scope.inventoryItem[j].storeid) {
                                toolsService.alertMsg({content: '请选择相同店铺', time: 1000});
                                return false;
                            }
                        }
                    }
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
                //通过店铺id获取店铺名称
                var getNameById = function (storeid) {
                    if($scope.storeData.length > 0){
                        $.each($scope.storeData,function (index, obj) {
                            if(obj.id.toLowerCase() == storeid.toLowerCase()){
                                $scope.store = {
                                    name:obj.name,
                                    id:storeid
                                };
                            }
                        })
                    }
                };
                getNameById($scope.inventoryItem[0].storeid);
                $rootScope.productInventoryParam = {
                    data: $scope.store,
                    obj: $scope.inventoryItem
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/modifyInventory.html';
                $scope.option[index].name = '铺货关系：修改库存扣减方式';
            };

            //显示模态框
            $scope.showModal = function (i,name,type) {
                if(i >= 0){
                    // 获取当前行数据
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                }
                if(name == 'productSelectModal') {
                    //调用关联商品信息
                    goodsRelationshipService.productQuery($scope,1,6);
                } else if (name == 'groupSelectModal') {
                    // 调用关联组合套装信息
                    goodsRelationshipService.getGroup($scope,1,10);
                }

                // 判断铺货下载还是全店下载
                if(type == 'shopDownload') {
                    $scope.isDownload = 'shopDownload';
                } else {
                    $scope.isDownload = 'wholeShopDownload';
                }
                /*铺货下载弹出框初始化*/
                // 编辑项
                $scope.downloadItem = {
                    "ProductId": '',
                    "ProductCode": '',
                    "isUpload": false,
                    "isPutaway": false,
                    "isSoldout": false,
                    "isDefault": false
                };
                // 店铺
                $scope.selectStore1.init();
                //商品状态
                $scope.selectStatus.init();
                // 初始化表单
                validateService.clearValidateClass(pageId,'#shopDownloadModal');

                /*平台查询弹出框初始化*/
                // 编辑项
                $scope.platformItem = {};
                //店铺
                $scope.selectStore2.init();
                // 初始化表单
                validateService.clearValidateClass(pageId,'#inventoryQueryModal');

                /*库存扣减弹出框初始化*/
                // 编辑项
                $scope.deductionItem = {};
                // 店铺
                $scope.selectStore3.init();
                // 商品状态
                $scope.selectGoodStatus.init();
                // 扣减方式
                $scope.selectReduce.init();
                // 初始化表单
                validateService.clearValidateClass(pageId,'#inventoryWayModal');

                $(pageId + " #" + name).modal('show');
            };

            // 隐藏模态框
            $scope.hideModal = function (name) {
                $(pageId + " #" + name).modal('hide');
            };

            //配置时间控件 配置
            $scope.showDatetimePick = function(myevent) {
                $(myevent.target).datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            };

            /*铺货关系分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }
            };
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    goodsRelationshipService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;
            //外部上一页
            $scope.prev = function () {
                $scope.paginationConf.currentPage--;
                $scope.paginationConf.type = 0;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
            };
            //外部下一页
            $scope.next = function () {
                $scope.paginationConf.currentPage++;
                $scope.paginationConf.type = 1;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
            };

            /*规格信息分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationSkuConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationSkuConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }
            };
            $scope.paginationSkuConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 6,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    goodsRelationshipService.productQuery($scope, $scope.paginationSkuConf.currentPage, $scope.paginationSkuConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationSkuConf.itemsPerPage;


            /*组合套装分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationGroupConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationGroupConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }
            };
            $scope.paginationGroupConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    goodsRelationshipService.getGroup($scope, $scope.paginationGroupConf.currentPage, $scope.paginationGroupConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationGroupConf.itemsPerPage;

        }]);