/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("generalClassifyController", ["$scope","ApiService","generalClassifyService","toolsService","APP_MENU","validateService" ,
        function($scope,ApiService,generalClassifyService,toolsService,APP_MENU,validateService) {
            var pageId = "#generalClassify";
            var currentService = generalClassifyService;
            function init(){
                //表格筛选条件
                $scope.formData = {
                    "code":"",
                    "classificationtype":"",
                    "name":""
                };
                //表格配置
                $scope.theadList = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "编码", tag: 'code'},
                    {name: "名称", tag: 'name'},
                    {name: "类别", tag: 'classificationtypename'},
                    {name: "创建时间", tag: 'createdate'},
                    {name: "扩展信息", tag: 'value'},
                    {name: "扩展信息1", tag: 'value1'},
                    {name: "扩展信息2", tag: 'value2'}
                ];
                //配置批量操作菜单
                $scope.menuInfo ={
                    isshow:false,
                    info:[
                        {name:'批量删除'},
                        {name:'批量启用'},
                        {name:'批量禁用'}
                    ],
                    objName:{name:'批量操作'},
                    onChange: function(obj,index){	//点击之后的回调
                        if(index == 0){
                            $scope.batchDeleteItem();
                        }else if(index == 1){
                            $scope.batchEnabledItem();
                        }else if(index == 2){
                            $scope.batchDisabledItem();
                        }
                    }
                };
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
                //加载数据
                currentService.query($scope);
                //当前编辑项
                $scope.activeItem = {};
                //分类
                $scope.classificationtypeList = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.classificationType,"id","name"),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.classificationtype = obj.id;
                    }
                };
                $scope.EditClassificationtypeList = {
                    isshow:false,
                    validate:true,
                    info:klwTool.jsonToArray2(APP_MENU.classificationType,"id","name"),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.classificationtype = obj.id;
                    }
                };
                validateService.initValidate(pageId);
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
             * 搜索
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
                $scope.classificationtypeList.init();
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
             * 删除
             */
            $scope.deleteItem = function (i) {
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
            $scope.batchDeleteItem = function () {
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
             * 新增 初始化弹框
             */
            $scope.newItem = function () {
                $scope.activeItem = {
                    "code": "",
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "name": "",
                    "value": "",
                    "value1": "",
                    "value2": "",
                    "IsDisabled": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                $scope.EditClassificationtypeList.init();
                validateService.clearValidateClass(pageId,"#editModal");
                $(pageId + " #editModal").modal('show');
            };
            /**
             * 修改 初始化弹框
             */
            $scope.editItem = function (i) {
                if($scope.tableList[i].isdisabled){
                    toolsService.alertMsg({content : '数据已禁用，暂不可修改!',time : 1000});
                }else {
                    $scope.activeItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.tableList[i]);
                    $scope.EditClassificationtypeList.setValue({id:$scope.activeItem.classificationtype});
                    validateService.clearValidateClass(pageId,"#editModal");
                    $(pageId + " #editModal").modal('show');
                }
            };
            /**
             * 新增&修改
             */
            $scope.saveEditItem = function () {
                if(validateService.validateAll(pageId,"#editModal")){
                    currentService.newItem($scope);
                }
            };






    }]);