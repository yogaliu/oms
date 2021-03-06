/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .controller("transferNoticeController", ["$scope", "$rootScope", "transferNoticeService", "toolsService","APP_MENU",
        function ($scope, $rootScope, transferNoticeService, toolsService,APP_MENU) {
            var pageId = "#transferNotice";  //页面id
            function init() {
                // 调拨通知单列表配置
                $scope.theadList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "计划单号", tag: 'allocationplancode'},
                    {name: "出库单号", tag: 'code'},
                    {name: "调出仓库", tag: 'outwarehousename'},
                    {name: "占用仓库", tag: 'virtualwarehousename'},
                    {name: "调入仓库", tag: 'inwarehousename'},
                    {name: "调拨类型", tag: 'allocationtypename'},
                    {name: "制单人", tag: 'createuser'},
                    {name: "制单时间", tag: 'createdate'},
                    {name: "备注", tag: 'remark'}
                ];
                transferNoticeService.query($scope,1,10);
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList": $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp": 'transferNoticeConfig'
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                //获取仓库
                transferNoticeService.getWarehouse($scope);
                // 调入仓库
                $scope.warehouseIn = 'radio';
                $scope.radioInWarehouse = {
                    'status':'selecting'
                };
                // 调出仓库
                $scope.warehouseOut = 'radio';
                $scope.radioOutWarehouse = {
                    'status':'selecting'
                };
                // 获取单据状态
                $scope.status = APP_MENU.inventoryChallengeNoticeStatus;
                $scope.radioReceipts = {
                    'status': 'selecting'
                };
                // 调拨类型初始化
                transferNoticeService.transferType($scope);
                $scope.radioType = {
                    'status': 'selecting'
                };
                // 选中的长度,若长度为0,则不显示高级搜索配置
                $scope.num = [];
                // 搜索项
                $scope.searchItem = {};
                //当前编辑项
                $scope.activeItem = {};
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
                    transferNoticeService.query($scope,1,10,1);
                }
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    transferNoticeService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.num = [];
                    $scope.radioInWarehouse.status = 'selecting';
                    $scope.radioOutWarehouse.status = 'selecting';
                    $scope.radioReceipts.status = 'selecting';
                    $scope.radioType.status = 'selecting';
                }
            };

            //对列举项的操作切换(单选&多选&更多)
            $scope.module = function (module,type,data,wordData) {
                $scope[module] = type;
                // 还原数据
                $scope[data] = $scope[wordData]['data'];
            };

            // 筛选条件关闭
            $scope.closeSelect = function (module,item,type,data,wordData) {
                $scope[module] = {
                    'status': 'selecting',
                    'content': ''
                };
                // 默认显示单选状态
                $scope[type] = 'radio';
                $scope.searchItem[item] = '';
                $scope.num.pop();
                // 还原数据
                $scope[data] = $scope[wordData]['data'];
            };

            // 单选公用方法
            $scope.radioList = function (module, item, name, id) {
                $scope[module] = {
                    'status': 'selected',
                    'content': name
                };
                if(item == 'status') {
                    if(name == '已关闭') {
                        id = 9;
                    }
                }
                // 搜索项传入后台数据
                $scope.searchItem[item] = id;
                $scope.num.push(Math.random());
            };

            // 字母查询
            $scope.singleWordQuery = function (name, module, data, e) {
                $scope[data] = $scope[module]['data'];  // 将数据还原
                $(e.target).closest('span').addClass('current').siblings().removeClass('current');
                if (name == '全部') {
                    $scope[data] = $scope[module]['data'];
                } else {
                    $scope[data] = $scope[module][name];
                }
            };

            // 搜索查询
            $scope.singleWordSearch = function (field, module,data) {
                $(pageId + ' .wordSearch span').removeClass('current');
                // 还原数据
                $scope[data] = $.extend(true,[],$scope[module]['data']);
                $.each($scope[data],function (index,obj) {
                    if (JSON.stringify(obj.name).indexOf(field) != -1) {
                        obj.isHide = false;
                    } else {
                        obj.isHide = true;
                    }
                });
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function () {
                $("#" + $scope.allocation.timestamp).show();
            };

            //关闭
            $scope.singleEnd = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0 || $scope.activeItem.status == 0) {
                    transferNoticeService.end($scope);
                } else {
                    toolsService.alertMsg({content: '已出库,已入库的单据不能关闭操作!', time: 1000});
                }

            };

            //通知单详情
            $scope.detail = function (i) {
                $rootScope.transferNoticeParams = {
                    data: $scope.tableList[i]
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/noticeOrderDetail.html';
                $scope.option[index].name = '调拨通知单：通知单详情';
            };


            //新增通知单
            $scope.add = function () {
                $rootScope.transferNoticeParams = {
                    type:'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/newNoticeOrder.html';
                $scope.option[index].name = '调拨通知单：新增调拨通知单';
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

            /*调拨通知单分页*/
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
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    transferNoticeService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
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
        }]);