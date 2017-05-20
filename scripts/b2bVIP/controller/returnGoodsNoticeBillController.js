/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnGoodsNoticeBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService","returnGoodsNoticeBillService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService,returnGoodsNoticeBillService) {

            function init() {

                //高级搜索表单
                $scope.searchForm1 = {
                    begindate: '',
                    enddate: '',
                    returnordercode: '',
                    vipreturnordernoticecode: '',
                    signusername: '',
                    inwarehousename: '',
                    inwarehouseid: '',
                    productcode: '',
                    vipreturnordercode: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //搜索确定
                $scope.search = function () {
                    returnGoodsNoticeBillService.VipReturnOrderNoticeQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                };

                //搜索清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                    $scope.selectInWareHouse.init();
                };
                //模糊搜索
                $scope.searchKeyup = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };
                // 查询数据
                returnGoodsNoticeBillService.VipReturnOrderNoticeQuery($scope, 1, 10, 0, [], true);
                //查询仓库
                returnGoodsNoticeBillService.WarehouseGet($scope);

                //分页配置
                pageFun();

                //下拉框
                selectFun();

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

                //下拉框选择
                $scope.comboBoxSel = function (key, content) {
                    switch (key) {
                        //签收仓库选择
                        case 'house':
                            $scope.searchForm.inwarehouseid = content;
                            break;
                    }
                };

                //跳转页面
                $scope.goOther = function (content, i, e) {
                    var index = $('#returnGoodsNoticeBill').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'detail':
                            $rootScope.params = {
                                tableList: $scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/b2bVIP/returnGoodsNoticeBillDetail.html';
                            $scope.option[index].name = '唯品退货通知单：唯品退货通知单详情';
                            break;
                    }
                };

                //表格操作
                $scope.operate = {

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
                        returnGoodsNoticeBillService.VipReturnOrderNoticeQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0,  false);
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
            
            function selectFun(){
                //下拉选框插件 签收仓库
                $scope.selectInWareHouse = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.inwarehouseid = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "状态", tag: 'statusName'},//3 已生成通知单  2 已签收  1 已审核
                {name: "唯品退供单号", tag: 'vipreturnordercode'},
                {name: "退供单号", tag: 'returnordercode'},
                {name: "通知单号", tag: 'vipreturnordernoticecode'},
                {name: "退供仓库", tag: 'warehousename'},
                {name: "单据类型", tag: 'returntype'},//3 三退
                {name: "制单时间", tag: 'createdate'},
                {name: "出仓时间", tag: 'outdate'},
                {name: "签收仓库", tag: 'inwarehousename'},
                {name: "签收类型", tag: 'returnsigntype'},//0 未签收  1  正常签收
                {name: "签收时间", tag: 'signdate'},
                {name: "签收人", tag: 'signusername'},
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

            //配置时间控件
            $('#returnGoodsNoticeBill .dateTime').datetimepicker({
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