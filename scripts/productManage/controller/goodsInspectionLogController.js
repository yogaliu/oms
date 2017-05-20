/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("goodsInspectionLogController", ["$scope", "$rootScope", "goodsInspectionLogService","ApiService","toolsService",
        function ($scope, $rootScope, goodsInspectionLogService,ApiService,toolsService) {
            var pageId = '#goodsInspectionLog';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                /**
                 * getStore 获取店铺数据
                 * query 监听以上店铺数据有值时才查询页面数据 否则请求以上
                 */
                var promise = ApiService.listenAll(function(deffer){
                    goodsInspectionLogService.getStore($scope,deffer);
                });
                promise.then(function(){
                    goodsInspectionLogService.query($scope,1,10);
                });
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
                //高级搜索 字母初始化
                $scope.singleWord = ['全部','A','B','C','D','E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                //店铺初始化
                $scope.store = 'radio';
                // 高级搜索店铺显示配置
                $scope.radioStore = {
                    'status':'selecting'
                };
                // 若长度为0,则不显示高级搜索配置
                $scope.num = [];
                // 搜索项
                $scope.searchItem = {};
                //列表配置
                $scope.theadList = [
                    {name: "店铺", tag: 'storename'},
                    {name: "平台商品ID", tag: 'platformid'},
                    {name: "平台规格ID", tag: 'platformskuid'},
                    {name: "商家商品编码", tag: 'productcode'},
                    {name: "商家规格编码", tag: 'skucode'},
                    {name: "内容", tag: 'note'},
                    {name: "操作日期", tag: 'createdate'},
                    {name: "操作人", tag: 'createusername'}
                ];
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'logConfig'
                };
            }
            init();

            //联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    goodsInspectionLogService.query($scope,1,10,1);
                }
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    goodsInspectionLogService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                    $scope.radioStore.status = 'selecting';
                    $scope.searchStore = $scope.singleWordData['data'];
                    $scope.num = [];
                }
            };

            // 店铺模块(单选&更多&多选)
            $scope.module = function (item,type) {
                $scope[item] = type;
                $scope.searchStore = $scope.singleWordData['data'];
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
                $scope.searchStore = $scope.singleWordData['data'];
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
                $(pageId + ' .wordSearch span').removeClass('current');
                $scope.searchStore = $scope[module]['data'];
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

            /*铺货日志分页*/
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
                    goodsInspectionLogService.query($scope,$scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage1,1);
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