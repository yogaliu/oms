/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("matchGoodsBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "matchGoodsBillService", "APP_MENU", "ApiService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, matchGoodsBillService, APP_MENU, ApiService) {

            var indexID = "#matchGoodsBill";

            function init() {
                //高级搜索表单
                $scope.searchForm1 = {
                    begindate: '',
                    enddate: '',
                    schedulecode: '',
                    dispatchordercode: '',
                    pocode: '',
                    productcode: '',
                    status: '',
                    storageno: '',
                    pickingcode: '',
                    sendwarehouseid: '',
                    iscreatebhed: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //三种类型复选框
                $scope.simpleSelect={
                    iscreatebhed:''
                };

                //搜索确定
                $scope.search = function () {
                    matchGoodsBillService.VipDispatchOrderQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
                };

                //搜索清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                    $scope.selectStatus.init();
                    $scope.selectsendwarehouse.init();
                };
                //模糊搜索
                $scope.searchKeyup = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };

                // 查询数据
                matchGoodsBillService.VipDispatchOrderQuery($scope, 1, 10, 0, true);
                //查询仓库
                matchGoodsBillService.WarehouseGet($scope);

                //下拉框组件
                selectFun();

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

                //三种类型的复选框
                $scope.isThreeSel = function (myEvent, type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        switch (type) {
                            case '1':
                                $scope.simpleSelect.iscreatebhed = selType;
                                matchGoodsBillService.VipDispatchOrderQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
                                break;
                        }
                    });
                };


                //跳转页面
                $scope.goOther = function (content, i, e) {
                    var index = $('#matchGoodsBill').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                type: 'add',
                                tableList: ''
                            };
                            $scope.option[index].url = '../template/b2bVIP/addMatchGoodsBill.html';
                            $scope.option[index].name = '唯品配货单：新增唯品配货单';
                            break;
                        case 'modify':
                            if (!$(e.target).closest('li').hasClass('notClick')) {
                                $rootScope.params = {
                                    type: 'modify',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/b2bVIP/addMatchGoodsBill.html';
                                $scope.option[index].name = '唯品配货单：修改唯品配货单';
                            }
                            break;
                        case 'detail':
                            $rootScope.params = {
                                tableList: $scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/b2bVIP/matchGoodsBillDetail.html';
                            $scope.option[index].name = '唯品配货单：唯品配货单详情';
                            break;
                    }
                };

                //选择送货单弹出框
                $scope.sendObj1 = {
                    obj: '',
                    note: '',
                    deliveryordercode: '',
                };
                $scope.sendObj = $.extend(true, {}, $scope.sendObj1);


                //表格操作
                $scope.operate = {
                    //选择送货单
                    selSend: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            $scope.sendObj = $.extend(true, {}, $scope.sendObj1);
                            $(indexID + ' #rightSideModal').show(500);
                            matchGoodsBillService.VipDeliveryOrderGet($scope, obj);
                            $scope.sendObj.obj = obj;
                        }
                    },
                    //生成补货单
                    creatRepair: function () {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            var promise = ApiService.listenAll(function (deffer) {
                                matchGoodsBillService.VipDispatchOrderDetailQuery(deffer, $scope, obj);
                            },function (deffer) {
                                matchGoodsBillService.VipDispatchOrderLogQuery(deffer, $scope, obj);
                            },function (deffer) {
                                matchGoodsBillService.VipDispatchOrderDetailQueryMapping(deffer, $scope, obj);
                            });
                            promise.then(function () {
                                matchGoodsBillService.VipDispatchOrderSave($scope, obj);
                            });
                        }
                    },
                    //匹配异常商品
                    abnormal: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {

                            var promise = ApiService.listenAll(function (deffer) {
                                matchGoodsBillService.VipDispatchOrderDetailQuery(deffer, $scope, obj);
                            },function (deffer) {
                                matchGoodsBillService.VipDispatchOrderLogQuery(deffer, $scope, obj);
                            });
                            promise.then(function () {
                                matchGoodsBillService.VipDispatchOrderReLoadProduct($scope, obj);
                            });
                        }

                    },
                    //完结
                    finish: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            matchGoodsBillService.VipDispatchOrderOrderComplete($scope, obj);
                        }
                    },

                    //关闭
                    close: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            matchGoodsBillService.VipDispatchOrderAbnormalEnd($scope, obj);
                        }
                    }
                };

                //选择送货单侧滑框
                $scope.rightSideObj = {
                    searchText:'',
                    hideModal: function () {
                        $(indexID + ' #rightSideModal').hide(500);
                        $scope.rightSideObj.searchText = '';
                        $.each($scope.tableRightSideList, function (i, obj) {
                            obj.isHide = false;
                        });
                    },
                    search: function () {
                        $.each($scope.tableRightSideList, function (i, obj) {
                            if (JSON.stringify(obj).indexOf($scope.rightSideObj.searchText) != -1) {
                                obj.isHide = false;
                            } else {
                                obj.isHide = true;
                            }
                        });
                    },
                    select: function (obj, e) {
                        $scope.selectDeliveryordercode = obj.deliveryordercode;

                        $(e.target).closest('tbody').find('tr').removeClass('green');
                        $(e.target).closest('tr').addClass('green');
                    },
                    ensure: function () {
                        $scope.sendObj.deliveryordercode = $scope.selectDeliveryordercode;

                        $(indexID + ' #rightSideModal').hide(500);
                        matchGoodsBillService.VipDeliveryAddDispatchOrder($scope, $scope.sendObj.obj);
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
                        matchGoodsBillService.VipDispatchOrderQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
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

            //下拉框组件
            function selectFun() {
                //下拉选框插件 单据状态
                $scope.selectStatus = {
                    isshow: false,
                    info: klwTool.jsonToArray2(APP_MENU.CITdocumentStatus, 'id', 'name'),
                    objName: {id: $scope.searchForm.status},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.status = obj.id;
                    }
                };

                //下拉选框插件 到货仓库
                $scope.selectsendwarehouse = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.sendwarehouseid = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "已完结", tag: 'iscreatebhed'},
                {name: "状态", tag: 'statusName'},
                {name: "店铺名称", tag: 'storename'},
                {name: "配货单号", tag: 'dispatchordercode'},
                {name: "PO单号", tag: 'pocode'},
                {name: "拣货单号", tag: 'pickingcode'},
                {name: "送货单号", tag: 'deliveryordercode'},
                {name: "入库单号", tag: 'storageno'},
                {name: "承运商", tag: 'carriername'},
                {name: "快递单号", tag: 'carriername'},
                {name: "出库仓库", tag: 'warehousename'},
                {name: "到货仓库", tag: 'sendwarehousename'},
                {name: "品牌名称", tag: ''},
                {name: "通知数量", tag: 'noticeqtytotal'},
                {name: "配送方式", tag: 'deliverymethod'},
                {name: "预计到货日期", tag: 'arrivaltime'},
                {name: "制单时间", tag: 'createdate'},
                {name: "备注", tag: 'note'}
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