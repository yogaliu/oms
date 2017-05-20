/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("presellPlanController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "presellPlanService", "ApiService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, presellPlanService, ApiService) {

            //当前页面id
            var indexID = '#presellPlan';

            //批量操作默认不可点击
            $scope.isZhengque = false;

            function init() {
                //跳转页面
                $scope.goOther = function (content, i) {
                    var index = $('#presellPlan').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                tableList: '',
                                type: 'add'
                            };
                            $scope.option[index].url = '../template/marketingManage/addPresellPlan.html';
                            $scope.option[index].name = '预售计划：新增预售计划';
                            break;
                        case 'modify':
                            $rootScope.params = {
                                tableList: $scope.tableList[i],
                                type: 'modify'
                            };

                            $scope.option[index].url = '../template/marketingManage/addPresellPlan.html';
                            $scope.option[index].name = '预售计划：修改预售计划';
                            break;
                        case 'copy':
                            $rootScope.params = {
                                tableList: $scope.tableList[i],
                                type: 'modify',
                                isCopy: true
                            };

                            $scope.option[index].url = '../template/marketingManage/addPresellPlan.html';
                            $scope.option[index].name = '预售计划：复制预售计划';
                            break;
                        case 'detail':
                            $rootScope.params = {
                                PreSellPlanId: $scope.tableList[i].id,
                                startTime: $scope.tableList[i].begindate,
                                endTime: $scope.tableList[i].enddate,
                                status: $scope.tableList[i].status
                            };
                            $scope.option[index].url = '../template/marketingManage/presellPlanDetail.html';
                            $scope.option[index].name = '预售计划：预售计划详情';
                            break;
                    }
                };

                $scope.searchForm1 = {
                    begindate: '',
                    enddate: '',
                    code: '',
                    skucode: '',
                    storeid: '',
                    status: 1
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //特殊标识行变量
                $scope.simpleSelect = {
                    islisting: '',
                    isdynamic: ''
                };
                //状态
                $scope.statusFun = function () {
                    if ($scope.searchForm.status == 0) {
                        $scope.searchForm.status = 1;
                    } else {
                        $scope.searchForm.status = 0;
                    }
                };
                //搜索
                $scope.search = function () {
                    presellPlanService.PreSellPlanQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                };

                //模糊搜索
                $scope.dimSearch = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };

                // 清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                    //重新渲染店铺下拉框
                    $scope.selectStore.init();
                };


                //批量操作按钮
                $scope.batchBtn = {
                    isshow: false,
                    info: [
                        {name: '审核'},
                        {name: '整单开始预售'},
                        {name: '整单结束预售'}
                    ],
                    objName: {name: '批量操作'},
                    onChange: function (obj, index) {	//点击之后的回调
                        console.log(obj);
                    }
                };
                //操作
                $scope.operate = {
                    //单选
                    selSingle: function (myEvent, index) {
                        $scope.tableList[index].isZhengque = !$scope.tableList[index].isZhengque;

                        //按钮是否高亮
                        if ($(myEvent.target).closest('tbody').find('i.icon-sel-zhengque').length > 0) {
                            $scope.isZhengque = true;
                        } else {
                            $scope.isZhengque = false;
                        }

                        if ($(myEvent.target).closest('tbody').find('i.icon-sel-zhengque').length == $scope.tableList.length) {
                            $(indexID + ' thead').find('.icon-sel').addClass('icon-sel-zhengque');
                        } else {
                            $(indexID + ' thead').find('.icon-sel').removeClass('icon-sel-zhengque');
                        }
                    },
                    //全选
                    selAll: function (myEvent) {

                        if ($(myEvent.target).closest('label').find('i.icon-sel').hasClass('icon-sel-zhengque')) {
                            $(indexID + ' tbody').find('.icon-sel').addClass('icon-sel-zhengque');
                            $.each($scope.tableList, function (i, obj) {
                                obj.isZhengque = true;
                            });
                            $scope.isZhengque = true;
                        } else {
                            $(indexID + ' tbody').find('.icon-sel').removeClass('icon-sel-zhengque');
                            $.each($scope.tableList, function (i, obj) {
                                obj.isZhengque = false;
                            });
                            $scope.isZhengque = false;
                        }
                    },
                    //审核
                    check: function (obj, e) {

                        if (!$(e.target).closest('li').hasClass('notClick')) {

                            var promise = ApiService.listenAll(function (deffer) {
                                presellPlanService.PreSellPlanStoreGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanStoreDetailGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanDetailGet(deffer, $scope, obj);
                            });

                            promise.then(function () {
                                presellPlanService.PreSellPlanExsitPreSellPlanAudit($scope, obj);
                            });

                        }
                    },
                    //禁用
                    disable: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            $scope.disableId = obj;

                            toolsService.alertConfirm({
                                "msg": "活动一旦禁用不能再次启用，确认要禁用活动？",
                                okBtn: function (index, layero) {
                                    var promise = ApiService.listenAll(function (deffer) {
                                        presellPlanService.PreSellPlanStoreGet(deffer, $scope, $scope.disableId);
                                    }, function (deffer) {
                                        presellPlanService.PreSellPlanStoreDetailGet(deffer, $scope, $scope.disableId);
                                    }, function (deffer) {
                                        presellPlanService.PreSellPlanDetailGet(deffer, $scope, $scope.disableId);
                                    });

                                    promise.then(function () {
                                        presellPlanService.PreSellPlanEnabled($scope, $scope.disableId);
                                    });
                                },
                                cancelBtn: function (index, layero) {

                                }
                            });
                        }
                    },
                    //开始预售
                    start: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            var promise = ApiService.listenAll(function (deffer) {
                                presellPlanService.PreSellPlanStoreGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanStoreDetailGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanDetailGet(deffer, $scope, obj);
                            });

                            promise.then(function () {
                                presellPlanService.PreSellPlanExsitPreSellPlanStart($scope, obj);
                            });
                        }
                    },
                    //结束预售
                    end: function (obj, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            var promise = ApiService.listenAll(function (deffer) {
                                presellPlanService.PreSellPlanStoreGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanStoreDetailGet(deffer, $scope, obj);
                            }, function (deffer) {
                                presellPlanService.PreSellPlanDetailGet(deffer, $scope, obj);
                            });

                            promise.then(function () {
                                presellPlanService.PreSellPlanExsitPreSellPlanEnd($scope, obj);
                            });
                        }
                    }

                };

                // 查询数据
                presellPlanService.PreSellPlanQuery($scope, 1, 10, 0, true);

                //查询店铺
                presellPlanService.StoreGet($scope);

                //分页
                pageFun();

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


                //三种类型的复选框
                $scope.isThreeSel = function (myEvent, type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        switch (type) {
                            case '1':
                                $scope.simpleSelect.islisting = selType;
                                break;
                            case '2':
                                $scope.simpleSelect.isdynamic = selType;
                                break;
                        }
                    });
                    presellPlanService.PreSellPlanQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
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
                        presellPlanService.PreSellPlanQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);
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
            function selectFun() {
                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.storeid = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "自动上架", tag: 'islisting'},
                {name: "动态预售", tag: 'isdynamic'},
                {name: "状态", tag: 'statusName'},
                {name: "预售单号", tag: 'code'},
                {name: "开始时间", tag: 'begindate'},
                {name: "结束时间", tag: 'enddate'},
                {name: "留单时间", tag: 'deliverydate'},
                {name: "创建时间", tag: 'createdate'},
                {name: "总预售数量", tag: 'totalpresellquantity'},
                {name: "总销量", tag: 'totalsalesqty'},
                {name: "备注", tag: 'note'}
            ];

            // 标题控制器指令的配置文件
            $scope.allocation = {
                "theadList": $scope.theadList,
                // 指令控制器的ID唯一标识
                "timestamp": null
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function () {
                $("#" + $scope.allocation.timestamp).show();
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