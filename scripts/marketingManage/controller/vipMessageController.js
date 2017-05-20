/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("vipMessageController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "vipMessageService","APP_MENU",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, vipMessageService,APP_MENU) {

            function init() {
                //高级搜索input框内容
                $scope.searchObj1 = {
                    vipName: '',
                    vipCode: '',
                    consignee: '',
                    storeId: '',
                    tagName: '',
                    tagId: ''
                };
                $scope.searchObj = $.extend(true, {}, $scope.searchObj1);

                //特殊标识行变量
                $scope.simpleSelect={
                    isUrgent:''
                };
                //模糊搜索
                $scope.searchKeyup = function () {
                    if (event.keyCode == 13) {
                        $scope.search();
                    }
                };
                //搜索
                $scope.search = function () {
                    vipMessageService.CustomerGet($scope, 1, $scope.paginationConf.itemsPerPage, 0,false);
                };

                //清空
                $scope.empty = function () {
                    $scope.searchObj = $.extend(true, {}, $scope.searchObj1);
                    //重新渲染会员标记/店铺下拉框
                    $scope.selectStore.init();
                    $scope.selectTag.init();
                };

                //表格标记操作
                $scope.signFun= function (orderids,tagname) {
                    vipMessageService.CustomerAddTag($scope,orderids,tagname)
                };

                //查询列表数据
                vipMessageService.CustomerGet($scope, 1, 10, 0, true);

                //查询店铺
                vipMessageService.StoreGet($scope);

                //查询会员标记
                vipMessageService.GeneralClassiFicationGet($scope);

                //分页
                pageFun();

                //下拉框组件
                selectFun();

                //跳转页面
                $scope.goOther = function (content, i) {
                    var index = $('#vipMessage').closest('[data-index]').attr('data-index');
                    switch (content) {
                        case 'add':
                            $rootScope.params = {
                                type: 'add'
                            };
                            $scope.option[index].url = '../template/marketingManage/addVipMessage.html';
                            $scope.option[index].name = '会员信息：新增会员信息';
                            break;
                        case 'modify':
                            $rootScope.params = {
                                type: 'modify',
                                tableList:$scope.tableList[i]
                            };
                            $scope.option[index].url = '../template/marketingManage/addVipMessage.html';
                            $scope.option[index].name = '会员信息：修改会员信息';
                            break;
                    }
                };

                //高级搜索
                $scope.advancedSearchObj1 = {
                    //是否展开高级搜索，默认不展开
                    advancedSearch: false,

                    //高级搜索show函数
                    isShow: function (content, myEvent) {
                        toolsService.isShow($scope, content, myEvent);
                    }
                };

                $scope.advancedSearchObj = $.extend(true, {}, $scope.advancedSearchObj1);

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
                                $scope.simpleSelect.isUrgent=selType;
                                break;
                        }
                        vipMessageService.CustomerGet($scope, 1, $scope.paginationConf.itemsPerPage, 0,false);
                    });
                };
            }

            init();

            //列表配置
            $scope.theadList = [
                {name: "会员标记", tag: 'tagname'},
                {name: "加急发货", tag: 'speeddelivery'},
                {name: "会员编码", tag: 'code'},
                {name: "会员昵称", tag: 'name'},
                {name: "手机", tag: 'mobile'},
                {name: "固定电话", tag: 'telephone'},
                {name: "Email", tag: 'email'},
                {name: "性别", tag: 'sexName'},
                {name: "国家", tag: 'nationalname'},
                {name: "省", tag: 'provincename'},
                {name: "市", tag: 'cityname'},
                {name: "区", tag: 'countyname'},
                {name: "邮编", tag: 'zipcode'},
                {name: "收货人", tag: 'consignee'},
                {name: "收货地址", tag: 'address'},
                {name: "等级", tag: 'levelname'},
                {name: "消费金额", tag: 'price'},
                {name: "购买次数", tag: 'buytimes'},
                {name: "状态", tag: 'statusName'},
                {name: "所属店铺", tag: 'storename'}
            ];

            // 标题控制器指令的配置文件
            $scope.allocation = {
                "theadList": $scope.theadList,
                // 指令控制器的ID唯一标识
                "timestamp": null
            };

            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function () {
                $("#" + $scope.allocation.timestamp).show();
            };

            //分页插件
            function pageFun(){
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
                        vipMessageService.CustomerGet($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, 0,  false);
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

            //下拉框组件
            function selectFun(){
                //下拉选框插件 会员标记
                $scope.selectTag = {
                    isshow: false,
                    info: [],
                    objName: {id: $scope.searchObj.tagId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchObj.tagName = obj.name;
                        $scope.searchObj.tagId = obj.id;
                    }
                };

                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    info: [],
                    objName: {id: $scope.searchObj.storeId},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.searchObj.storeId = obj.id;
                    }
                };
            }

        }]);