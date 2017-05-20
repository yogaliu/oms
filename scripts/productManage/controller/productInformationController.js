/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("productInformationController", ["$scope", "$rootScope", "APP_MENU","toolsService", "productInformationService",
        function ($scope, $rootScope, APP_MENU,toolsService, productInformationService) {
            var pageId = '#productInformation'; //页面Id
            //进入页面需要执行的方法
            function init() {
                // 列表配置
                $scope.theadList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "商品编码", tag: 'code'},
                    {name: "商品名称", tag: 'description'},
                    {name: "商品类型", tag: 'producttypename'},
                    {name: "生产方式", tag: 'productionmode'},
                    {name: "品牌名称", tag: 'brand'},
                    {name: "品牌编码", tag: 'brandcode'},
                    {name: "主题", tag: 'theme'},
                    {name: "年份", tag: 'year'},
                    {name: "季节", tag: 'season'},
                    {name: "分类", tag: 'categoryname'},
                    {name: "厂家货号", tag: 'factorycode'},
                    {name: "供应商", tag: 'suppliername'},
                    {name: "商品数量", tag: 'weight'},
                    {name: "箱规", tag: 'cartonspec'},
                    {name: "有配件", tag: 'spareparts'},
                    {name: "所属公司", tag: 'companyname'},
                    {name: "外部编码", tag: 'gbcode'},
                    {name: "回货周期", tag: 'returnperiod'},
                    {name: "上新日期", tag: ''},
                    {name: "下线日期", tag: 'offlinedate'},
                    {name: "安全库存天数", tag: 'safetystockdays'},
                    {name: "上限天数", tag: 'ceilingday'},
                    {name: "下限天数", tag: 'lowerday'}
                ];
                productInformationService.query($scope,1,10);
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'informationConfig'
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                //商品品牌初始化
                $scope.radioBrand = {
                  'status':'selecting'
                };
                //筛选条件的枚举项
                $scope.brand = 'radio';
                productInformationService.getBrand($scope);
                //商品状态初始化
                $scope.radioStatus = {
                    'status':'selecting'
                };
                $scope.productStatus = APP_MENU.productStatus;
                // 选中的长度,若长度为0,则不显示高级搜索配置
                $scope.num = [];
                // 商品信息 批量操作插件
                $scope.menuInfo ={
                    isshow:false,
                    info:[
                        {name:'审核'},
                        {name:'转入WMS'},
                        {name:'禁用'}
                    ],
                    objName:{name:'批量操作'},
                    onChange: function(obj,index){	//点击之后的回调
                        switch(index) {
                            case 0:
                                // 审核
                                $scope.batchAudit();
                                break;
                            case 1:
                                // 转入WMS
                                $scope.batchWMS();
                                break;
                            case 2:
                                // 禁用
                                $scope.batchDisabled();
                                break;
                        }
                    }
                };
                // 搜索项
                $scope.searchItem = {};
                //当前编辑项
                $scope.activeItem = {};
            }
            init();


            //联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    productInformationService.query($scope,1,10,1);
                }
            };

            //高级搜索类型（单选&多选&更多）
            $scope.productMore = function (module,type) {
                $scope[module] = type;
                $scope.productBrandData = $scope.singleWordData['data'];
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    productInformationService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.num = [];
                    $scope.radioBrand.status = 'selecting';
                    $scope.radioStatus.status = 'selecting';
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
                $scope.productBrandData = $scope.singleWordData['data'];
            };

            // 单选公用方法
            $scope.radioList = function (module,item,name,id) {
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
                $(pageId + ' .word-search span').removeClass('current');
                $scope.productBrandData = $scope[module]['data'];
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

            //复选框改变单条数据的isdatacheck属性
            $scope.selectItem = function (i) {
                $scope.tableList[i].isdatacheck = !$scope.tableList[i].isdatacheck;
                $scope.isalldatacheck = true;
                $.each($scope.tableList,function (index, obj) {
                    if(!obj.isdatacheck){
                        $scope.isalldatacheck = false;
                    }
                })
            };

            //复选框改变所有数据的isdatacheck属性
            $scope.selectAll = function () {
                if($scope.isalldatacheck){
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = false;
                        $scope.isalldatacheck = false;
                    })
                }else{
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = true;
                        $scope.isalldatacheck = true;
                    })
                }
            };

            //审核
            $scope.singleAudit = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0) {
                    productInformationService.audit($scope,'single');
                } else {
                    toolsService.alertMsg({content : '选中数据为已确认状态,无需确认!',time : 1000});
                }
            };
            //批量审核
            $scope.batchAudit = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    productInformationService.audit($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //转入WMS
            $scope.singleWMS = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.status == 0 || $scope.activeItem.status == 1) {
                    productInformationService.wms($scope,'single');
                }
            };
            //批量转入WMS
            $scope.batchWMS = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    productInformationService.wms($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //禁用
            $scope.singleDisabled = function () {
                productInformationService.disabled($scope,'single');
            };
            // 批量禁用提示
            $scope.batchDisabled = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    $scope.showModal(-1,'batchIsDisabledModal');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            //批量禁用操作
            $scope.batchDisabledOp = function () {
                productInformationService.disabled($scope,'batch');
            };

            //显示模态框
            $scope.showModal = function (i,name) {
                if(i >= 0){
                    $scope.activeItem = $.extend({},$scope.tableList[i]);
                    //禁用
                    if($scope.activeItem.status == 2) {
                        return;
                    }
                }
                $(pageId + " #" + name).modal('show');
            };

            //新增商品
            $scope.add = function () {
                $rootScope.productParams = {
                    type: 'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/addProduct.html';
                $scope.option[index].name = '商品信息：新增商品信息';
            };

            //修改商品
            $scope.edit = function (i) {
                // 禁用状态下不能修改
                if($scope.tableList[i].status == 0 || $scope.tableList[i].status == 1) {
                    $rootScope.productParams = {
                        type: 'edit',
                        data: $scope.tableList[i]
                    };
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/productManage/addProduct.html';
                    $scope.option[index].name = '商品信息：修改商品信息';
                }
            };

            //商品详情
            $scope.detail = function (i) {
                $rootScope.productParams = {
                    data: $scope.tableList[i]
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/productInformationDetail.html';
                $scope.option[index].name = '商品信息：商品信息详情';
            };

            /*商品信息分页*/
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
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    productInformationService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
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