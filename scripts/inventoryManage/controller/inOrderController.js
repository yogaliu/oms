/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inOrderController", ["$scope", "$rootScope", "inOrderService","APP_MENU",
        function ($scope, $rootScope, inOrderService,APP_MENU) {
            // 定义当前页面控件的ID
            var pageId = "#inOrder";
            // 用户输入查询条件的对象
            var userQueryConditionObj = {};

            // 获取所有的用户查询条件，并且转为 数组
            function getAllUserQueryCondition(){
                var result = [];
                for(var key in userQueryConditionObj){
                    result.push(userQueryConditionObj[key]);
                }

                // 入库单号
                if($scope.formData.Code != "" && $scope.formData.Code !== undefined && $scope.formData.Code !== null ){
                    var tempCondition = {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": $scope.formData.Code,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                // 商品编码
                if($scope.formData.ProductCode != "" && $scope.formData.ProductCode !== undefined && $scope.formData.ProductCode !== null ){
                    var tempCondition = {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProductCode",
                        "Name": "ProductCode",
                        "Value": $scope.formData.ProductCode,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                // 来源单号
                if($scope.formData.FromCode != "" && $scope.formData.FromCode !== undefined && $scope.formData.FromCode !== null ){
                    var tempCondition = {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "FromCode",
                        "Name": "FromCode",
                        "Value": $scope.formData.FromCode,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                // 开始制单时间
                if($scope.formData.BeginDate != "" && $scope.formData.BeginDate !== undefined && $scope.formData.BeginDate !== null ){
                    var tempCondition = {
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "BeginDate",
                        "Name": "PurchaseDate",
                        "Value": $scope.formData.BeginDate,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                // 结束制单时间
                if($scope.formData.EndDate != "" && $scope.formData.EndDate !== undefined && $scope.formData.EndDate !== null ){
                    var tempCondition = {
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "EndDate",
                        "Name": "PurchaseDate",
                        "Value": $scope.formData.EndDate,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                return result;


            }

            //进入页面需要执行的方法
            function init() {
                $scope.formData = {};
                //分页
                pageSet();
                // 表格的标题，这个tag是与后台返回的key 对应的
                $scope.theadList = [
                    {name: "状态", tag: 'status'},
                    {name: "入库订单", tag: 'code'},
                    {name: "来源订单", tag: 'fromcode'},
                    {name: "收货仓库", tag: 'warehousename'},
                    {name: "入库仓库", tag: 'virtualwarehousename'},
                    {name: "入库类型", tag: 'typename'},
                    {name: "制单人", tag: 'createuser '},
                    {name: "制单时间", tag: 'createdate'},
                    {name: "审核人", tag: 'audituser'},
                    {name: "审核时间", tag: 'auditdate'}
                ];
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : null
                };

                // 查询条件
                $scope.queryCondition = {
                    "PageIndex": 1,
                    "PageSize": 10
                };

                // 高级查询的对象
                $scope.advanceQueryCondition = {
                    "inWarehouseTypeList" : {
                        // 入库类型默认显示5个
                        "inWarehouseTypeListNumber" : 5,
                        // 是否展开
                        "isExpand" : false,
                        // 是否多选
                        "isCheckbox":false
                    },
                    "warehouseList" : {
                        // 入库类型默认显示5个
                        "warehouseListNumber" : 5,
                        // 是否展开
                        "isExpand" : false,
                        // 是否多选
                        "isCheckbox":false
                    }
                };

                // 判断是否缓存了所有的仓库信息
                if($.isEmptyObject(inOrderService.allWarehouseInfo)){
                    inOrderService.getAllWarehouseInfo($scope);
                }else{
                    $scope.warehouseList = inOrderService.allWarehouseInfo;
                }

                // 判断是否缓存入库类型
                if($.isEmptyObject(inOrderService.generalClassiFication)){
                    inOrderService.getGeneralClassiFication($scope);
                }else{
                    $scope.inWarehouseTypeList = inOrderService.generalClassiFication;
                }

                // 单据状态
                $scope.inventoryOutboundOrderStatusList = klwTool.enumerateToArray(APP_MENU.inventoryOutboundOrder);

                // 获取订单列表的数据，并且展示出来
                inOrderService.getStorageOrder($scope);

                // 日期控件初始化
                $(pageId + " input.dateplugin" ).datetimepicker({
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

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };


            /**
             * 分页插件
             */
            function pageSet() {
                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1)) return;
                    $scope.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.last = $scope.paginationConf.totalItems;
                    } else {
                        $scope.last = currentPage * itemsPerPage;
                    }
                };
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
                        //inOrderService.getStorageOrder($scope);
                        // 查询条件
                        $scope.queryCondition = {
                            "PageIndex": $scope.paginationConf.currentPage,
                            "PageSize": $scope.paginationConf.itemsPerPage
                        };

                        // 获取订单列表的数据，并且展示出来
                        inOrderService.getStorageOrder($scope, getAllUserQueryCondition());
                    }
                };
                //初始化第一页
                $scope.first = 1;
                //初始化最后一页
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

            //表格渲染完成之后触发的方法
            $scope.tableRepeatFinished = function () {

                //$('#mainTable').DataTable({
                //    "paging": false,
                //    "searching": false,
                //    "info": false,
                //    "ordering": false
                //});
            };

            /**
             * 是否展开高级搜索
             */
            $scope.showAdvance = function (val) {
                $scope.advance = val;
            };

            // 选择入库仓库的查询条件
            $scope.inWarehouseQueryCondition = function(id){
                var inWarehouseConditionObj = {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "WarehouseId",
                        "Name": "WarehouseId",
                        "Value": id,
                        "Children": []
                };
                $scope.formData.warehouseListSelectedId = id;
                userQueryConditionObj["inWarehouseConditionObj"] = inWarehouseConditionObj;
            };

            // 选择单据状态的查询条件
            $scope.inventoryOutboundOrderStatusQueryCondition = function(id){
                var inventoryOutboundOrderStatusObj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Status",
                    "Name": "Status",
                    "Value": id,
                    "Children": []
                };
                $scope.formData.inventoryOutboundOrderStatusId = id;
                userQueryConditionObj["inventoryOutboundOrderStatusObj"] = inventoryOutboundOrderStatusObj;
            };

            // 选择单据状态的查询条件
            $scope.inWarehouseTypeQueryCondition = function(id){
                var inWarehouseTypeObj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "TypeCode",
                    "Name": "TypeCode",
                    "Value": id,
                    "Children": []
                };
                $scope.formData.inWarehouseTypeId = id;
                userQueryConditionObj["inWarehouseTypeObj"] = inWarehouseTypeObj;
            };

            // 是否显示更多的条件
             $scope.isShowMore = function(index,type){
                 if(index < $scope.advanceQueryCondition[type][type+"Number"]){
                     return true;
                 }else{
                     return false;
                 }
             };

            // 显示更多查询条件
            $scope.showMoreCondition = function (type) {
                $scope.advanceQueryCondition[type]["isExpand"] = true;
            };

            // 隐藏更多查询条件
            $scope.hideMoreCondition = function (type) {
                $scope.advanceQueryCondition[type]["isExpand"] = false;
            };

            // 高级搜索的按钮
            $scope.advanceSearch = function(){
                var userQueryCondition = getAllUserQueryCondition();
                console.dir(userQueryCondition);
                // 获取订单列表的数据，并且展示出来
                inOrderService.getStorageOrder($scope,userQueryCondition);
            };

            // 显示时间控件
            $scope.showDatetimePick = function(myevent){
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

            // 清空高级搜索的查询条件
            $scope.clearAdvancCondition = function(){
                userQueryConditionObj = {};
                $scope.formData ={};
                //$scope.formData.warehouseListSelectedId = id;
                //$scope.formData.inventoryOutboundOrderStatusId = id;
                //$scope.formData.inWarehouseTypeId = id;
                //// 入库单号
                //$scope.formData.Code = "";
                //// 商品编码
                //$scope.formData.ProductCode ="";
                //// 来源单号
                //$scope.formData.FromCode = "";
                //// 开始制单时间
                //$scope.formData.BeginDate = "";
                //// 结束制单时间
                //$scope.formData.EndDate = "";

            };

            // 显示商品详情
            $scope.getInOrderDetail = function(indexNumber,inOrderId){
                // 查看该对象的详情
                inOrderService.inOrderDetailObj = $scope.tableList[indexNumber];

                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/inOrderDetails.html';
                $scope.option[index].name = '库存管理：入库订单详情';
            };

            // 跳转到新增订单页面
            $scope.showAddInOrderPanel = function(){
                $scope.addTab('库存管理：新增入库订单','../template/inventoryManage/inOrderAdd.html');
            };

        }]);