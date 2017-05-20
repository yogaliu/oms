/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("adjustBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService","adjustBillService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService,adjustBillService) {

            function init() {
                //高级搜索表单
                $scope.searchForm1 = {
                    productcode: '',
                    schedulecode: '',
                    stockadjustordercode: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //搜索确定
                $scope.search = function () {
                    adjustBillService.VipStockAdjustOrderQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                };

                //搜索清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                };
                //模糊搜索
                $scope.searchKeyup = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };
                // 查询数据
                adjustBillService.VipStockAdjustOrderQuery($scope, 1, 10, 0, true);

                //分页配置
                pageFun();

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

                //跳转页面
                $scope.goOther = function (content, i, e) {
                    var index = $('#adjustBill').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                type: 'add',
                                tableList: ''
                            };
                            $scope.option[index].url = '../template/b2bVIP/addAdjustBill.html';
                            $scope.option[index].name = '唯品调整单：新增唯品调整单';
                            break;
                        case 'modify':
                            if (!$(e.target).closest('li').hasClass('notClick')) {
                                $rootScope.params = {
                                    type: 'modify',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/b2bVIP/addAdjustBill.html';
                                $scope.option[index].name = '唯品调整单：修改唯品调整单';
                            }
                            break;
                        case 'detail':
                            $rootScope.params = {
                                tableList: $scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/b2bVIP/adjustBillDetail.html';
                            $scope.option[index].name = '唯品调整单：唯品调整单详情';
                            break;
                    }
                };

                //表格操作
                $scope.operate = {
                    //审核
                    check: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            adjustBillService.VipStockAdjustOrderAudit($scope, obj);
                        }
                    },
                    //禁用
                    disabled: function (obj,e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            adjustBillService.VipStockAdjustOrderDisabled($scope, obj);
                        }
                    }
                };
            }

            init();

            //分页插件
            function pageFun() {
                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1)) return;

                    $scope.first = itemsPerPage * (currentPage - 1) + 1;
                    if (Math.ceil($scope.paginationConf.totalItems / itemsPerPage) === currentPage) {
                        $scope.last = $scope.paginationConf.totalItems;
                    } else {
                        $scope.last = currentPage * itemsPerPage;
                    }

                };
                //分页配置
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
                        // 查询数据
                        adjustBillService.VipStockAdjustOrderQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0,  false);
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
            };

            //列表配置
            $scope.theadList = [
                {name: "上传库存", tag: 'isUploadInventory'},
                {name: "状态", tag: 'statusName'},
                {name: "调整单号", tag: 'stockadjustordercode'},
                {name: "档期编号", tag: 'schedulecode'},
                {name: "档期名称", tag: 'schedulename'},
                {name: "调整原因", tag: 'adjustreasontypeName'},
                {name: "调整类型", tag: 'adjusttypeName'},
                {name: "制单人", tag: 'createusername'},
                {name: "制单时间", tag: 'createdate'},
                {name: "审核人", tag: ''},
                {name: "审核日期", tag: 'appdate'},
                {name: "备注", tag: 'remark'}
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