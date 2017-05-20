/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("checkBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "checkBillService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, checkBillService) {

            var indexID='#checkBill';

            function init() {
                //高级搜索表单
                $scope.searchForm1 = {
                    schedulebegindate: '',
                    scheduleenddate: '',
                    pocode: '',
                    storeid: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                var schedulebegindate=new Date().getBeforeDate(7)[new Date().getBeforeDate(7).length-1].format('YYYY-MM-DD')|| Date.prototype.format;
                var scheduleenddate=new Date().getAfterDate(1)[0].format('YYYY-MM-DD')|| Date.prototype.format;
                $scope.searchForm.schedulebegindate=schedulebegindate;
                $scope.searchForm.scheduleenddate=scheduleenddate;

                //搜索确定
                $scope.search = function () {
                    checkBillService.VVipAccountBillQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, true);
                };

                //搜索清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                    $scope.storeName = '请选择店铺名称';
                    $scope.selectStoreList = [];
                };

                // 查询店铺
                checkBillService.StoreGet($scope);

                //分页配置
                pageFun();
                //店铺
                storeFun();
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
                        checkBillService.VVipAccountBillQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
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

            //店铺插件
            function storeFun() {
                //店铺
                $scope.storeName = '请选择店铺名称';
                //已选店铺列表
                $scope.selectStoreList = [];

                //显示店铺多选弹框
                $scope.showShopModal = function () {
                    $(indexID + " #shopModal").modal('show');
                };
                /**
                 * 选择单个店铺
                 */
                $scope.selectOneStore = function (e, i) {
                    var obj = $(e.target);
                    if (obj.closest('.tr').find('.klwk-check-x').length > 0) {
                        $scope.selectStoreList.removeByValue($scope.storeList[i]);
                    } else {
                        $scope.selectStoreList.push($scope.storeList[i]);
                    }
                };

                /**
                 * 删除单个店铺
                 */
                $scope.deleteOneStore = function (i) {
                    $scope.selectStoreList.removeByValue($scope.selectStoreList[i]);
                };
                /**
                 * 是否存在于已选店铺列表中
                 */
                $scope.isInSelectStoreList = function (item) {
                    if ($scope.selectStoreList.contains(item) < 0) {
                        return false;
                    } else {
                        return true;
                    }
                };
                /**
                 * 选择店铺 确认
                 */
                $scope.showStores = function () {
                    if ($scope.selectStoreList.length > 0) {
                        $scope.storeName = "";
                        $.each($scope.selectStoreList, function (index, obj) {
                            $scope.storeName += obj.name + ';';
                        })
                    } else {
                        $scope.storeName = "请选择店铺名称";
                    }
                    $(indexID +" #shopModal").modal('hide');

                    var storeids = [];
                    //存店铺id
                    $.each($scope.selectStoreList, function (index, obj) {
                        storeids.push(obj.id);
                    });
                    $scope.searchForm.storeid = storeids.join();
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "店铺名称", tag: 'storeName'},
                {name: "PO单号", tag: 'poCode'},
                {name: "档期开始时间", tag: 'scheduleBeginDate'},
                {name: "档期结束时间", tag: 'scheduleEndDate'},
                {name: "发货金额", tag: 'deliveryAmt'},
                {name: "退货金额", tag: 'returnAmt'},
                {name: "应收金额", tag: 'receivableAmt'},
                {name: "账单收入", tag: 'inAmt'},
                {name: "账单支出", tag: 'outAmt'},
                {name: "实收金额", tag: 'receivedAmt'},
                {name: "差异", tag: 'diffAmt'},
                {name: "进度", tag: 'receivedRate'}
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

            //配置时间控件
            $(indexID+' .dateTime').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn:1,
                language: 'zh-CN'
            });
            // 点击触发时间控件
            $scope.showDatetimePick = function(myevent){
                $(myevent.target).datetimepicker('show');
            };
        }]);