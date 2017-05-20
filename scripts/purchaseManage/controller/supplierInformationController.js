/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("supplierInformationController", ["$scope", "$rootScope", "supplierInformationService",
        function ($scope, $rootScope, supplierInformationService) {
            var pageId = '#supplierInformation';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                //供应商列表配置
                $scope.theadList = [
                    {name: "供应商编码", tag: 'code'},
                    {name: "供应商简称", tag: 'shortname'},
                    {name: "供应商全称", tag: 'fullname'},
                    {name: "手机号码", tag: 'mobile'},
                    {name: "电话", tag: 'telephone'},
                    {name: "联系人", tag: 'contact'},
                    {name: "邮箱", tag: 'email'},
                    {name: "网址", tag: 'website'},
                    {name: "传真", tag: 'faxNumber'},
                    {name: "地址", tag: 'address'},
                    {name: "备注", tag: 'remarks'},
                    {name: "结算方式", tag: 'suppliersettlementtypename'}
                ];
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'supplierConfig'
                };
                supplierInformationService.query($scope,1,10);
            }

            init();

            //采购管理默认页
            $rootScope.activePage = "purchaseManage";

            //联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    supplierInformationService.query($scope,1,10,1);
                }
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };

            //新增供应商信息
            $scope.add = function () {
                $rootScope.supplierParams = {
                    type:'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/addSupplierInformation.html';
                $scope.option[index].name = '供应商信息：新增供应商信息';
            };

            //修改供应商信息
            $scope.edit = function (i) {
                $rootScope.supplierParams = {
                    data:$scope.tableList[i],
                    type:'edit'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/addSupplierInformation.html';
                $scope.option[index].name = '供应商信息：修改供应商信息';
            };

            /*供应商分页*/
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
                    supplierInformationService.query($scope,$scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage,1);
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