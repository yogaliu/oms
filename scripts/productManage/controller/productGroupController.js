/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("productGroupController", ["$scope", "$rootScope", "productGroupService","toolsService",
        function ($scope, $rootScope, productGroupService,toolsService) {
            var pageId = '#productGroup';  // 页面ID
            //进入页面需要执行的方法
            function init() {
                //列表配置
                $scope.theadList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "套装编码", tag: 'code'},
                    {name: "礼盒编码", tag: 'giftskucode'},
                    {name: "套装名称", tag: 'description'},
                    {name: "套装分类", tag: 'categoryname'},
                    {name: "套装规格", tag: 'productsize'},
                    {name: "礼盒", tag: 'isgift'},
                    {name: "重量", tag: 'weight'},
                    {name: "销售价", tag: 'wholesaleprice'},
                    {name: "备注", tag: 'note'}
                ];
                productGroupService.query($scope,1,10);
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'groupConfig'
                };
                // 批量操作插件
                $scope.batch ={
                    isshow:false,
                    info:[
                        {name:'审核'},
                        {name:'禁用'}
                    ],
                    objName:{name:'批量操作'},
                    onChange: function(obj,index){	//点击之后的回调
                        switch(index) {
                            case 0:
                                $scope.batchAudit();
                                break;
                            case 1:
                                $scope.batchDisabled();
                                break;
                        }
                    }
                };
                //高级搜索，默认不展开
                $scope.showSearchElement = true;
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
                    productGroupService.query($scope,1,10,1);
                }
            };

            //高级搜索
            $scope.search = function (type) {
                if(type == 'unfold') {
                    $scope.showSearchElement = false;
                }else if(type == 'ensure') {
                    productGroupService.query($scope,1,10,1);
                    $scope.showSearchElement = true;
                } else if (type == 'cancel'){
                    $scope.showSearchElement = true;
                } else {
                    $scope.searchItem = {};
                }
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
                    productGroupService.audit($scope,'single');
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
                    productGroupService.audit($scope,'batch');
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };

            //禁用
            $scope.singleDisabledOp = function () {
                productGroupService.disabled($scope,'single');
            };
            //批量禁用提示
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
                productGroupService.disabled($scope,'batch');
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

            // 新增套装
            $scope.add = function () {
                $rootScope.groupParams = {
                    type:'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/addGroup.html';
                $scope.option[index].name = '组合套装：新增套装';
            };

            // 修改套装
            $scope.edit = function (i) {
                // 禁用状态不能修改
                if($scope.tableList[i].status == 0 || $scope.tableList[i].status == 1) {
                    $rootScope.groupParams = {
                        type:'edit',
                        data: $scope.tableList[i]
                    };
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/productManage/addGroup.html';
                    $scope.option[index].name = '组合套装：修改套装';
                }

            };

            // 套装详情
            $scope.detail = function (obj) {
                $rootScope.groupParams = {
                    data: obj
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/groupDetail.html';
                $scope.option[index].name = '组合套装：组合套装详情';
            };

            /*组合套装分页*/
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
                    productGroupService.query($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
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