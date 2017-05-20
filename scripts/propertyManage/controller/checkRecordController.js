/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("checkRecordController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "checkRecordService","validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, checkRecordService,validateService) {

            //当前页面id
            var indexID = '#checkRecord';

            function init() {

                //初始化表单验证
                validateService.initValidate(indexID);

                //搜索内容
                $scope.searchForm1 = {
                    alipayOrderNo: '',
                    typeDesc: '',
                    orderNo: '',
                    storeId: '',
                    beginCreateDate: '',
                    endCreateDate: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                //高级搜索
                $scope.searchObj = function () {
                    checkRecordService.AlipayRecordQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                };
                //模糊搜索
                $scope.dimSearch = function () {
                    if (event.keyCode == 13) {
                        $scope.searchObj();
                    }
                };
                //清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                    $scope.storeName = '请选择活动店铺';
                };

                //下载模态框表单
                $scope.loadForm1 = {
                    startData: '',
                    endData: '',
                    step: 60,
                    storeId: ''
                };
                $scope.loadForm = $.extend(true, {}, $scope.loadForm1);

                //下载模态框
                $scope.downLoadObj = {
                    //下载按钮
                    downLoadFun: function () {
                        $scope.loadForm = $.extend(true, {}, $scope.loadForm1);
                        $(indexID + ' #downloadModal').modal('show');
                        validateService.clearValidateClass(indexID, '#downloadModal');
                        $scope.selectStore.init();
                    },
                    //下载提交
                    downLoatSubmit: function () {
                        if (validateService.validateAll(indexID, '#downloadModal') && $scope.loadForm.storeId ) {
                            checkRecordService.AlipayRecordDownload($scope);
                            $(indexID + ' #downloadModal').modal('hide');
                        }
                    }
                };



                // 查询账单数据
                checkRecordService.AlipayRecordQuery($scope, 1, 10, 0, true);

                // 查询店铺
                checkRecordService.StoreGet($scope);

                //分页
                pageFun();

                //多选店铺插件
                storeFun();

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
                        checkRecordService.AlipayRecordQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
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
            }

            //下拉框组件
            function selectFun(){
                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    validate:true,
                    info: [],
                    objName: {id: $scope.loadForm.storeId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.loadForm.storeId = obj.id;
                    }
                };
            }

            //多选店铺弹出框
            function storeFun() {
                //店铺
                $scope.storeName = '请选择活动店铺';
                //已选店铺列表
                $scope.selectStoreList = [];


                //显示店铺多选弹框
                $scope.showShopModal = function () {
                    $(indexID +" #shopModal").modal('show');

                    $.each($scope.storeList, function (i, obj) {
                        obj.isHide = false;
                    });
                    $scope.storeSearchObj.storeSearch='';
                };

                //店铺搜索
                $scope.storeSearchObj={
                    storeSearch:'',
                    storeSearchFun: function () {
                        $.each($scope.storeList, function (i, obj) {
                            if (obj.code.indexOf($scope.storeSearchObj.storeSearch) != -1 || obj.name.indexOf($scope.storeSearchObj.storeSearch) != -1) {
                                obj.isHide = false;
                            } else {
                                obj.isHide = true;
                            }
                        });
                    }
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
                        $scope.storeName = "请选择活动店铺";
                    }
                    $(indexID+" #shopModal").modal('hide');

                    //存店铺id
                    var storeIdArr=[];
                    $.each($scope.selectStoreList, function (index, obj) {
                        storeIdArr.push(obj.id);
                    });
                    $scope.searchForm.storeId=storeIdArr.join();
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "店铺名称", tag: 'storename'},
                {name: "平台订单号", tag: 'orderno'},
                {name: "账单单号", tag: 'alipayorderno'},
                {name: "支付金额", tag: 'outamount'},
                {name: "收入金额", tag: 'inamount'},
                {name: "业务类型", tag: 'businesstypedesc'},
                {name: "备注", tag: 'memo'},
                {name: "对方账号", tag: 'opuserid'},
                {name: "商户订单号", tag: 'merchantordernocreatedate'},
                {name: "创建时间", tag: 'createdate'},
                {name: "商家账号", tag: 'selfuserid'},
                {name: "子业务类型", tag: 'businesstype'},
                {name: "账务类型", tag: 'typedesc'},
                {name: "账务类型描述", tag: 'type'}
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