/**
 * Created by lc on 2017/3/15.
 * 库存管理换入单业务逻辑
 */
angular.module("klwkOmsApp")
    .controller("loanInController", ["$scope","$rootScope" ,"loanInService","APP_MENU","APP_DATA","toolsService",function($scope,$rootScope,loanInService,APP_MENU,APP_DATA,toolsService) {

        var pageId = '#lendIn';
        //已选店铺名
        $scope.storeName = '请选择...';
        //全部店铺列表
        $scope.storeList = [];
        //已选店铺列表
        $scope.selectStoreList = [];
        /*选中的借出单*/
        $scope.loanObj = ''
        /*选中的借出单明细*/
        $scope.loanDetailList = [];
        /*修改及延迟通知禁用标识*/
        $scope.isDisabled = true;
        /*初始化筛选条件*/
        $scope.formData={
            code :$scope.code,
            productCode :$scope.productCode,
            skuCode :$scope.skuCode,
            warehouseId :'',
            beginCreateDate :$scope.beginCreateDate,
            endCreateDate :$scope.endCreateDate,
            status :$scope.status,
            loanUser :$scope.loanUser,
        };


        //初始化借出单列表配置
        $scope.columnList = [
            {name: "单据编码", tag: 'code'},
            {name: "状态", tag: 'statusText'},
            {name: "借用人", tag: 'loanuser'},
            {name: "入库仓库", tag: 'warehousename'},
            {name: "制单人", tag: 'createuser'},
            {name: "制单日期", tag: 'createdate'},
            {name: "审核人", tag: 'audituser'},
            {name: "审核日期", tag: 'auditdate'},
            {name: "备注", tag: 'note'}
        ];

        //初始化借出单商品配置
        $scope.productColumnList = [
            {name: "商品编码", tag: 'productcode'},
            {name: "商品名称", tag: 'productname'},
            {name: "规格编码", tag: 'code'},
            {name: "规格名称", tag: 'description'},
            {name: "归还数量", tag: 'returnquantity'},
            {name: "入库数量", tag: 'inquantity'},
            {name: "仓库入库时间", tag: 'warehousestoragetime'}
        ];

        //进入页面需要执行的方法
        function init(){
            /*初始化默认隐藏高级搜索*/
            $scope.advance = false;

            /*初始分页*/
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [10,20, 50, 100, 500,1000],  //配置配置可选择每页显示记录数 array
                extClick : false , //当为外部点击翻页时为true
                type: 0 ,  // 上一页0  下一页1
                getPageIndex:function (currentPage,itemsPerPage) {
                    $scope.first = itemsPerPage * (currentPage-1) +1;
                    if($scope.paginationConf.totalItems / itemsPerPage  === currentPage){
                        $scope.last = $scope.paginationConf.totalItems;
                        loanInService.queryLoanIn($scope);
                    }else{
                        $scope.last = currentPage * itemsPerPage;
                        loanInService.queryLoanIn($scope);
                    };
                } ,
                onChange: function(){	//操作之后的回调
                    loanInService.queryLoanIn($scope);
                }
            };

            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;
            //外部上一页
            $scope.prev = function () {
                $scope.paginationConf.currentPage--;
                $scope.paginationConf.type = 0 ;
                $scope.paginationConf.extClick = true;

            };
            //外部下一页
            $scope.next = function () {
                $scope.paginationConf.currentPage++;
                $scope.paginationConf.type = 1 ;
                $scope.paginationConf.extClick = true;
            };


            //初始化仓库
            loanInService.queryWarehouse($scope);

            //初始化借入单状态
            $scope.pullInfo = {
                isshow:false,
                info:klwTool.jsonToArray2(APP_MENU.inventoryAlsoInStatus,'id','name'),
                onChange: function(obj,index){	//点击之后的回调
                    $scope.loanStatus = obj.id;
                    $scope.formData.status = obj.id;
                }
            };

            $(pageId + ' #beginCreateDate').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn:1,
                language: 'zh-CN'
            });

            $(pageId + ' #endCreateDate').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn:1,
                language: 'zh-CN'
            });


            //列信息修改配置
            $scope.allocation = {
                "theadList" : $scope.columnList,
                // 指令控制器的ID唯一标识
                "timestamp" : null
            };

            $scope.$watch('columnList',function () {
                $scope.allocation.listObj2 =  $scope.columnList;
            });
        }
        /*页面元素绑定事件*/
        function eventBind() {

            //列表配置Hover函数
            $scope.listAllocationHover = false;
            $scope.isHover = function () {
                $scope.listAllocationHover = !$scope.listAllocationHover;
            };

            $scope.listAllocation = function () {
                $("#"+$scope.allocation.timestamp).show();
            },


            /**
             * 高级搜索显示隐藏
             */
            $scope.showAdvance = function () {
                $scope.advance = !$scope.advance;
            };

            /**
             * 店铺是否被全选
             */
            $scope.isAllStoreList = function() {
                if($scope.selectStoreList.length == $scope.storeList.length){
                    return true;
                }else{
                    return false;
                };
            };
            /**
             * 显示店铺多选弹框
             */
            $scope.showShopModal = function () {
                $(pageId + " #shopModal").modal('show');
            };

            /**
             * 选择单个店铺
             */
            $scope.selectOneStore = function (i) {
                var item = $scope.storeList[i];
                if($scope.selectStoreList.contains(item) >= 0){
                    $scope.selectStoreList.removeByValue(item);
                }else{
                    $scope.selectStoreList.push(item);
                };
            };

            /**
             * 选择所有店铺
             */
            $scope.selectAllStore = function () {
                if($scope.selectStoreList.length == $scope.storeList.length){
                    $scope.selectStoreList = [];
                }else {
                    var list = $.extend([],$scope.storeList);
                    $scope.selectStoreList = list;
                };
            };

            /**
             * 是否存在于已选店铺列表中
             */
            $scope.isInSelectStoreList = function (item) {
                if($scope.selectStoreList.contains(item) < 0){
                    return false;
                }else{
                    return true;
                };
            };

            /**
             * 删除单个店铺
             */
            $scope.deleteOneStore = function (i) {
                $scope.selectStoreList.removeByValue($scope.selectStoreList[i]);
            };

            /**
             * 选择店铺 确认
             */
            $scope.showStores = function () {
                if($scope.selectStoreList.length > 0){
                    $scope.storeName = "";
                    $scope.formData.warehouseId = "";
                    $.each($scope.selectStoreList,function (index, obj) {
                        if(index == $scope.selectStoreList.length -1 ){
                            $scope.storeName += obj.name;
                            $scope.formData.warehouseId += obj.id;
                        }else{
                            $scope.formData.warehouseId += obj.id +';'
                            $scope.storeName += obj.name + ';';
                        };

                    });
                }else{
                    $scope.storeName = "请选择...";
                    $scope.formData.warehouseId = '';
                };
                $(pageId + " #shopModal").modal('hide');
            };

            $scope.clearOnly = function () {
                $scope.formData = {};
                $scope.storeName = '请选择...';
                $scope.pullInfo.init();

            };

            /*获取当前选项的商品详情*/
            $scope.getProductDetail = function (obj) {
                /*保存当前选中的借出单*/
                $scope.loanObj = obj;
                if(obj.status === 0){
                    $scope.isDisabled = false;
                }else{
                    $scope.isDisabled = true;
                }
                loanInService.queryLoanDetail($scope,obj);
            };

            /*高级搜索确认*/
            $scope.advanceSearch = function () {
                loanInService.queryLoanIn($scope);
            };

            /*新增还入单*/
            $scope.addLoan = function (name,url) {
                /*清空修改项*/
                APP_DATA.loanObj = {};
                $scope.addTab(name,url);
            };

            /*作废借出单*/
            $scope.Invalid = function () {
                toolsService.alertConfirm({
                    msg:"确认要作废此单?",
                    okBtn : function(index, layero){
                        loanInService.Invalid($scope.loanObj,$scope.loanDetailList);
                    },
                });
            };

            /*通知仓库*/
            $scope.noticeWarehouse = function () {
                /*检验是否有库存*/
                loanInService.audit($scope,$scope.loanObj,$scope.loanDetailList);
            };

            /*修改还入单*/
            $scope.updateLoan = function (name,url) {
                APP_DATA.loanObj = {
                    "loan":$scope.loanObj,
                    "loanDetail" : $scope.loanDetailList
                }
                $scope.addTab(name,url);
            }
        }
        init();
        eventBind();
    }]);