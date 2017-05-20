/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addPurchaseOrderController", ["$scope", "$rootScope", "addPurchaseOrderService","toolsService","validateService",
        function ($scope, $rootScope, addPurchaseOrderService,toolsService,validateService) {
            var pageId = '#addPurchaseOrder';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.purchaseOrderParams;  // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 商品信息列表配置
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                // 采购订单明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "采购数量", tag: 'purchaseqty'},
                    {name: "采购价", tag: 'currentprice'},
                    {name: "采购总金额", tag: 'purchaseamount'},
                    {name: "备注", tag: 'note'}
                ];
                //供应商信息列表配置
                $scope.theadSupplierList = [
                    {name: "供应商编码", tag: 'code'},
                    {name: "供应商简称", tag: 'shortname'},
                    {name: "供应商全称", tag: 'fullname'},
                    {name: "手机号码", tag: 'mobile'},
                    {name: "电话", tag: 'telephone'},
                    {name: "联系人", tag: 'contact'},
                    {name: "邮箱", tag: 'email'}
                ];
                //修改页面
                if (params.type == 'edit') {
                    // 基本信息
                    $scope.formData = {
                        'type':'edit',
                        'id': params.data.id,
                        // 采购时间
                        'purchasedate': params.data.purchasedate,
                        // 到货时间
                        'requestdeliverydate': params.data.requestdeliverydate,
                        // 供应商编码
                        'suppliercode': params.data.suppliercode,
                        // 供应商名称
                        'suppliername': params.data.suppliername,
                        // 收货仓库
                        'warehouseid': params.data.warehouseid,
                        'warehousename': params.data.warehousename,
                        'status': params.data.status,
                        // 备注
                        'remark': params.data.remark,
                        // 合同号
                        'contractno': params.data.contractno
                    };
                    // 采购订单明细
                    addPurchaseOrderService.purchaseDetail($scope);
                } else if (params.type == 'new') {
                    // 新增页面
                    $scope.formData = {
                        'type':'new'
                    };
                }
                // 全部仓库初始化
                addPurchaseOrderService.warehouseGetAll($scope);
                // 供应商管理搜索项
                $scope.supplierItem = {};
                // 供应商当前编辑项
                $scope.supplierActive = {};
                // 商品搜索项
                $scope.productItem = {};
                // 当前编辑项集合
                $scope.activeItemList = [];
                // 存储选中商品
                $scope.tableInfoList = [];
                // 存储删除商品
                $scope.deleteItem = [];
                //新增商品枚举值
                $scope.addOrder = 'addBefore';
                // 供应商初始化
                addPurchaseOrderService.supplierGet($scope);
                //收货仓库下拉框配置
                $scope.selectWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.warehouseid = obj.id;
                        $scope.formData.warehousename = obj.name;
                    }
                };
                addPurchaseOrderService.warehouseGet($scope);
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

            /*供应商模态框*/
            $scope.supplier = {
                // 搜索
                search:function () {
                    addPurchaseOrderService.supplierGet($scope,1,10);
                },
                //搜索清空
                searchCancel:function () {
                    $scope.supplierItem = {};
                    addPurchaseOrderService.supplierGet($scope,1,10);
                },
                //选中
                select:function (i,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    $scope.supplierActive = $.extend({},$scope.tableSupplierList[i]);
                },
                //确定
                ensure:function () {
                    $scope.formData.suppliercode = $scope.supplierActive.code;
                    $scope.formData.suppliername = $scope.supplierActive.shortname;
                    $(pageId + " input[name = 'supplier']").removeClass('klw-input-error').addClass('klw-input-success');
                    $scope.hideModal('supplierModal');
                }
            };

            /*新增商品模块 返回数组 ($scope.tableInfoList) */
            $scope.addProduct = {
                //初始化商品
                isInit:function () {
                    addPurchaseOrderService.productQuery($scope,1,10)
                },
                //搜索
                search: function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        addPurchaseOrderService.productQuery($scope,1,10,1);
                    }
                },
                // 模块之间显示隐藏
                module:function (module,type) {
                    $scope[module] = type;
                },
                //复选框改变单条数据的isdatacheck属性
                selectItem:function (i,name) {
                    $scope[name][i].isdatacheck = !$scope[name][i].isdatacheck;
                    $scope.isalldatacheck = true;
                    $.each($scope[name],function (index, obj) {
                        if(!obj.isdatacheck){
                            $scope.isalldatacheck = false;
                        }
                    });
                },
                //复选框改变所有数据的isdatacheck属性
                selectAll:function (name) {
                    if($scope.isalldatacheck){
                        $.each($scope[name],function (index, obj) {
                            obj.isdatacheck = false;
                            $scope.isalldatacheck = false;
                        })
                    }else{
                        $.each($scope[name],function (index, obj) {
                            obj.isdatacheck = true;
                            $scope.isalldatacheck = true;
                        })
                    }
                },
                //确定
                save:function () {
                    // 追加勾选的商品
                    $.each($scope.tableSkuList, function (index,obj) {
                        if(obj.isdatacheck) {
                            $scope.activeItemList.push(obj);
                        }
                    });
                    if($scope.activeItemList.length != 0) {
                        // 过滤已存在的商品
                        for(var i = 0; i < $scope.tableInfoList.length; i++) {
                            for(var j = 0; j < $scope.activeItemList.length; j++) {
                                if($scope.activeItemList[j].skuid == $scope.tableInfoList[i].skuid) {
                                    $scope.activeItemList.removeByValue($scope.activeItemList[j]);
                                }
                            }
                        }
                        $scope.tableInfoList = $scope.tableInfoList.concat($scope.activeItemList);
                        //是否全选
                        $scope.isalldatacheck = false;
                        $.each($scope.tableInfoList, function (index,obj) {
                            //默认数据未勾选
                            obj.isdatacheck = false;
                        });
                        $scope.addOrder = '';
                        $scope.activeItemList = [];
                    } else {
                        toolsService.alertMsg({content : '请选择要添加的商品！',time : 1000});
                    }
                },
                // 取消
                cancel:function () {
                    $scope.activeItemList = [];
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                },
                //批量删除
                delete:function () {
                    var isHasCheck = false;
                    $.each($scope.tableInfoList,function (index,obj) {
                        if(obj.isdatacheck){
                            isHasCheck = true;
                            return false;
                        }
                    });
                    if(isHasCheck){
                        // 删除的商品
                        $.each($scope.tableInfoList, function (index,obj) {
                            if(obj.isdatacheck) {
                                $scope.deleteItem.push(obj);
                            }
                        });
                        // 去除删除商品
                        $.each($scope.deleteItem, function (index,obj) {
                            if($scope.tableInfoList.contains(obj) != -1) {
                                if(!obj.editdata) {
                                    $scope.tableInfoList.removeByValue(obj);
                                } else {
                                    obj.deleted = true;
                                }
                                // 页面不显示已删除的商品
                                obj.isShow = false;
                            }
                        });
                    }else{
                        toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                    }
                    //是否全选
                    $scope.isalldatacheck = false;
                    $.each($scope.tableInfoList, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                },
                //查看仓库
                viewInventory:function (obj,i) {
                    $.each($scope.tableSupplierList, function (index,obj) {
                        obj.isSupplierSelect = false;
                    });
                    $scope.tableSupplierList[i].isSelect = true;
                    addPurchaseOrderService.getProductInventory($scope,obj);
                    $scope.acitveProductItem = $.extend({},obj);
                }
            };

            //保存采购订单
            $scope.saveOrder = function () {
                // 校验供应商编码和供应商名称
                if($scope.formData.suppliername) {
                    if(validateService.validateAll(pageId,'.add-input')) {
                        if($scope.tableInfoList.length!=0) {
                            $scope.tableData = [];
                            $.each($scope.tableInfoList, function (index,obj) {
                                $scope.tableData.push({
                                    "DetailId":obj.detailid,
                                    "CreateDate": obj.createdate?obj.createdate:"0001-01-01 00:00:00",
                                    "PurchaseOrderId": obj.purchaseorderid,
                                    "ProductId": obj.productid,
                                    "ProductCode": obj.productcode,
                                    "ProductName": obj.productname,
                                    "SkuId": obj.skuid,
                                    "SkuCode":  obj.skucode,
                                    "SkuName": obj.skuname,
                                    "PurchaseQty": obj.purchaseqty,
                                    "OriginalPrice": obj.originalprice?obj.originalprice:0,
                                    "CurrentPrice": obj.currentprice?obj.currentprice:0,
                                    "PurchaseAmount": obj.purchaseamount?obj.purchaseamount:0,
                                    "NoticeQty": obj.noticeqty?obj.noticeqty:0,
                                    "InStockQty": obj.instockqty?obj.instockqty:0,
                                    "NeedColor": true,
                                    "Deleted": obj.deleted,
                                    "IsNew": false,
                                    "IsUpdate": false
                                });
                            });
                            addPurchaseOrderService.savePurchase($scope,$scope.formData);
                        } else {
                            toolsService.alertMsg({content : '采购单明细不能为空!',time : 1000});
                        }
                    }
                } else {
                    $(pageId + " input[name='supplier']").addClass('klw-input-error');
                }
            };

            //返回采购订单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/purchaseList.html';
                $scope.option[index].name = '采购订单';
            };

            // 显示模态框
            $scope.showModal = function (name) {
                $(pageId + ' #' + name).modal('show');
                addPurchaseOrderService.supplierGet($scope,1,10);
            };

            // 隐藏模态框
            $scope.hideModal = function (name) {
                $(pageId + ' #' + name).modal('hide');
                $scope.supplierActive = {};
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

            /*供应商信息分页*/
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
                    addPurchaseOrderService.supplierGet($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;

            /*规格信息分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationSkuConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationSkuConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }
            };
            $scope.paginationSkuConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    addPurchaseOrderService.productQuery($scope, $scope.paginationSkuConf.currentPage, $scope.paginationSkuConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationSkuConf.itemsPerPage;

        }]);