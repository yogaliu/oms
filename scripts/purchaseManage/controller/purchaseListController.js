/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("purchaseListController", ["$scope", "$rootScope", "purchaseListService","toolsService",
        function ($scope, $rootScope, purchaseListService,toolsService) {
            var pageId = '#purchaseList';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                //采购订单列表配置
                $scope.theadList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "到货状态", tag: 'arrivalstatusname'},
                    {name: "采购单号", tag: 'code'},
                    {name: "合同号", tag: 'contractno'},
                    {name: "采购日期", tag: 'purchasedate'},
                    {name: "到货时间", tag: 'requestdeliverydate'},
                    {name: "供应商编号", tag: 'suppliercode'},
                    {name: "供应商名称", tag: 'suppliername'},
                    {name: "收货仓库", tag: 'warehousename'},
                    {name: "采购员", tag: 'purchasepersonname'},
                    {name: "审核人", tag: 'approvaluser'},
                    {name: "审核时间", tag: 'approvaldate'},
                    {name: "备注", tag: 'remark'},
                    {name: "调整货期", tag: 'deliverydateadjustment'}
                ];
                purchaseListService.query($scope,1,10);
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'purchaseListConfig'
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                //收货仓库初始化
                $scope.warehouse = 'radio';
                $scope.radioWarehouse = {
                    'status':'selecting'
                };
                purchaseListService.getWarehouse($scope);
                // 选中的长度,若长度为0,则不显示高级搜索配置
                $scope.num = [];
                //搜索项
                $scope.searchItem = {};
                //当前编辑项
                $scope.activeItem = {};
                // 时间控件初始化
                $(pageId + ' .datePlugin').datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            }
            init();

            //联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    purchaseListService.query($scope,1,10,1);
                }
            };

            //高级搜索类型（单选/多选/更多）
            $scope.module = function (module,type) {
                $scope[module] = type;
                $scope.warehouseData = $scope.singleWordData['data'];
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    purchaseListService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.num = [];
                    $scope.radioWarehouse.status = 'selecting';
                }
            };

            // 筛选条件关闭
            $scope.closeSelect = function (module,item,type) {
                $scope[module] = {
                    'status': 'selecting',
                    'content': ''
                };
                $scope.searchItem[item] = '';
                $scope.num.pop();
                // 默认显示单选状态
                $scope[type] = 'radio';
                $scope.warehouseData = $scope.singleWordData['data'];
            };

            // 单选公用方法
            $scope.radioList = function (module, item, name, id) {
                $scope[module] = {
                    'status': 'selected',
                    'content': name
                };
                $scope.searchItem[item] = id;
                $scope.num.push(Math.random());
            };

            // 字母查询
            $scope.singleWordQuery = function (name,module,data,e) {
                $scope[data] = $scope[module]['data'];  // 将数据还原
                $(e.target).closest('span').addClass('current').siblings().removeClass('current');
                if(name == '全部') {
                    $scope[data] = $scope[module]['data'];
                } else {
                    $scope[data] = $scope[module][name];
                }
            };

            // 搜索查询
            $scope.singleWordSearch = function (field,module) {
                $(pageId + ' .wordSearch span').removeClass('current');
                $scope.warehouseData = $scope[module]['data'];
                $.each($scope[module]['data'],function (index,obj) {
                    if (JSON.stringify(obj.name).indexOf(field) != -1) {
                        obj.isHide = false;
                    } else {
                        obj.isHide = true;
                    }
                });
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };

            //审核提示
            $scope.audit = function (i) {
                // 新建状态才能作废
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0) {
                    $scope.showModal('auditModal');
                } else {
                    toolsService.alertMsg({content: '采购订单非新建状态, 不能审核!', time: 1000});
                }
            };
            // 审核操作
            $scope.auditEnsure = function () {
                purchaseListService.audit($scope);
            };

            // 作废提示
            $scope.cancel = function (i) {
                // 未审核状态才能作废
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0) {
                    $scope.showModal('cancelModal');
                } else {
                    toolsService.alertMsg({content: '采购订单非新建状态, 不能作废!', time: 1000});
                }
            };
            // 作废操作
            $scope.cancelEnsure = function () {
                purchaseListService.cancel($scope);
            };

            // 完结提示
            $scope.end = function (i) {
                //已审核状态才能完结
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 1) {
                    $scope.showModal('endModal');
                } else {
                    toolsService.alertMsg({content: '采购订单非审核状态, 不能完结!', time: 1000});
                }
            };
            // 完结操作
            $scope.endEnsure = function () {
                purchaseListService.end($scope);
            };

            // 调整货期提示
            $scope.adjust = function (i) {
                //已审核状态才能调整货期
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 1) {
                    $scope.showModal('adjustModal',i);
                    // 采购详情
                    purchaseListService.purchaseDetail($scope);
                    // 采购日志
                    purchaseListService.purchaseLog($scope);
                } else {
                    toolsService.alertMsg({content: '仅对已审核的单据进行调整!', time: 1000});
                }
            };
            // 调整货期操作
            $scope.adjustEnsure = function () {
                purchaseListService.adjustTime($scope);
            };

            // 打印
            $scope.printOrder = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                purchaseListService.purchaseDetail($scope,'print');
            };

            //显示模态框
            $scope.showModal = function (name,i) {
                if(i >= 0) {
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    // 调整货期
                    if(name == 'adjustModal') {
                        $scope.arrivalTime = $scope.activeItem.deliverydateadjustment? $scope.activeItem.deliverydateadjustment:'';
                    }
                }
                $("#" + name).modal("show");
            };

            //新增采购订单
            $scope.add = function () {
                $rootScope.purchaseOrderParams = {
                    type:'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/addPurchaseOrder.html';
                $scope.option[index].name = '采购订单：新增采购订单';
            };

            //修改采购订单
            $scope.edit = function (i) {
                // 未审核状态才能修改
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0) {
                    $rootScope.purchaseOrderParams = {
                        type:'edit',
                        data:$scope.activeItem
                    };
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/purchaseManage/addPurchaseOrder.html';
                    $scope.option[index].name = '采购订单：修改采购订单';
                } else {
                    toolsService.alertMsg({content: '已审核单据不能编辑!', time: 1000});
                }
            };

            //采购订单详情
            $scope.detail = function (i) {
                $rootScope.purchaseOrderParams = {
                    data:$scope.tableList[i]
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/purchaseDetails.html';
                $scope.option[index].name = '采购订单：采购详情';
            };

            //配置时间控件 配置
            $scope.showDatetimePick = function(myevent) {
                $(myevent.target).datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            };

            /*采购订单分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }

            };
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    purchaseListService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
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

        }]);
