/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("systemInventoryController", ["$scope","$rootScope","systemInventoryService",
        function($scope,$rootScope,systemInventoryService) {
        //进入页面需要执行的方法
        function init(){

            //高级搜索条件
            $scope.formChoseData = {};

            $scope.inventoryAdvan = {
                //高级搜索数据集合
                searchHformData : {},
                //高级搜索筛选条件集合
                searchConditions : {},
                //推荐仓库
                commendWareHouse : {},

                commendBrand : {}
            };


            $scope.systemcolumn=[
                {name: "仓库名称", tag: 'warehouseName'},
                {name: "商品编码", tag: 'productcode'},
                {name: "商品名称", tag: 'productname'},
                {name: "品牌", tag: 'brand'},
                {name: "规格编码", tag: 'code'},
                {name: "规格名称", tag: 'description'},
                {name: "库存数", tag: 'quantity'},
                {name: "已配货数", tag: 'dispatchedQuantity'},
                {name: "订单占用数", tag: 'unDispatchedQuantity'},
                {name: "调拨占用数", tag: 'allotQuantity'},
                {name: "唯品占用数", tag: 'vipQuantity'},
                {name: "可用数", tag: 'canUseQuantity'},
                {name: "可销数", tag: 'canSaleQuantity'},
                {name: "在途数", tag: 'transitTotalQuantity'}
            ];

            /*高级搜索项绑定*/
            $scope.formData = {
                "productName":$scope.productName,
                "productCode":$scope.productCode,
                "skuCode":$scope.skuCode
            };

            //默认展示联合搜索，隐藏高级搜索
            $scope.advance = false;
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 8,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [8, 20, 50, 100, 500,1000],  //配置配置可选择每页显示记录数 array
                extClick : false , //当为外部点击翻页时为true
                type: 0 ,  // 上一页0  下一页1
                getPageIndex:function (currentPage,itemsPerPage) {
                    $scope.first = itemsPerPage * (currentPage-1) +1;
                    if($scope.paginationConf.totalItems / itemsPerPage  === currentPage){
                        $scope.last = $scope.paginationConf.totalItems;
                        systemInventoryService.queryInventory($scope);
                    }else{
                        $scope.last = currentPage * itemsPerPage;
                        systemInventoryService.queryInventory($scope);
                    }
                } ,
                onChange: function(){	//操作之后的回调
                    systemInventoryService.queryInventory($scope);
                }
            };


            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;
            //外部上一页
            $scope.prev = function () {
                $scope.paginationConf.currentPage--;
                $scope.paginationConf.type = 0 ;
                $scope.paginationConf.extClick = true;

            };
            //外部下一页
            $scope.next = function () {
                $scope.paginationConf.currentPage++;
                $scope.paginationConf.type = 1 ;
                $scope.paginationConf.extClick = true;
            };
            //筛选条件的枚举项
            $scope.transferOut = 'radio';
            $scope.brand = 'radio';



            // 查询库存  默认查询所有
            $scope.OperateType = 1;  //0查询无库存  2 查询有库存  其他查询所有

            //查询仓库
            systemInventoryService.queryWarehouse($scope,function () {
                //推荐仓库数据配置
                $scope.commendWareHouseConfigData = {
                    //是否显示字母搜索
                    letterClassify:true,
                    //显示更多
                    selectMore : true,
                    //将选中的条件保存起来到这个对象当中
                    chosed : $scope.formChoseData,
                    title:'推荐仓库',
                    placeHold : '推荐仓库',
                    //后台中对应的字段名称
                    filed:'WarehouseId',
                    list :   $scope.inventoryAdvan.commendWareHouse
                };
            });

            //查询品牌
            systemInventoryService.queryBrand($scope,function () {
                $scope.commendBrandConfigData = {
                    //是否显示字母搜索
                    letterClassify:true,
                    //显示更多
                    selectMore : true,
                    //将选中的条件保存起来到这个对象当中
                    chosed : $scope.formChoseData,
                    title:'品牌',
                    placeHold : '品牌',
                    //后台中对应的字段名称
                    filed:'Brand',
                    list :   $scope.inventoryAdvan.commendBrand
                };
            });


            //列信息修改配置
            $scope.allocation = {
                "theadList" : $scope.systemcolumn,
                // 指令控制器的ID唯一标识
                "timestamp" : null
            };

        };



        function event(){
            $scope.$watch('systemcolumn',function () {
                $scope.allocation.listObj2 =  $scope.systemcolumn;
            });

            //列表配置Hover函数
            $scope.listAllocationHover = false;
            $scope.isHover = function () {
                $scope.listAllocationHover = !$scope.listAllocationHover;
            };

            $scope.listAllocation = function () {
                $("#"+$scope.allocation.timestamp).show();
            },


            $scope.listOprateFun = function (module,type) {
                $scope[module] = type;
            };

            /*选中当前行*/
            $scope.selectSingle = function (event){
                if($(event.target).hasClass('icon-sel-zhengque')){
                    $(event.target).removeClass('icon-sel-zhengque');
                }else{
                    $(event.target).addClass('icon-sel-zhengque');
                };
            },
            /*选中所有行*/
            $scope.selectAll = function (event){
                if($(event.target).hasClass('icon-sel-zhengque')){
                    $(event.target).removeClass('icon-sel-zhengque');
                    $scope.isSelect = '';
                }else{
                    $(event.target).addClass('icon-sel-zhengque');
                    $scope.isSelect = 'icon-sel-zhengque';
                };
            },
            /**
             * 选中列举项
             */
            $scope.toSelect = function (e) {
                var obj = $(e.target);
                obj.closest('.items').find('.sel').removeClass('sel');
                obj.addClass('sel');
            };
            /**
             * 不勾选 勾选 排除三个状态切换
             */
            $scope.toggleSelect = function (e) {
                var obj = $(e.target);
                if( obj.closest('.item').find('.klwk-check').length > 0 ){
                    obj.closest('.item').find('.klwk-check').removeClass('klwk-check').addClass('klwk-check-x');
                    $scope.OperateType = 2;
                    systemInventoryService.queryInventory($scope);
                }else if( obj.closest('.item').find('.klwk-check-x').length > 0 ){
                    obj.closest('.item').find('.klwk-check-x').removeClass('klwk-check-x').addClass('klwk-check-f');
                    $scope.OperateType = 1;
                    systemInventoryService.queryInventory($scope);
                }else{
                    obj.closest('.item').find('.klwk-check-f').removeClass('klwk-check-f').addClass('klwk-check');
                    $scope.OperateType = 0;
                    systemInventoryService.queryInventory($scope);
                }
            };
            /**
             * 同步库存  弹出模态框
             */
            $scope.synchronizeInventory = function (e,item) {
                e.stopPropagation();
                var obj = $(e.target);
                $('#synchronizeInventoryModal').modal('show');    //显示模态框
                //初始化店铺下拉列表
                $scope.pullInfo ={
                    isshow:false,
                    info:$scope.warehouse,
                    onChange: function(obj,index){	//点击之后的回调
                        item.synchronizewarehouseId = obj.id;
                    }
                }
                $scope.synchronizeItem = item;
                $scope.pullInfoList=[{"name":'xxx'}]  //用于编译下拉列表指令
                obj.closest('ul').hide();
            };
            /**
             * 同步库存  确定同步
             */
            $scope.virtualScuess =function () {
                systemInventoryService.inventoryVirtual($scope,function () {
                    $('#synchronizeInventoryModal').modal('hide');
                });
            }

            /**
             * 表格行操作
             */
            $scope.oprateTr = function (e) {
                $(e.target).closest('.tr-oprate').find('ul').toggle();
            };


            /*高级搜索模块展示*/
            $scope.toggleAdvance = function () {
                $scope.advance = true;
            };


            $scope.domOperate = {
                /**
                 * 根据首字母筛选所需信息
                 * @param letter
                 * @param type
                 */
                selectStoresByFirstLetter : function (letter,type){
                    orderListService.orderListDomOperate.selectStoresByFirstLetter($scope,letter,type);
                },
                //高级筛选确定事件
                advanceSearchConfirm : function (myEvent) {
                    //重新请求订单数据
                    systemInventoryService.queryInventory($scope);
                    //高级搜索隐藏
                    //$scope.advance = false;
                },
                //高级筛选取消事件
                advanceSearchCancle : function(myEvent) {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }

                    $scope.formData={};

                    //高级搜索隐藏
                    $scope.advance = false;
                },
                //高级筛清空事件
                advanceSearchClear : function () {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }
                    $scope.formData={};
                },
            };


            /*搜索*/
            $scope.advanceSearch = function () {
                $scope.advance = false;
            };
            /*取消*/
            $scope.cancleSearch = function () {
                $scope.advance = false;
            };
            /*是否出现顶部清空筛选按钮*/
            $scope.isTopCondition = function () {
                if($scope.formData["productName"]||$scope.formData["productNo"]||$scope.formData["typeNo"]){
                    return true;
                }else {
                    return false;
                };
            };
            /*是否出现表头筛选项展开更多*/
            $scope.isMore = function () {
                var len = 2;
                if(len>8){
                    return true;
                }else{
                    return false;
                };
            };
            /*清空筛选 不提交*/
            $scope.clearOnly = function () {
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                };
            };
            /*清空筛选 提交*/
            $scope.clearFilter = function () {
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                };
            };

            /*清空单条筛选 提交*/
            $scope.clearSingleFilter = function (name) {
                $scope.formData[name] = "";
            };
            /*显示模态框*/
            $scope.showModal = function (name) {
                $("#" + name).modal("show");
            };
        };

        init();
        event();
    }]);