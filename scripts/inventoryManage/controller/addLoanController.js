/**
 * Created by lc on 2017/5/4.
 * 新增借出单逻辑
 */
angular.module("klwkOmsApp")
    .controller("addLoanController", ["$scope","$rootScope" ,"addLoanService","APP_MENU","APP_DATA",function($scope,$rootScope,addLoanService,APP_MENU,APP_DATA) {

        //进入页面需要执行的方法
        function init(){
            /*用户搜索条件*/
            $scope.formData={
                loginName : '',
                userName : '',
                departmentName : ''
            }

            // 商品搜索项
            $scope.productItem = {};


            if( APP_DATA.loanObj.loan && APP_DATA.loanObj.loanDetail){
                //选择商品集合
                $scope.loanList = APP_DATA.loanObj.loanDetail;

                /*借出单提交信息*/
                $scope.productFormDate = {
                    id:APP_DATA.loanObj.loan.id,
                    code:APP_DATA.loanObj.loan.code,
                    loanuser :  APP_DATA.loanObj.loan.loanuser,
                    contact : APP_DATA.loanObj.loan.contact,
                    warehouseid : APP_DATA.loanObj.loan.warehouseid,
                    note : APP_DATA.loanObj.noteloan,
                    loantype : APP_DATA.loanObj.loan.loantype,
                    status : APP_DATA.loanObj.loan.status,
                    expectreturndate :APP_DATA.loanObj.loan.expectreturndate,
                    isneedreturn : APP_DATA.loanObj.loan.isneedreturn,
                };
            }else{
                $scope.loanList =[];
                $scope.productFormDate = {
                    id:0,
                    loanuser : '',
                    contact : '',
                    warehouseid : '',
                    note : '',
                    loantype : '',
                    status:"",
                    expectreturndate :'',
                    isneedreturn : true,
                };
            };


            //初始化借出单列表配置
            $scope.columnList = [
                {name: "商品编号", tag: 'productcode'},
                {name: "商品名称", tag: 'productname'},
                {name: "规格编码", tag: 'code'},
                {name: "规格名称", tag: 'description'},
                {name: "申请数量", tag: 'planquantity'},
            ];
            //选择用户列表配置
            $scope.selectUserList = [
                {name: "用户名", tag: 'username'},
                {name: "部门名称", tag: 'departmentname'},
                {name: "手机", tag: 'mobile'},
                {name: "电话", tag: 'telephone'},
            ]

            //选择规格列配置
            $scope.theadSkuList = [
                {name: "商品编码", tag: 'productcode'},
                {name: "商品名称", tag: 'productname'},
                {name: "规格编码", tag: 'code'},
                {name: "规格名称", tag: 'description'},
                {name: "市场价", tag: 'firstprice'},
                {name: "重量", tag: 'weight'},
                {name: "备注", tag: 'note'}
            ];

            /*借调类型初始化*/
            $scope.LoanType = {
                isshow:false,
                info:APP_MENU.inventoryLoanType,
                objName:{id:APP_DATA.loanObj.loan?APP_DATA.loanObj.loan.loantype:''},
                onChange: function(obj,index){	//点击之后的回调
                    $scope.productFormDate.loantype = obj.id;
                }
            }

            /*借调仓库初始化*/
            $scope.loanWarehouse = {
                isshow:false,
                info:APP_DATA.storeList,
                objName:{id:APP_DATA.loanObj.loan?APP_DATA.loanObj.loan.warehouseid:''},
                onChange: function(obj,index){	//点击之后的回调
                    $scope.productFormDate.warehouseid = obj.id;
                }
            }

            addLoanService.queryWarehouseAll($scope);

            /*初始用户分页*/
            $scope.paginationProductConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [10,20, 50, 100, 500,1000],  //配置配置可选择每页显示记录数 array
                extClick : false , //当为外部点击翻页时为true
                type: 0 ,  // 上一页0  下一页1
                getPageIndex:function (currentPage,itemsPerPage) {
                    $scope.paginationProductConf.first = itemsPerPage * (currentPage-1) +1;
                    if($scope.paginationProductConf.totalItems / itemsPerPage  === currentPage){
                        $scope.paginationProductConf.last = $scope.paginationProductConf.totalItems;
                        addLoanService.queryUsers($scope);
                    }else{
                        $scope.paginationProductConf.last = currentPage * itemsPerPage;
                        addLoanService.queryUsers($scope);
                    }
                } ,
                onChange: function(){	//操作之后的回调
                    addLoanService.queryUsers(scope);
                }
            };

            /*商品规格分页*/
            $scope.paginationSkuConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 6,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [6, 15, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: function (currentPage, itemsPerPage) {
                    $scope.paginationSkuConf.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationSkuConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.paginationSkuConf.last = $scope.paginationSkuConf.totalItems;
                    } else {
                        $scope.paginationSkuConf.last = currentPage * itemsPerPage;
                    }
                },
                onChange: function () {	//操作之后的回调
                    addLoanService.queryGoods($scope);
                }
            };

        }
        /*页面元素绑定事件*/
        function eventBind() {

            /*返回*/
            $scope.returnAddLoan = function (name, url) {
                $scope.addTab(name,url);
            }

            //显示模态框
            $scope.showModal = function (name) {
                /*显示用户搜索模态框*/
                if (name == 'selectUserModal') {
                    if (!$scope.userList) {
                        addLoanService.queryUsers($scope, function () {
                            $(" #" + name).modal('show');
                        });
                    } else {
                        $(" #" + name).modal('show');
                    }
                } else if (name == 'productSpecModal') {
                    if (!$scope.tableSkuList) {
                        addLoanService.queryGoods($scope, function () {
                            $(" #" + name).modal('show');
                        });
                    } else {
                        $(" #" + name).modal('show');
                    }
                }
                ;
            };

            /*选择当前用户*/
            $scope.selectUser = function (obj) {
                $scope.userObj = obj;
            }

            /*确认选择当前用户*/
            $scope.userEnsure = function () {
                $scope.productFormDate.loanuser = $scope.userObj.username;
                $scope.productFormDate.contact = $scope.userObj.contact ? $scope.userObj.contact : '';
                $("#selectUserModal").modal('hide');
            }

            /*取消*/
            $scope.hideModal = function (name) {
                if (name == 'selectUserModal') {
                    $scope.userObj = '';
                    $scope.productFormDate = '';
                } else if (name == 'productSelectModal') {
                }
                $(" #" + name).modal('hide');
            }

            /*是否归还*/
            $scope.checkIsreturn = function () {
                $scope.productFormDate.isneedreturn = !$scope.productFormDate.isneedreturn;
            }

            // 关联商品搜索
            $scope.productSearchEnsure = function () {
                addLoanService.queryGoods($scope, 1, 6);
            };

            // 关联商品搜索取消
            $scope.productSearchCancel = function () {
                $scope.productItem = {};
            };

            // 关联用户搜索
            $scope.userSearchEnsure = function () {
                addLoanService.queryUsers($scope);
            }

            // 关联用户搜索取消
            $scope.userSearchCancel = function () {
                $scope.formData = {};
            };

            // 存储当前商品
            $scope.selectProduct = function (obj, e, type) {  //type 0 商品   1 规格  2组合
                $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                if (type == 1) {
                    addLoanService.getProductInventory($scope, obj);
                }
                $scope.acitveProductItem={
                    sku : obj,
                    skuid:obj.skuid,
                    planquantity: 1
                }
            };

            // 选择商品保存
            $scope.productEnsure = function (name) {
                $scope.loanList.push($.extend({}, $scope.acitveProductItem));
                $scope.hideModal(name);
            };

            /*新增借出单*/
            $scope.addBuySubmit = function () {
                addLoanService.loanSave($scope);


            }

            /*商品单选*/
            $scope.toggleSelect =function (obj,index,e) {
                var _this = $(e.target);
                if( _this.closest('label').find('.klwk-check').length > 0 ){
                    _this.closest('label').find('.klwk-check').removeClass('klwk-check').addClass('klwk-check-x');
                    obj.isDelete = true;
                }else if(_this.closest('label').find('.klwk-check-x').length > 0 ){
                    _this.closest('label').find('.klwk-check-x').removeClass('klwk-check-x').addClass('klwk-check');
                    obj.isDelete = false;
                }
            }

            /*删除选中商品*/
            $scope.deleteProduct = function () {
                var unDeleteList=[]
                $.each($scope.loanList,function (loanIndex, loanObj) {
                    if (loanObj.isDelete != true) {
                        unDeleteList.push(loanObj);
                    }
                })
                $scope.loanList = unDeleteList;
            }


        }
        init();
        eventBind();
    }]);