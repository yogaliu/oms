/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("runScheduleController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "runScheduleService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, runScheduleService) {

            var indexID='#runSchedule';

            function init() {
                //高级搜索
                $scope.searchForm1 = {
                    startTime: '',
                    endTime: '',
                    scheduleCode: '',
                    skuCode: '',
                    poCode: '',
                    outHouseId: '',
                    outHouseName: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //特殊标识行变量
                $scope.simpleSelect = {
                    isneedupload: ''
                };

                //搜索确定
                $scope.search = function () {
                    runScheduleService.VipScheduleQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                };

                //搜索清空
                $scope.empty = function () {
                    $scope.searchForm = $.extend(true, {}, $scope.searchForm1);
                    $scope.selectoutHouse.init();
                };
                //模糊搜索
                $scope.searchKeyup = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };
                // 查询数据
                runScheduleService.VipScheduleQuery($scope, 1, 10, 0, [], true);
                //查询仓库
                runScheduleService.WarehouseGet($scope);

                //加载下拉框
                $('#runSchedule').selectPlug();

                //分页配置
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
                                $scope.simpleSelect.isneedupload = selType;
                                break;
                        }
                        runScheduleService.VipScheduleQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                    });
                };

                //跳转页面
                $scope.goOther = function (content, i, e) {
                    var index = $('#runSchedule').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                type: 'add',
                                scheduletype: 0,
                                tableList: ''
                            };
                            $scope.option[index].url = '../template/b2bVIP/addRunSchedule.html';
                            $scope.option[index].name = '唯品档期：新增唯品档期';
                            break;
                        case 'modify':
                            if (!$(e.target).closest('li').hasClass('notClick')) {
                                $rootScope.params = {
                                    type: 'modify',
                                    scheduletype: 1,
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/b2bVIP/addRunSchedule.html';
                                $scope.option[index].name = '唯品档期：修改唯品档期';
                            }
                            break;
                        case 'detail':
                            $rootScope.params = {
                                tableList: $scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/b2bVIP/runScheduleDetail.html';
                            $scope.option[index].name = '唯品档期：唯品档期详情';
                            break;
                    }
                };

                //表格操作
                $scope.operate = {
                    //审核
                    check: function (id, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            runScheduleService.VipScheduleAudit($scope, id);
                        }
                    },
                    //上传库存
                    startUpLold: function (obj,e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            runScheduleService.VipScheduleDetailGet($scope, obj);
                        }
                    },
                    //结束上传
                    endUpLold: function (id,e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            runScheduleService.VipScheduleGetUnNoticed($scope, id);
                        }
                    },
                    //填写PO单号
                    poBill: function (id, pocode) {
                        $("#runSchedule #poBillModal").modal('show');
                        $scope.poBill = {
                            id: id,
                            pocode: pocode
                        }
                    },
                    //填写PO单号确定
                    poBillSubmit: function () {
                        runScheduleService.VipScheduleEditPoCode($scope, $scope.poBill.id, $scope.poBill.pocode);
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
                        runScheduleService.VipScheduleQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, $scope.searchdata, false);
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
                //下拉选框插件 出库仓库
                $scope.selectoutHouse = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchForm.outHouseId = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "需上传", tag: 'isneedupload'},
                {name: "活动状态", tag: 'statusName'},
                {name: "档期类型", tag: 'scheduletypeName'},
                {name: "店铺名称", tag: 'storename'},
                {name: "档期编号", tag: 'schedulecode'},
                {name: "档期名称", tag: 'schedulename'},
                {name: "PO单号", tag: 'pocode'},
                {name: "调出实体仓", tag: 'warehousename'},
                {name: "调出虚拟仓", tag: 'outvirtualwarehousename'},
                {name: "调入虚拟仓", tag: 'outvirtualwarehousename'},
                {name: "档期开始时间", tag: 'schedulebegindate'},
                {name: "档期结束时间", tag: 'schedulebegindate'},
                {name: "创建时间", tag: 'createdate'},
                {name: "货值", tag: 'goodsvalue'},
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