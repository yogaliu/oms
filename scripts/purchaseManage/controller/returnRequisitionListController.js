/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("returnRequisitionListController", ["$scope", "$rootScope","returnRequisitionService","toolsService","APP_MENU",
        function ($scope, $rootScope, returnRequisitionService,toolsService,APP_MENU) {
            var pageId = '#returnRequisitionList';   // 页面Id
            //进入页面需要执行的方法
            function init() {
                //采购退货单列表配置
                $scope.theadList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "采购退货单号", tag: 'code'},
                    {name: "供应商编号", tag: 'suppliercode'},
                    {name: "供应商名称", tag: 'suppliername'},
                    {name: "仓库名称", tag: 'warehousename'},
                    {name: "占用仓库", tag: 'virtualwarehousename'},
                    {name: "退货原因", tag: 'typename'},
                    {name: "创建人", tag: 'createusername'},
                    {name: "审核人", tag: 'approvaluser'},
                    {name: "审核时间", tag: 'approvaldate'},
                    {name: "备注", tag: 'remark'}
                ];
                returnRequisitionService.query($scope,1,10);
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'returnRequisitionListConfig'
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                // 退货仓库初始化
                $scope.warehouse = 'radio';
                $scope.radioWarehouse = {
                    'status':'selecting'
                };
                returnRequisitionService.warehouseGet($scope);
                //单据状态初始化
                $scope.radioStatus = {
                    'status':'selecting'
                };
                $scope.returnStatus = APP_MENU.purchaseReturnStatus;
                // 选中的长度,若长度为0,则不显示高级搜索配置
                $scope.num = [];
                // 搜索项
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
                    returnRequisitionService.query($scope,1,10,1);
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
                    returnRequisitionService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.radioStatus.status = 'selecting';
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
                returnRequisitionService.audit($scope);
            };

            //关闭提示
            $scope.cancel = function (i) {
                // 新建/已审核/已通知状态才能关闭
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0 || $scope.activeItem.status == 1 || $scope.activeItem.status == 2) {
                    $scope.showModal('cancelModal');
                } else {
                    toolsService.alertMsg({content: '已关闭单据无需关闭!', time: 1000});
                }
            };
            // 关闭操作
            $scope.cancelEnsure = function () {
                returnRequisitionService.cancel($scope);
            };

            //显示模态框
            $scope.showModal = function (name,i) {
                if(i >= 0) {
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                }
                $("#" + name).modal("show");
            };

            //新增采购退货单
            $scope.add = function () {
                $rootScope.returnOrderParams = {
                    type:'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/addReturnRequisition.html';
                $scope.option[index].name = '采购退货单：新增采购退货单';
            };

            //修改采购退货单
            $scope.edit = function (i) {
                // 未审核状态才能修改
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0) {
                    $rootScope.returnOrderParams = {
                        type:'edit',
                        data:$scope.activeItem
                    };
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/purchaseManage/addReturnRequisition.html';
                    $scope.option[index].name = '采购退货单：修改采购退货单';
                } else {
                    toolsService.alertMsg({content: '已审核单据不能编辑!', time: 1000});
                }
            };

            //采购退货单详情
            $scope.detail = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                $rootScope.returnOrderParams = {
                    data:$scope.activeItem
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/returnRequisitionDetails.html';
                $scope.option[index].name = '采购退货单：采购退货单详情';
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

            /*采购退货单分页*/
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
                    returnRequisitionService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
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