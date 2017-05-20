/**
 * Created by xs on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("shopInformationController", ["$scope","$rootScope","toolsService","shopInformationService","APP_MENU","ApiService","validateService",
        function($scope,$rootScope,toolsService,shopInformationService,APP_MENU,ApiService,validateService) {
            //页面id
            var pageId = "#shopInformation";
            //页面service
            var currentService = shopInformationService;
            //进入页面需要执行的方法
            function init(){
                validateService.initValidate(pageId);
                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage,itemsPerPage) {
                    //超出页码范围 return
                    if(currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1 )) return;
                    $scope.first = itemsPerPage * (currentPage-1) + 1;
                    if(Math.ceil($scope.paginationConf.totalItems / itemsPerPage)  === currentPage){
                        $scope.last = $scope.paginationConf.totalItems;
                    }else{
                        $scope.last = currentPage *  itemsPerPage;
                    }
                };
                $scope.paginationConf = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [6, 10, 15, 20, 25,50],  //配置配置可选择每页显示记录数 array
                    extClick : false , //当为外部点击翻页时为true
                    type: 0 ,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function(){	//操作之后的回调
                        currentService.query($scope);
                    }
                };
                //初始化第一页
                $scope.first = 1;
                //初始化最后一页
                $scope.last = $scope.paginationConf.itemsPerPage;
                //外部上一页
                $scope.prev = function () {
                    $scope.paginationConf.currentPage--;
                    $scope.paginationConf.type = 0 ;
                    $scope.paginationConf.extClick = true;
                    $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
                };
                //外部下一页
                $scope.next = function () {
                    $scope.paginationConf.currentPage++;
                    $scope.paginationConf.type = 1 ;
                    $scope.paginationConf.extClick = true;
                    $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
                };
                //下拉选框插件 默认仓库
                $scope.DefaultWarehouse = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.defaultwarehouseid = obj.id;
                    }
                };
                //下拉选框插件 退入仓库
                $scope.DefaultInWarehouse = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.defaultinwarehouseid = obj.id;
                    }
                };
                //下拉选框插件 换出仓库
                $scope.DefaultOutWareshouse = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.defaultoutwareshouseid = obj.id;
                    }
                };
                //下拉选框插件 支付方式
                $scope.DefaultPayType = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.payment,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.defaultpaytype = obj.id;
                    }
                };
                //下拉选框插件 配货模板
                $scope.DispatchTemplate = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.dispatchtemplateid = obj.id;
                    }
                };
                //下拉选框插件 配货模式
                $scope.DispatchMode = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.theDistributionPattern,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.dispatchmode = obj.id;
                    }
                };
                //下拉选框插件 铺货规则
                $scope.DistributionRule = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.DistributionRule,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.distributionrule = obj.id;
                    }
                };
                //下拉选框插件 京东模式
                $scope.Mode = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.JDMode,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.storeSetting.mode = obj.id;
                    }
                };
                /**
                 * getWarehouse 获取店铺设置的仓库选项
                 * getDispatchTemplate 获取店铺设置的配货模板选项
                 * queryPlatformInterface 获取到平台接口数据字典
                 * query 监听以上三组数据都有值时才查询页面数据
                 */
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allWarehouse)){
                        currentService.getWarehouse($scope,deffer);
                    }else{
                        deffer.resolve();
                    }
                },function(deffer){
                    if($.isEmptyObject(currentService.allDispatchTemplate)){
                        currentService.getDispatchTemplate($scope,deffer);
                    }else{
                        deffer.resolve();
                    }
                },function (deffer) {
                    if($.isEmptyObject(currentService.allPlatformInterface)){
                        currentService.queryPlatformInterface($scope,deffer);
                    }else{
                        deffer.resolve();
                    }
                },function (deffer) {
                    if($.isEmptyObject(currentService.allPlatformType)){
                        currentService.getPlatformType(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    currentService.query($scope);
                    $scope.DefaultWarehouse.info = currentService.allWarehouse;
                    $scope.DefaultInWarehouse.info = currentService.allWarehouse;
                    $scope.DefaultOutWareshouse.info = currentService.allWarehouse;
                    $scope.DispatchTemplate.info = currentService.allDispatchTemplate;
                });
                //店铺设置弹框 默认tab为基础设置
                $scope.tab = 'basicSet';
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "编码", tag: 'code'},
                    {name: "名称", tag: 'name'},
                    {name: "店铺类型", tag: 'storetypename'},
                    {name: "平台接口", tag: 'interfacename'},
                    {name: "平台类型", tag: 'platformtypename'},
                    {name: "创建时间", tag: 'createdate'},
                    {name: "备注", tag: 'note'}
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
                //配置时间控件
                $(pageId + ' #auditfilterbegin').datetimepicker({
                    format: 'hh:ii:ss',
                    autoclose: true,
                    startView: 1,
                    minView: 0,
                    maxView: 1,
                    language: 'zh-CN',
                    minuteStep: 1,
                    startDate:new Date().format('YYYY-MM-DD')
                });
                $(pageId + ' #auditfilterend').datetimepicker({
                    format: 'hh:ii:ss',
                    autoclose: true,
                    startView: 1,
                    minView: 0,
                    maxView: 1,
                    language: 'zh-CN',
                    minuteStep: 1,
                    startDate:new Date().format('YYYY-MM-DD')
                });
                $(pageId + ' #filterdate').datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    autoclose: true,
                    startView: 2,
                    minView: 0,
                    language: 'zh-CN',
                    minuteStep: 5
                });
            }
            init();
            /**
             * 刷新
             */
            $scope.fresh = function () {
                currentService.query($scope);
            };
            /**
             * 新增店铺
             */
            $scope.goNewShop = function () {
                $rootScope.params = {
                    'oprate':'creat'
                };
                $scope.addTab('店铺信息：新增店铺信息','../template/configManage/newShop.html');
            };
            /**
             * 修改店铺
             */
            $scope.goEditShop = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改',time : 1000});
                }else{
                    $rootScope.params = {
                        'oprate':'edit',
                        'obj':$scope.tableList[i]
                    };
                    $scope.addTab('店铺信息：修改店铺信息','../template/configManage/newShop.html');
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
             * 启用店铺 单个
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
                }else{
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
            /**
             * 切换tab
             */
            $scope.toggleTab = function (name) {
                $scope.tab = name;
            };
            /**
             * 隐藏初始化设置提示
             */
            $scope.hideSetAlert = function () {
                $scope.isAllSet = true;
            };
            /**
             * 复选框勾选操作
             */
            $scope.checkItem = function (name) {
                $scope.activeItem.storeSetting[name] = !$scope.activeItem.storeSetting[name];
            };
            /**
             * 显示店铺设置弹框
             */
            $scope.showShopSetModal = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                //平台类型为京东时才能设置京东模式
                if($scope.activeItem.platformtype == 6){
                    $scope.Mode.disable(false);
                }else{
                    $scope.Mode.disable(true);
                }
                if(!$.isEmptyObject($scope.activeItem.storeSetting)){
                    $scope.activeItem.storeSetting = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.activeItem.storeSetting);
                    //默认仓库
                    $scope.DefaultWarehouse.setValue({id:$scope.activeItem.storeSetting.defaultwarehouseid});
                    //退入仓库
                    $scope.DefaultInWarehouse.setValue({id:$scope.activeItem.storeSetting.defaultinwarehouseid});
                    //换出仓库
                    $scope.DefaultOutWareshouse.setValue({id:$scope.activeItem.storeSetting.defaultoutwareshouseid});
                    //支付方式
                    $scope.DefaultPayType.setValue({id:$scope.activeItem.storeSetting.defaultpaytype});
                    //配货模板
                    $scope.DispatchTemplate.setValue({id:$scope.activeItem.storeSetting.dispatchtemplateid});
                    //配货模式
                    $scope.DispatchMode.setValue({id:$scope.activeItem.storeSetting.dispatchmode});
                    //铺货规则
                    $scope.DistributionRule.setValue({id:$scope.activeItem.storeSetting.distributionrule});
                    //京东模式
                    $scope.Mode.setValue({id:$scope.activeItem.storeSetting.mode});
                    //自动审单拦截 数据过滤 截取时分秒
                    if($scope.activeItem.storeSetting.auditfilterbegin){
                        $scope.activeItem.storeSetting.auditfilterbeginFormat = $scope.activeItem.storeSetting.auditfilterbegin.substr(11);
                    }
                    if($scope.activeItem.storeSetting.auditfilterend){
                        $scope.activeItem.storeSetting.auditfilterendFormat = $scope.activeItem.storeSetting.auditfilterend.substr(11);
                    }
                }else {
                    $scope.activeItem.storeSetting = {
                        "storeid": $scope.activeItem.id, //店铺id
                        //"defaultinwarehouseid": scope.activeItem.storeSetting.defaultinwarehouseid, //退入仓库
                        //"defaultoutwareshouseid": scope.activeItem.storeSetting.defaultoutwareshouseid, //换出仓库
                        //"defaultwarehouseid": scope.activeItem.storeSetting.defaultwarehouseid, //默认仓库
                        //"defaultpaytype": scope.activeItem.storeSetting.defaultpaytype, //支付方式
                        //"dispatchmode": scope.activeItem.storeSetting.dispatchmode, //配货模式
                        //"dispatchtemplateid": scope.activeItem.storeSetting.dispatchtemplateid, //配货模板
                        "ispredeliveryfirit": false, //预售有货先发
                        "isrelsales": false, //退换货关联订单
                        "ischeckbuyermemo": false, //审核买家备注
                        "ischeckcod": false, //货到付款自动审核
                        "isfilter": false, //订单过滤
                        "ispush": false, //订单推送
                        "ischeckaddress": false, //审核地址
                        "isconnectcloudsstack": false, //启用电子面单
                        "isinvoiceautoaudit": false, //发票自动审核
                        "isautodownloaddistribution": false, //自动下载铺货
                        "isautodownloadalipayrecord": false, //自动下载支付宝账单
                        "isautoauditrefundorder": false, //自动审核退款单
                        "returnmessage": "", //退货留言
                        "mergemaxcount": 0, //最大合单数量
                        "mode": 0, //京东模式 平台类型是京东的才可以设置该字段，其他平台传默认项
                        //"distributionrule": scope.activeItem.storeSetting.distributionrule, //铺货规则
                        "filterdate": "", //订单过滤时间
                        "auditfilterbegin": "", //自动审单拦截开始时间
                        "auditfilterend": "", //自动审单拦截结束时间
                        "isusedistributionamount": false, //启用分销价
                        "presellnhnosplit": 0, //预售NH前不拆单
                        "regionkey": "", //拦截区域关键字，多个关键字用";"隔开
                        "product": "", //拦截商品信息，多个商品用";"隔开
                        "totalproduct": 0, //拦截件数
                        "totalamount": 0, //拦截金额
                        "ischecksellermemo": false, //审核卖家备注
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //默认仓库
                    $scope.DefaultWarehouse.init();
                    //退入仓库
                    $scope.DefaultInWarehouse.init();
                    //换出仓库
                    $scope.DefaultOutWareshouse.init();
                    //支付方式
                    $scope.DefaultPayType.init();
                    //配货模板
                    $scope.DispatchTemplate.init();
                    //配货模式
                    $scope.DispatchMode.init();
                    //铺货规则
                    $scope.DistributionRule.init();
                    //京东模式
                    $scope.Mode.init();
                }
                //店铺设置弹框 默认tab为基础设置
                $scope.tab = 'basicSet';
                validateService.clearValidateClass(pageId,"#shopSetModal");
                $(pageId + " #shopSetModal").modal('show');
            };
            /**
             * 保存店铺设置
             */
            $scope.saveSet = function () {
                if(validateService.validateAll(pageId,"#shopSetModal")){
                    //自动审单拦截 数据过滤 提交时拼接年月日
                    if($scope.activeItem.storeSetting.auditfilterbeginFormat){
                        $scope.activeItem.storeSetting.auditfilterbegin = new Date().format('YYYY-MM-DD') + " " + $scope.activeItem.storeSetting.auditfilterbeginFormat;
                    }
                    if($scope.activeItem.storeSetting.auditfilterendFormat){
                        $scope.activeItem.storeSetting.auditfilterend = new Date().format('YYYY-MM-DD') + " " + $scope.activeItem.storeSetting.auditfilterendFormat;
                    }
                    currentService.saveStoreSetting($scope);
                }
            };


    }]);