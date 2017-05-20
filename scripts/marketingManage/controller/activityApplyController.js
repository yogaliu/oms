/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("activityApplyController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "activityApplyService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, activityApplyService) {

            //当前页面id
            var indexID='#activityApply';

            function init() {

                //跳转页面
                $scope.goOther = function (content, i ,e) {
                    var index = $('#activityApply').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                type: 'add',
                                tableList:''
                            };
                            $scope.option[index].url = '../template/marketingManage/addActivityApply.html';
                            $scope.option[index].name = '活动报名：新增活动';
                            break;
                        case 'modify':
                            if (!$(e.target).closest('li').hasClass('notClick')) {
                                $rootScope.params = {
                                    type: 'modify',
                                    tableList: $scope.tableList[i]
                                };
                                $scope.option[index].url = '../template/marketingManage/addActivityApply.html';
                                $scope.option[index].name = '活动报名：修改活动';
                            }
                            break;
                        case 'detail':
                            $rootScope.params = {
                                id:$scope.tableList[i].id,
                                storeName: $scope.tableList[i].storename,
                                type: $scope.tableList[i].activitytypename,
                                status: $scope.tableList[i].registrationstatus,
                                tableList:$scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/marketingManage/activityDetail.html';
                            $scope.option[index].name = '活动报名：活动详情';
                            break;
                        case 'deduction':
                            $rootScope.params = {
                                storeId:$scope.tableList[i].storeid,
                                storeName: $scope.tableList[i].storename,
                                id: $scope.tableList[i].id
                            };
                            $scope.option[index].url = '../template/marketingManage/modifyRepertory.html';
                            $scope.option[index].name = '活动报名：修改库存扣减方式';
                            break;
                    }
                };

                //高级搜索input框内容
                $scope.searchForm1 = {
                    activity: '',
                    merchandise: '',
                    storeId: '',
                    time1Start: '',
                    time1End: ''
                };
                $scope.searchForm = $.extend(true, {}, $scope.searchForm1);

                //特殊标识行变量
                $scope.simpleSelect={
                    isForbid:'',
                    isLoad:''
                };

                //搜索
                $scope.search = function () {
                    activityApplyService.ActivityRegisterGet($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
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


                //表格操作
                $scope.operate={
                    //审核
                    check: function (id,e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            activityApplyService.ActivityRegisterApproval($scope, id);
                        }
                    },
                    startAct: function () {

                    },
                    endAct: function () {

                    },
                    //禁用
                    disable: function (id, e) {
                        if (!$(e.target).closest('li').hasClass('notClick')) {
                            $("#activityApply #disableModal").modal('show');
                            $scope.disableId=id;
                        }
                    },
                    //禁用确定
                    disableSubmit: function () {
                        activityApplyService.ActivityRegisterDisabled($scope,$scope.disableId);
                    },



                };

                // 查询数据
                activityApplyService.ActivityRegisterGet($scope, 1, 10, 0, true);
                //查询店铺
                activityApplyService.StoreGet($scope);


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

                //分页
                pageFun();

                //下拉框组件
                selectFun();

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
                                $scope.simpleSelect.isForbid=selType;
                                break;
                            case '2':
                                $scope.simpleSelect.isLoad=selType;
                                break;
                        }
                    });
                    activityApplyService.ActivityRegisterGet($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
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
                        activityApplyService.ActivityStrategyGet($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0, false);

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

            function selectFun(){
                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){ //点击之后的回调
                        $scope.searchForm.storeId = obj.id;
                    }
                };
            }

            //列表配置
            $scope.theadList = [
                {name: "禁用", tag: 'isdisabled'},
                {name: "按调拨数量上传", tag: 'islockedquantity'},
                {name: "报名状态", tag: 'registrationstatusName'},
                {name: "活动编号", tag: 'code'},
                {name: "开始时间", tag: 'begindate'},
                {name: "结束时间", tag: 'enddate'},
                {name: "店铺名称", tag: 'storename'},
                {name: "主题", tag: 'subject'},
                {name: "活动内容", tag: 'content'},
                {name: "活动类型", tag: 'activitytypename'},
                {name: "总金额", tag: 'exports'},
                {name: "总销量", tag: 'salesqty'},
                {name: "调入仓库", tag: 'warehouseinname'},
                {name: "调出仓库", tag: 'warehouseoutname'},
                {name: "备注", tag: 'remark'},
                {name: "报名人", tag: 'registrationuser'},
                {name: "审核人", tag: 'approvaluser'},
                {name: "审核时间", tag: 'approvaldate'}
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