/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("storageInformationController", ["$scope","$rootScope","storageInformationService","ApiService","toolsService","APP_MENU",
        function($scope,$rootScope,storageInformationService,ApiService,toolsService,APP_MENU) {
            var pageId = "#storageInformation";
            //页面service
            var currentService = storageInformationService;
            //进入页面需要执行的方法
            function init(){
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
                //搜索条件
                $scope.formData = {
                    'code' : '', //仓库编码
                    'isdisabled' : '', //禁用
                    'ispush' : '', //推单
                    'isintercept' : '' //截单
                };
                /**
                 * queryWarehouse 获取父级仓库数据字典
                 * queryLogisticsInterfaceList 获取物流接口数据字典
                 * query 监听以上两组数据都有值时才查询页面数据 否则请求以上两组数据
                 */
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allWarehouse)){
                        currentService.queryWarehouse(deffer);
                    }else{
                        deffer.resolve();
                    }
                },function(deffer){
                    if($.isEmptyObject(currentService.allLogisticsInterface)){
                        currentService.queryLogisticsInterfaceList(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    currentService.query($scope);
                });
                //表格配置
                $scope.theadListOne = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "仓库编码", tag: 'code'},
                    {name: "仓库名称", tag: 'name'},
                    {name: "仓库类型", tag: 'warehousetypename'},
                    {name: "仓储类型", tag: 'storagetypename'},
                    {name: "父级仓库", tag: 'parentname'},
                    {name: "物流接口", tag: 'applicationname'}
                ];
                $scope.theadListTwo = [
                    {name: "推单", tag: 'ispush'},
                    {name: "截单", tag: 'isintercept'},
                    {name: "截单类型", tag: 'intercepttypename'},
                    {name: "时间类型", tag: 'intercepttimetypename'},
                    {name: "截单开始时间", tag: 'begintime'},
                    {name: "截单结束时间", tag: 'endtime'},
                    {name: "固定时间", tag: 'fixedtime'}
                ];
                $scope.theadListThree = [
                    {name: "电话", tag: 'telephone'},
                    {name: "仓库地址", tag: 'address'}
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
                //日期控件
                $(pageId + " #fixedtime").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2, //打开之后首先显示的视图
                    minView: 0, //能够提供的最精确的时间选择视图
                    todayBtn:1,
                    language: 'zh-CN'
                });
                //下拉选框插件 截单类型
                $scope.truncatedTypeList = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.truncatedType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.orderPushSetting.intercepttype = obj.id;
                        if(obj.id == 1){
                            //时间段拦截时，禁用固定时间输入框
                            $scope.activeItem.orderPushSetting.fixedtime = "";
                            $(pageId + " #setOrderPushModal #fixedtime").attr('disabled',true);
                            $(pageId + " #setOrderPushModal").find('.time-area').find('.klw-input').attr('disabled',false);
                        }else if(obj.id == 2){
                            //固定时间拦截时，禁用时间范围输入框
                            $scope.activeItem.orderPushSetting.begintime = "";
                            $scope.activeItem.orderPushSetting.endtime = "";
                            $(pageId + " #setOrderPushModal").find('.time-area').find('.klw-input').attr('disabled',true);
                            $(pageId + " #setOrderPushModal #fixedtime").attr('disabled',false);
                        }
                    }
                };
                //下拉选框插件 时间类型
                $scope.timeTypeList = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.timeType,'id','name'),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.orderPushSetting.intercepttimetype = obj.id;
                    }
                };

            }
            init();
            /**
             * 查询条件切换
             */
            $scope.queryCondition = function (name) {
                var list = ['',true,false];
                $.each(list,function (index, obj) {
                    if($scope.formData[name] === obj){
                        if(index == list.length - 1){
                            $scope.formData[name] = list[0];
                            return false;
                        }else {
                            $scope.formData[name] = list[index+1];
                            return false;
                        }
                    }
                });
                currentService.query($scope);
            };
            /**
             * 新增仓库信息
             */
            $scope.goNewStorage = function () {
                $rootScope.params = {
                    'oprate':'creat'
                };
                $scope.addTab('仓库信息：新增仓库信息','../template/configManage/newStorageInformation.html');
            };
            /**
             * 修改仓库信息
             */
            $scope.goEditShop = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改',time : 1000});
                }else{
                    $rootScope.params = {
                        'oprate':'edit',
                        'obj':$scope.tableList[i]
                    };
                    $scope.addTab('仓库信息：修改仓库信息','../template/configManage/newStorageInformation.html');
                }
            };
            /**
             * 搜索
             */
            $scope.search = function () {
                currentService.query($scope);
            };
            /**
             * 清空
             */
            $scope.clearOnly = function () {
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                }
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
             * 显示推单设置弹框
             */
            $scope.showPushModal = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可进行推单设置',time : 1000});
                }else {
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    if($.isEmptyObject($scope.activeItem.orderPushSetting)){
                        //未做推单设置时初始化推单设置ID
                        $scope.activeItem.orderPushSetting.settingid = "00000000-0000-0000-0000-000000000000";
                        //初始化时间段拦截，禁用固定时间输入框
                        $scope.activeItem.orderPushSetting.intercepttype = 1;
                        $scope.truncatedTypeList.setValue({id:$scope.activeItem.orderPushSetting.intercepttype});
                        $(pageId + " #setOrderPushModal #fixedtime").attr('disabled',true);
                        $(pageId + " #setOrderPushModal").find('.time-area').find('.klw-input').attr('disabled',false);
                        $scope.timeTypeList.init();
                    }else{
                        //截单类型
                        if($scope.activeItem.orderPushSetting.intercepttype !== undefined){
                            $scope.truncatedTypeList.setValue({id:$scope.activeItem.orderPushSetting.intercepttype});
                            if($scope.activeItem.orderPushSetting.intercepttype == 1){
                                //时间段拦截时，禁用固定时间输入框
                                $(pageId + " #setOrderPushModal #fixedtime").attr('disabled',true);
                                $(pageId + " #setOrderPushModal").find('.time-area').find('.klw-input').attr('disabled',false);
                            }else if($scope.activeItem.orderPushSetting.intercepttype == 2){
                                //固定时间拦截时，禁用时间范围输入框
                                $(pageId + " #setOrderPushModal").find('.time-area').find('.klw-input').attr('disabled',true);
                                $(pageId + " #setOrderPushModal #fixedtime").attr('disabled',false);
                            }
                        }else{
                            $scope.truncatedTypeList.init();
                        }
                        //时间类型
                        if($scope.activeItem.orderPushSetting.intercepttimetype !== undefined){
                            $scope.timeTypeList.setValue({id:$scope.activeItem.orderPushSetting.intercepttimetype});
                        }else{
                            $scope.timeTypeList.init();
                        }
                    }
                    $(pageId + " #setOrderPushModal").modal('show');
                }
            };
            /**
             * 推单设置复选框
             */
            $scope.checkItem = function (name) {
                $scope.activeItem.orderPushSetting[name] = !$scope.activeItem.orderPushSetting[name];
            };
            /**
             * 保存推单设置
             */
            $scope.setOrderPush = function () {
                currentService.setOrderPush($scope);
            };


    }]);