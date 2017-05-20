/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("presentTacticsController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "presentTacticsService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, presentTacticsService) {

            //当前页面id
            var indexID = '#presentTactics';

            //批量操作默认不可点击
            $scope.isZhengque = false;

            function init() {
                //跳转页面
                $scope.goOther = function (content, i, e) {
                    var index = $(indexID).closest('[data-index]').attr('data-index');

                    if (!$(e.target).closest('li').hasClass('notClick')) {
                        switch (content) {
                            case 1:
                                $rootScope.params = {
                                    type: 'modify',
                                    types: 'modifyBuy',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsBuy.html';
                                $scope.option[index].name = '赠品策略：修改策略';
                                break;

                            case 2:
                                $rootScope.params = {
                                    type: 'modify',
                                    types: 'modifyFull',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsBuy.html';
                                $scope.option[index].name = '赠品策略：修改策略';
                                break;

                            case 3:
                                $rootScope.params = {
                                    type: 'modify',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsLuckyBag.html';
                                $scope.option[index].name = '赠品策略：修改策略';
                                break;

                            case 'detail':
                                $rootScope.params = {
                                    id: $scope.tableList[i].id,
                                    type: $scope.tableList[i].activitystrategytype
                                };
                                $scope.option[index].url = '../template/marketingManage/presentTacticsDetail.html';
                                $scope.option[index].name = '赠品策略：策略详情';
                                break;
                        }

                    }
                };

                //高级搜索input框内容
                $scope.searchForm1 = {
                    activity: '',
                    merchandise: '',
                    create1: '',
                    create2: '',
                    send: '',
                    storeId: '',
                    end1: '',
                    end2: '',
                    status: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //特殊标识行变量
                $scope.simpleSelect = {
                    isSuperposition: ''
                };

                //搜索
                $scope.search = function () {
                    presentTacticsService.ActivityStrategyGet($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
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
                    $(indexID + ' .searchItemStatus').find('i.icon-sel').removeClass('icon-sel-zhengque');

                    //重新渲染店铺下拉框
                    $scope.selectStore.init();
                };

                $scope.modify = {};
                //操作
                $scope.operate = {
                    //单选
                    selSingle: function (myEvent, index) {
                        $scope.tableList[index].isZhengque = !$scope.tableList[index].isZhengque;

                        //开始活动/结束活动按钮是否高亮
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
                    //暂停
                    stop: function (i, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            presentTacticsService.ActivityStrategyStop($scope, i);
                        }
                    },
                    //启用
                    start: function (i, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            presentTacticsService.ActivityStrategyStart($scope, i);
                        }
                    },
                    //禁用
                    disable: function (i, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            $("#presentTactics #disableModal").modal('show');
                            $scope.disableId = i;
                        }
                    },
                    //禁用确定
                    disableSubmit: function () {
                        presentTacticsService.ActivityStrategyDisable($scope, $scope.disableId);
                    },
                    //修改排序
                    changeSeq: function (i, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            $("#presentTactics #changeSeqModal").modal('show');
                            $scope.modify.tableList = $.extend(true, {}, $scope.tableList[i]);
                            presentTacticsService.ActivityStrategyConditionGet($scope);
                            presentTacticsService.ActivityStrategyStoreGet($scope);
                            presentTacticsService.ActivityStrategyProductGet($scope);
                            presentTacticsService.ActivityStrategySendProductGet($scope);
                        }
                    },
                    //修改排序保存
                    changeSeqSubmit: function () {
                        presentTacticsService.ActivityStrategySave($scope);
                    }
                };


                //列表数据
                presentTacticsService.ActivityStrategyGet($scope, 1, 10, 0, true);
                //店铺查询
                presentTacticsService.StoreGet($scope);

                //分页
                pageFun();

                //下拉框组件
                selectFun();

                //时间下拉框
                $(indexID).selectPlug();

                //批量操作
                $scope.batchBtn = {
                    isshow: false,
                    info: [
                        {name: '暂停'},
                        {name: '启用'},
                        {name: '禁用'}
                    ],
                    objName: {name: '批量操作'},
                    onChange: function (obj, index) {	//点击之后的回调
                        console.log(obj);
                    }
                };

                //新增页面按钮
                $scope.addBtn = {
                    isshow: false,
                    info: [
                        {name: '新增买就送'},
                        {name: '新增满就送'},
                        {name: '新增福袋'}
                    ],
                    objName: {name: '新增策略'},
                    onChange: function (obj, i) {	//点击之后的回调
                        console.log(obj);
                        var index = $(indexID).closest('[data-index]').attr('data-index');
                        switch (i) {
                            case 0:
                                $rootScope.params = {
                                    type: 'addBuy'
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsBuy.html';
                                $scope.option[index].name = '赠品策略：新增买就送';
                                break;
                            case 1:
                                $rootScope.params = {
                                    type: 'addFull'
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsBuy.html';
                                $scope.option[index].name = '赠品策略：新增满就送';
                                break;
                            case 2:
                                $rootScope.params = {
                                    type: 'add'
                                };
                                $scope.option[index].url = '../template/marketingManage/addTacticsLuckyBag.html';
                                $scope.option[index].name = '赠品策略：新增福袋';
                                break;
                        }
                    }
                };

                //高级搜索
                $scope.advancedSearchObj1 = {
                    //是否展开高级搜索，默认不展开
                    advancedSearch: false,

                    //是否展开制单时间，默认不展开
                    timeShow: false,

                    //制单时间的展开/收起
                    timeText: '展开',

                    timeItem: '1',

                    timeItemSel: function (text) {
                        $scope.advancedSearchObj.timeItem = text;
                    },

                    //高级搜索更多展开
                    moreShow: false,

                    //高级搜索多选复选框
                    moreSel: false,

                    //高级搜索show函数
                    isShow: function (content, myEvent) {
                        toolsService.isShow($scope, content, myEvent);
                        //取消
                        if (myEvent && content == 'false') {
                            $(myEvent.target).closest('#advancedSearch').find('.store').html('请选择店铺名称');
                        }
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
                $scope.isLabelSel = function (myEvent, isSingle) {
                    //高级搜索中的状态选择（单选）
                    if (isSingle && !$(myEvent.target).closest('label').find('i.icon-sel').hasClass('icon-sel-zhengque')) {
                        $scope.searchForm.status = $(myEvent.target).closest('label').find('span').attr('data-status');
                    } else {
                        $scope.searchForm.status = '';
                    }

                    toolsService.isLabelSel($scope, myEvent, isSingle);
                };

                //三种类型的复选框
                $scope.isThreeSel = function (myEvent, type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        switch (type) {
                            case '1':
                                $scope.simpleSelect.isSuperposition = selType;
                                break;
                        }

                        presentTacticsService.ActivityStrategyGet($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                    });
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
                        presentTacticsService.ActivityStrategyGet($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);

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
                    objName: {id: $scope.searchForm.storeId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.storeId = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "叠加", tag: 'issuperposition'},
                {name: "状态", tag: 'statusName'},
                {name: "排序", tag: 'seq'},
                {name: "策略编码", tag: 'code'},
                {name: "策略名称", tag: 'name'},
                {name: "策略类型", tag: 'activitystrategytypeName'},
                {name: "开始时间", tag: 'begindate'},
                {name: "结束时间", tag: 'enddate'}
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

