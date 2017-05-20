/**
 * Created by jx on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("handworkVerificationController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "handworkVerificationService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, handworkVerificationService) {

            var indexID = '#handworkVerification';

            function init() {
                //搜索字段
                $scope.searchForm1 = {
                    systemStoreId: '',
                    otherStoreId: '',
                    systemEnd: '',
                    systemStart: '',
                    checkEnd: '',
                    checkStart: '',
                    orderno: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //列表配置
                $scope.theadList1 = [
                    {name: "单据类型", tag: 'verifiTypeName'},
                    {name: "单据编号", tag: 'code'},
                    {name: "平台订单号", tag: 'tradeId'},
                    {name: "数量", tag: 'quantity'},
                    {name: "金额", tag: 'amount'},
                    {name: "补款金额", tag: 'fillamount'},
                    {name: "退款金额", tag: 'refunamount'},
                    {name: "备注", tag: 'remark'}
                ];

                //列表配置
                $scope.theadList2 = [
                    {name: "单据类型", tag: 'verifiTypeName'},
                    {name: "支付平台订单号", tag: 'orderCode'},
                    {name: "平台订单号", tag: 'tradeId'},
                    {name: "金额", tag: 'amount'}
                ];

                //搜索
                $scope.search = function (e) {
                    if(!$(e.target).closest('.btn-success').hasClass('disabledBtn')){
                        handworkVerificationService.VerifivationQueryOtherOrder($scope,true);
                        handworkVerificationService.VerifivationQuerySystemOrder($scope,true);
                    }
                };
                //清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                    //重新渲染店铺下拉框
                    $scope.selectStore.init();
                    $scope.selectStore2.init();
                };
                //核销
                $scope.verificationFun = function () {
                    handworkVerificationService.VerifivationManualVerifi($scope);
                };

                // 查询店铺
                handworkVerificationService.StoreGet($scope);

                //分页
                //pageFun();

                //下拉框组件
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
                $scope.paginationConf1 = {
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
                        verificationManageService.VerifivationQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
                    }
                };
                $scope.first= 1;
                $scope.last = $scope.paginationConf1.itemsPerPage;

                //分页配置
                $scope.paginationConf2 = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 500,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function () {	//操作之后的回调
                        // 查询数据
                        verificationManageService.VerifivationQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
                    }
                };
                $scope.first= 1;

                $scope.last = $scope.paginationConf2.itemsPerPage;

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
            }

            function selectFun(){
                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    info: [],
                    objName: {id: $scope.searchForm.systemStoreId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.systemStoreId = obj.id;
                    }
                };
                //下拉选框插件 店铺2
                $scope.selectStore2 = {
                    isshow: false,
                    info: [],
                    objName: {id: $scope.searchForm.otherStoreId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.otherStoreId = obj.id;
                    }
                };
            }

            //配置时间控件
            $(indexID + ' .dateTime').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn: 1,
                language: 'zh-CN'
            });
            // 点击触发时间控件
            $scope.showDatetimePick = function (myevent) {
                $(myevent.target).datetimepicker('show');
            };
        }]);