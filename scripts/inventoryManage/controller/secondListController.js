/**
 * Created by lc on 2017/3/15.
 * 库存管理换入单业务逻辑
 */
angular.module("klwkOmsApp")
    .controller("secondListController", ["$scope","$rootScope" ,"secondListService","APP_MENU","APP_DATA","toolsService",function($scope,$rootScope,secondListService,APP_MENU,APP_DATA,toolsService) {
        var pageId = '#secondList';

        /*初始化筛选条件*/
        $scope.formData={
            productCode :$scope.productCode,
            skuCode :$scope.skuCode,
            beginCreateDate :$scope.beginCreateDate,
            endCreateDate :$scope.endCreateDate,
            loanUser :$scope.loanUser,
        };


        //初始化借出单列表配置
        $scope.columnList = [
            {name: "借用人", tag: 'loanUser'},
            {name: "商品编码", tag: 'productCode'},
            {name: "商品名称", tag: 'productName'},
            {name: "规格编码", tag: 'skuCode'},
            {name: "规格名称", tag: 'skuName'},
            {name: "借出数量", tag: 'outQuantity'},
            {name: "已还数量", tag: 'returnQuantity'},
            {name: "未还数量", tag: 'unReturnQuantity'},
            {name: "超期数量", tag: 'overdueQuantity'}
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
                        secondListService.queryLoanAnalysis($scope);
                    }else{
                        $scope.last = currentPage * itemsPerPage;
                        secondListService.queryLoanAnalysis($scope);
                    };
                } ,
                onChange: function(){	//操作之后的回调
                    secondListService.queryLoanAnalysis($scope);
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

            /*查询列表*/
            secondListService.queryLoanAnalysis($scope);


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
             * 清空高级搜索
             */
            $scope.clearOnly = function () {
                $scope.formData = {};
                $scope.storeName = '请选择...';
                $scope.pullInfo.init();

            };

            /*高级搜索确认*/
            $scope.advanceSearch = function () {
                secondListService.queryLoanAnalysis($scope);
            };
        }
        init();
        eventBind();

    }]);