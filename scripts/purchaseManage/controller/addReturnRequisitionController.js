/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addReturnRequisitionController", ["$scope", "$rootScope", "addReturnRequisitionService","toolsService","validateService",
        function ($scope, $rootScope, addReturnRequisitionService,toolsService,validateService) {
            var pageId = '#addReturnRequisition';   // 页面Id
            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.returnOrderParams;   // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 采购退货单明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "原始价格", tag: 'originalprice'},
                    {name: "退货金额", tag: 'purchasereturnamount'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "可退数量", tag: 'returnqty'}
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
                // 采购单号列表配置
                $scope.theadPurchaseList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "采购单号", tag: 'code'},
                    {name: "合同号", tag: 'contractno'},
                    {name: "采购日期", tag: 'purchasedate'},
                    {name: "到货时间", tag: 'requestdeliverydate'},
                    {name: "供应商编号", tag: 'suppliercode'},
                    {name: "供应商名称", tag: 'suppliername'},
                    {name: "收货仓库", tag: 'warehousename'},
                    {name: "采购员", tag: 'purchasepersonname'},
                    {name: "审核人", tag: 'approvaluser'},
                    {name: "审核时间", tag: 'approvaldate'},
                    {name: "备注", tag: 'remark'}
                ];
                if (params.type == 'edit') {
                    //修改页面
                    $scope.formData = {
                        'type':'edit',
                        'Id': params.data.id,
                        // 采购单号
                        'Code': params.data.code,
                        // 供应商编码
                        "SupplierCode": params.data.suppliercode,
                        // 供应商名称
                        "SupplierName": params.data.suppliername,
                        // 退货仓库
                        'WarehouseId': params.data.warehouseid,
                        'WarehouseName': params.data.warehousename,
                        // 占用仓库
                        'VirtualWarehouseName': params.data.VirtualWarehouseName,
                        'VirtualWarehouseId': params.data.virtualwarehouseid,
                        // 退货原因
                        "TypeCode":params.data.typecode,
                        'TypeName': params.data.typename,
                        // 备注
                        "Remark":params.data.remark
                    };
                    // 采购退货单明细
                    addReturnRequisitionService.purchaseDetail($scope);
                } else if (params.type == 'new') {
                    // 新增页面
                    $scope.formData = {
                        'type':'new'
                    };
                }
                // 收货仓库下拉框配置
                $scope.selectWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.WarehouseId = obj.id;
                        $scope.formData.WarehouseName = obj.name;
                        // 获取入库仓库
                        addReturnRequisitionService.occupyWarehouseGet($scope);
                    }
                };
                addReturnRequisitionService.returnWarehouse($scope);
                // 占用仓库下拉框配置
                $scope.selectVirtualWarehouse = {
                    isshow: false,
                    info:[],
                    validate:true,
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.VirtualWarehouseId = obj.id;
                        $scope.formData.VirtualWarehouseName = obj.name;
                    }
                };
                if($scope.formData.type == 'edit') {
                    addReturnRequisitionService.occupyWarehouseGet($scope);
                }
                // 退库原因下拉框配置
                $scope.selectReason = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.TypeCode = obj.code;
                        $scope.formData.TypeName = obj.name;
                    }
                };
                addReturnRequisitionService.returnReason($scope);
                // 采购单号搜索
                $scope.purchaseItem = {};
                //采购单号当前编辑项
                $scope.purchaseActive = {};
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

            /*采购单号模态框*/
            $scope.purchase = {
                //搜索
                search:function () {
                    addReturnRequisitionService.purchaseGet($scope,1,10);
                },
                // 搜索取消
                searchCancel:function () {
                    $scope.purchaseItem = {};
                    addReturnRequisitionService.purchaseGet($scope,1,10);
                },
                // 选中信息
                select:function (i,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    $scope.purchaseActive = $.extend({},$scope.tablePurchaseList[i]);
                    addReturnRequisitionService.purchaseOrderDetail($scope,$scope.purchaseActive);
                },
                // 确定
                ensure:function () {
                    // 采购单号
                    $scope.formData.Code = $scope.purchaseActive.code;
                    // 退货仓库
                    $scope.formData.WarehouseId = $scope.purchaseActive.warehouseid;
                    $scope.formData.WarehouseName = $scope.purchaseActive.warehousename;
                    $scope.selectWarehouse.objName = {id:$scope.formData.WarehouseId};
                    // 入库仓库
                    $scope.formData.VirtualWarehouseId = $scope.purchaseActive.virtualwarehouseid;
                    $scope.formData.VirtualWarehouseName = $scope.purchaseActive.virtualwarehousename;
                    $scope.selectVirtualWarehouse.objName = {id:$scope.formData.VirtualWarehouseId};
                    // 供应商编码
                    $scope.formData.SupplierCode = $scope.purchaseActive.suppliercode;
                    // 供应商名称
                    $scope.formData.SupplierName = $scope.purchaseActive.suppliername;
                    $.each($scope.purchaseDetailData, function (index,obj) {
                        $scope.tableInfoList.push(obj);
                    });
                    $scope.hideModal('purchaseModal');
                    if($scope.formData.SupplierCode) {
                        $(pageId + " input[name='supplier']").removeClass('klw-input-error').addClass('klw-input-success');
                    }
                    $(pageId + " input[name='code']").removeClass('klw-input-error').addClass('klw-input-success');
                }
            };

            /*供应商模态框*/
            $scope.supplier = {
                // 搜索
                search:function () {
                    addReturnRequisitionService.supplierGet($scope,1,10);
                },
                //搜索清空
                searchCancel:function () {
                    $scope.supplierItem = {};
                    addReturnRequisitionService.supplierGet($scope,1,10);
                },
                //选中
                select:function (i,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    $scope.supplierActive = $.extend({},$scope.tableSupplierList[i]);
                },
                //确定
                ensure:function () {
                    $scope.formData.SupplierCode = $scope.supplierActive.code;
                    $scope.formData.SupplierName = $scope.supplierActive.shortname;
                    $scope.hideModal('supplierModal');
                }
            };

            /*采购退货单明细模块*/
            $scope.addProduct = {
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
                }
            };

            //保存采购退货单
            $scope.saveOrder = function () {
                // 校验采购编号
                if($scope.formData.Code) {
                    // 校验供应商编码
                    if($scope.formData.SupplierCode) {
                        if(validateService.validateAll(pageId,'.add-input')) {
                            $scope.tableData = [];
                            $.each($scope.tableInfoList, function (index,obj) {
                                $scope.tableData.push({
                                    "DetailId":obj.detailid,
                                    "CreateDate": obj.createdate?obj.createdate:"0001-01-01 00:00:00",
                                    "PurchaseReturnOrderId": obj.purchasereturnorderid,
                                    "ProductId": obj.productid,
                                    "ProductCode": obj.productcode,
                                    "ProductName": obj.productname,
                                    "SkuId": obj.skuid,
                                    "SkuCode": obj.skucode,
                                    "SkuName": obj.skuname,
                                    "PlanQty": obj.planqty,
                                    "ReturnQty": obj.returnqty,
                                    "OriginalPrice": obj.originalprice,
                                    "OutStockQty": obj.outstockqty?obj.outstockqty:0,
                                    "PurchaseReturnAmount": obj.purchasereturnamount?obj.purchasereturnamount:0,
                                    "InputQty": obj.inputqty?obj.inputqty:0,
                                    "OutCanAllocationQty": obj.outcanallocationqty?obj.outcanallocationqty:0,
                                    "CanNoticeQty": obj.cannoticeqty?obj.cannoticeqty:0,
                                    "Deleted": obj.deleted,
                                    "IsNew": false,
                                    "IsUpdate": true
                                });
                            });
                            addReturnRequisitionService.savePurchase($scope,$scope.formData);
                        }

                    } else {
                        $(pageId + " input[name='supplier']").addClass('klw-input-error');
                    }
                } else {
                    $(pageId + " input[name='code']").addClass('klw-input-error');
                }
            };

            //返回采购退货单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/returnRequisitionList.html';
                $scope.option[index].name = '采购退货单';
            };

            // 显示模态框
            $scope.showModal = function (name) {
                $scope.activeItemList = [];
                $(pageId + ' #' + name).modal('show');
                if(name == 'supplierModal') {
                    // 调用供应商信息
                    addReturnRequisitionService.supplierGet($scope,1,10);
                } else if(name == 'purchaseModal'){
                    // 调用采购单号
                    addReturnRequisitionService.purchaseGet($scope,1,10);
                }

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
                    addReturnRequisitionService.supplierGet($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;

            /*采购单号分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationNumConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationNumConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }
            };
            $scope.paginationNumConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    addReturnRequisitionService.purchaseGet($scope, $scope.paginationNumConf.currentPage, $scope.paginationNumConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationNumConf.itemsPerPage;
        }]);