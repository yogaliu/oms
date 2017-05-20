/**
 * Created by jx on 2017/3/17.
 */
/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("platformCheckController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService","platformCheckService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService,platformCheckService) {

            function init() {
                //加载下拉框
                $('#platformCheck').selectPlug();

                //查询平台对账单数据
                platformCheckService.AlipayRecordReportQuery($scope,true);

                //查询店铺
                //platformCheckService.StoreGet($scope);


                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage,itemsPerPage) {
                    //超出页码范围 return
                    if(currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1 )) return;

                    $scope.first = itemsPerPage * (currentPage-1) +1;
                    if(Math.ceil($scope.paginationConf.totalItems / itemsPerPage)  === currentPage){
                        $scope.last = $scope.paginationConf.totalItems;
                    }else{
                        $scope.last = currentPage *  itemsPerPage;
                    }

                };

                //分页配置
                $scope.paginationConf = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 500,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function () {	//操作之后的回调
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


                //高级搜索
                $scope.advancedSearchObj1 = {
                    //是否展开高级搜索，默认不展开
                    advancedSearch: false,

                    //是否展开制单时间，默认不展开
                    timeShow: false,

                    //制单时间的展开/收起
                    timeText: '展开',

                    //高级搜索更多展开
                    moreShow: false,

                    //高级搜索多选复选框
                    moreSel: false,

                    //高级搜索show函数
                    isShow: function (content, myEvent) {
                        toolsService.isShow($scope, content, myEvent);
                    },

                    //制单时间show函数
                    isTimeShow: function () {
                        toolsService.isTimeShow($scope);
                    },

                    //高级搜索更多显示
                    isMoreShow: function (moreContent, myEvent) {
                        toolsService.isMoreShow($scope, moreContent, myEvent);
                    },

                    //高级搜索多选显示复选框
                    isMoreSelShow: function (moreSelContent) {
                        toolsService.isMoreSelShow($scope, moreSelContent);
                    }
                };

                $scope.advancedSearchObj = $.extend(true, {}, $scope.advancedSearchObj1);

                //复选框默认不勾选
                $scope.labelSel = false;

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };
            }

            init();

            //列表配置
            $scope.theadList = [
                {name: "是否核销", tag: 'isverified'},
                {name: "订单日期", tag: 'ordertime'},
                {name: "店铺名称", tag: 'storename'},
                {name: "平台订单号", tag: 'tradeid'},
                {name: "系统订单号", tag: 'ordercode'},
                {name: "订单金额", tag: 'orderamount'},
                {name: "到账时间", tag: 'indate'},
                {name: "收入金额", tag: 'inamount'},
                {name: "佣金", tag: 'tmallamount'},
                {name: "返点", tag: 'integralamount'},
                {name: "服务费", tag: 'creditamount'},
                {name: "保险", tag: 'quickamount'},
                {name: "扣款总额", tag: 'outsumamount'},
                {name: "结算金额", tag: 'actualamount'}
            ];

            // 标题控制器指令的配置文件
            $scope.allocation = {
                "theadList" : $scope.theadList,
                // 指令控制器的ID唯一标识
                "timestamp" : null
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };

        }]);