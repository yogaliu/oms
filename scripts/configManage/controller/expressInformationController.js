/**
 * Created by xs on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("expressInformationController", ["$scope","$rootScope","expressInformationService","toolsService","APP_MENU","ApiService" ,
        function($scope,$rootScope,expressInformationService,toolsService,APP_MENU,ApiService) {
            //页面service
            var currentService = expressInformationService;
            //页面id
            var pageId = "#expressInformation";
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
                    'code' : '', //快递编码
                    'name' : '', //快递名称
                    'isdisabled' : '', //禁用
                    'iscancod' : '', //支持货到付款
                    'isonlycancod' : '', //仅支持货到付款
                    'isusecloudsstack' : '' //支持云栈电子面单
                };
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "排序", tag: 'seq'},
                    {name: "快递编码", tag: 'code'},
                    {name: "快递公司", tag: 'name'},
                    {name: "外部编码", tag: 'warehouseexpresscode'},
                    {name: "电话", tag: 'telephone'},
                    {name: "手机", tag: 'mobile'},
                    {name: "邮箱", tag: 'email'},
                    {name: "地址", tag: 'address'},
                    {name: "备注", tag: 'note'},
                    {name: "快递类型", tag: 'expresstypename'},
                    {name: "支持货到付款", tag: 'iscancod'},
                    {name: "仅支持货到付款", tag: 'isonlycancod'},
                    {name: "支持云栈电子面单", tag: 'isusecloudsstack'}
                ];
                $scope.righttheadList = [
                    {name: "平台名称", tag: 'platformtypename'},
                    {name: "平台快递编码", tag: 'code'}
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
                //平台类型下拉组件
                $scope.platformtypeList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeRightItem.platformtype = obj.id;
                    }
                };
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allPlatformType)){
                        currentService.getPlatformType(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    var list = currentService.allPlatformType;
                    $.each(list,function (index, obj) {
                        obj.id = obj.value;
                    });
                    //平台类型下拉组件 选项赋值
                    $scope.platformtypeList.info = list;
                    //请求页面数据
                    currentService.query($scope);
                });

            }
            init();
            /**
             * 查询条件三种状态切换
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
             * 查关联平台
             */
            $scope.queryExpressPlatform = function (i) {
                $scope.currentIndex = i;
                $scope.queryItem = $.extend({},$scope.tableList[i]);
                currentService.queryExpressPlatform($scope);
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
             * 修改
             */
            $scope.goEditPage = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改',time : 1000});
                }else {
                    $rootScope.params = {
                        'oprate': 'edit',
                        'obj': $scope.tableList[i]
                    };
                    $scope.addTab('快递信息：修改快递信息','../template/configManage/newExpressInformation.html');
                }
            };
            /**
             * 新增
             */
            $scope.goCreatPage = function () {
                $rootScope.params = {
                    'oprate':'creat'
                };
                $scope.addTab('快递信息：新增快递信息','../template/configManage/newExpressInformation.html');
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
             * 修改关联平台弹框显示
             */
            $scope.showRightEditModal = function (i) {
                if($scope.queryItem.isdisabled){
                    toolsService.alertMsg({content : '快递已禁用，暂不可操作',time : 1000});
                }else {
                    $scope.activeRightItem = $.extend({
                        "ExpressId": $scope.queryItem.id,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }, $scope.righttableList[i]);
                    $scope.platformtypeList.setValue({id: $scope.activeRightItem.platformtype});
                    $(pageId + " #editRightModal").modal('show');
                }
            };
            /**
             * 新增关联平台弹框显示
             */
            $scope.showRightCreatModal = function () {
                if($scope.queryItem.isdisabled){
                    toolsService.alertMsg({content : '快递已禁用，暂不可操作',time : 1000});
                }else {
                    $scope.activeRightItem = {
                        "Id": "00000000-0000-0000-0000-000000000000",
                        "CreateDate": "0001-01-01 00:00:00",
                        "Code": "",
                        "ExpressId": $scope.queryItem.id,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    $scope.platformtypeList.init();
                    $(pageId + " #editRightModal").modal('show');
                }
            };
            /**
             * 新增&修改关联平台
             */
            $scope.editRight = function () {
                //判断平台是否存在
                currentService.isExpressPlatformExsits($scope);
            };
            /**
             * 删除关联平台
             */
            $scope.deleteRightItem = function (i) {
                if($scope.queryItem.isdisabled){
                    toolsService.alertMsg({content : '快递已禁用，暂不可新增',time : 1000});
                }else {
                    $scope.activeRightItem = $.extend({}, $scope.righttableList[i]);
                    toolsService.alertConfirm({
                        "msg": "数据删除后不可恢复，是否继续删除？",
                        okBtn: function (index, layero) {
                            currentService.deleteExpressPlatform($scope);
                            layer.close(index);
                        }
                    });
                }
            };

    }]);