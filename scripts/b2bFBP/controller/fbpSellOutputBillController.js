/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("fbpSellOutputBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "fbpPublicService", "fbpSellOutputBillService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, fbpPublicService, fbpSellOutputBillService) {
            var indexId = "#fbpSellOutputBill";
            fbpSellOutputBillService.DomOperate.dominit($scope);

                //加载下拉框
                $('#fbpSellOutputBill').selectPlug();

                //初始化getpage函数
                fbpPublicService.DomOperate.calculateInde($scope);

                //复选框默认不勾选
                $scope.labelSel = false;

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };


            $scope.domOperate = {
                //右侧配置选项
                listAllocation: function () {
                    $("#" + $scope.allocation.timestamp).show();
                },
                selectAll: function () {
                    var obj = $scope.orderListTbody;
                    if ($scope.checkAll) {
                        for (var i = 0, j = obj.length; i < j; i++) {
                            obj[i].trShow = false;
                        }
                    } else {
                        for (var i = 0, j = obj.length; i < j; i++) {
                            obj[i].trShow = true;
                        }
                    }
                    $scope.checkAll = !$scope.checkAll;
                },
                orderListChose: function (myEvent, list) {
                    var obj = $scope.orderListTbody;
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope.checkAll = true;
                    for (var i = 0, j = obj.length; i < j; i++) {
                        if (!obj[i].trShow) {
                            $scope.checkAll = false;
                            break;
                        }
                    }
                },
                //跳到计划单详情页
                jumpToDetails: function (title, url, list) {
                    $rootScope.params = {
                        SalesOrderId: list.id + "",
                    };
                    $scope.addTab(title,url);
                },
                //跳转新增销售出库单页
                jumpToAddBill: function (title,url,list,$event) {

                    $rootScope.params={};

                    //设置传过去的信息
                    $rootScope.params = {
                        //调出仓库
                        inWarehouseDatas: $scope.inWarehouseDatas,
                        //调入仓库
                        outWarehouseDatas: $scope.outWarehouseDatas,
                        //店铺名称
                        storeDatas: $scope.storeDatas,
                    };
                    //判断是否是进入的修改页
                    if(list){
                        if($($event.target).hasClass("notClick")){
                            return
                        }
                        $rootScope.params.list = list;
                    }
                    $scope.addTab(title,url);
                },
                //作废
                overOrder: function (list, $event) {
                    if ($($event.target).hasClass("notClick")) return;
                    fbpSellOutputBillService.Interface.overOrder($scope, list)
                    fbpSellOutputBillService.Interface.getOrderList($scope);
                },
                //审核
                auditOrder:function(list,$event){
                    if($($event.target).hasClass("notClick")){
                        return
                    }
                    fbpSellOutputBillService.Interface.auditOrder($scope,list)
                    fbpSellOutputBillService.Interface.getOrderList($scope);
                },
                //高级搜索显示隐藏
                searchShow: function (content) {
                    $scope.advancedSearch = content;
                },
                //高级移除确定事件
                clearChoseCondition: function (type, list) {
                    //将已经筛选的条件，点击叉号删掉已经存在的对应状态可以恢复到未选中状态
                    delete $scope.orderListCollect.searchConditions[type];
                    delete $scope.orderListCollect.searchHformData[type];
                    delete $scope.formChoseData[list.filed];
                    delete $scope.searchformData[list.filed];
                },
                //高级筛选确定事件
                advanceSearchConfirm: function (myEvent) {
                    $scope.searchformData = $.extend(true, $scope.searchformData, $scope.formChoseData);
                    //重新请求数据
                    fbpSellOutputBillService.Interface.getOrderList($scope);
                    //高级搜索隐藏
                    $scope.advancedSearch = false;
                },
                //高级搜索清空事件
                advanceSearchClear: function () {
                    for (var key in $scope.formChoseData) {
                        delete $scope.formChoseData[key];
                    }
                    for (var key in $scope.searchformData) {
                        delete $scope.searchformData[key];
                    }
                },
                //简单搜索
                singleSearch: function ($event) {
                    if ($event.keyCode == 13) {
                        fbpSellOutputBillService.Interface.getSearchList($scope)
                    }
                }
            }
            ;

            //通知页配置
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                extClick: false,
                type: 0,
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                getPageIndex: $scope.getPageIndex,
                onChange: function () {  //操作之后的回调
                    fbpSellOutputBillService.Interface.getOrderList($scope);
                }
            };
//分页配置
            fbpSellOutputBillService.Interface.getOrderList($scope);
//上一页
            $scope.prev = function () {
                fbpPublicService.DomOperate.prevPage($scope)
            };
//下一页
            $scope.next = function () {
                fbpPublicService.DomOperate.nextPage($scope)
            };
//初始条数
            $scope.first = 1;
//目前最后条数
            $scope.last = $scope.paginationConf.itemsPerPage;

            $rootScope.activePage = "b2bBFP";

            //显示时间控件
            $scope.showDatetimePick = function (myevent) {
                $(myevent.target).datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn: 1,
                    language: 'zh-CN'
                });
            };
            //高级搜索出库仓库
            $scope.outWarehouseConfigData = {
                //是否显示字母搜索
                letterClassify: true,
                //显示更多
                selectMore: true,
                //显示多选
                Multiselect: true,
                //将选中的条件保存起来到这个对象当中
                chosed: $scope.formChoseData,
                title: '调出仓库',
                placeHold: '调出仓库',
                //后台中对应的字段名称
                filed: 'OutWarehouseId',
                list: $scope.orderListCollect.outWarehouse
            };

            //高级搜索调入仓库
            $scope.inWarehouseConfigData = {
                //是否显示字母搜索
                letterClassify: true,
                //显示更多
                selectMore: true,
                //显示多选
                Multiselect: true,
                //将选中的条件保存起来到这个对象当中
                chosed: $scope.formChoseData,
                title: '调入仓库',
                placeHold: '调入仓库',
                //后台中对应的字段名称
                filed: 'InWarehouseId',
                list: $scope.orderListCollect.inWarehouse
            };
            //高级搜索店铺名称
            $scope.storenameConfigData = {
                //是否显示字母搜索
                letterClassify: true,
                //显示更多
                selectMore: true,
                //显示多选
                Multiselect: true,
                //将选中的条件保存起来到这个对象当中
                chosed: $scope.formChoseData,
                title: '店铺名称',
                placeHold: '店铺名称',
                //后台中对应的字段名称
                filed: 'StoreId',
                list: $scope.orderListCollect.storeList
            };
        }])
;