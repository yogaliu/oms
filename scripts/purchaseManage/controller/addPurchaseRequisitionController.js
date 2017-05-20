/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addPurchaseRequisitionController", ["$scope", "$rootScope", "addPurchaseRequisitionService","toolsService","validateService",
        function ($scope, $rootScope, addPurchaseRequisitionService,toolsService,validateService) {
            var pageId = '#addPurchaseRequisition';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.requisitionParams;  // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 采购通知单明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "可通知数量", tag: 'cannoticeqty'},
                    {name: "到货数量", tag: 'purchaseqty'},
                    {name: "通知数量", tag: 'noticeqty'},
                    {name: "通知超额数量", tag: 'cannoticediff'}
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
                //修改页面
                if (params.type == 'edit') {
                    // 基本信息
                    $scope.formData = {
                        'type':'edit',
                        'Id': params.data.id,
                        // 采购单号
                        'Code': params.data.code,
                        'PurchaseOrderCode': params.data.purchaseordercode,
                        'PurchaseOrderId': params.data.purchaseorderid,
                        // 入库仓库
                        "VirtualWarehouseId": params.data.virtualwarehouseid,
                        "VirtualWarehouseName": params.data.virtualwarehousename,
                        // 收货仓库
                        'WarehouseId': params.data.warehouseid,
                        'WarehouseName': params.data.warehousename,
                        'Status': params.data.status,
                        // 备注
                        'Remark': params.data.remark,
                        // 到货批次号
                        'ArriveBatchNo': params.data.arrivebatchno,
                        'CreateUserName':params.data.createusername,
                        'CreateDate':params.data.createdate,
                        'Details': []
                    };
                    // 采购明细
                    addPurchaseRequisitionService.purchaseDetail($scope);
                }
                // 新增页面
                else if (params.type == 'new') {

                    $scope.formData = {
                        'type':'new'
                    };
                }
                // 收货仓库下拉框配置
                $scope.selectWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.WarehouseId = obj.id;
                        $scope.formData.WarehouseName = obj.name;
                        // 获取入库仓库
                        addPurchaseRequisitionService.VirtualWarehouseGet($scope);
                    }
                };
                addPurchaseRequisitionService.warehouseGet($scope);
                // 入库仓库下拉框配置
                $scope.selectVirtualWarehouse = {
                    isshow: false,
                    info:[],
                    validate:true,
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.VirtualWarehouseId = obj.id;
                        $scope.formData.VirtualWarehouseName = obj.name;
                    }
                };
                if($scope.formData.type == 'edit') {
                    addPurchaseRequisitionService.VirtualWarehouseGet($scope);
                }
                // 采购单号搜索
                $scope.purchaseItem = {};
                //采购单号当前编辑项
                $scope.purchaseActive = {};
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

            /*采购单号*/
            $scope.purchase = {
                //搜索
                search:function () {
                    addPurchaseRequisitionService.purchaseGet($scope,1,10);
                },
                // 搜索取消
                searchCancel:function () {
                    $scope.purchaseItem = {};
                    addPurchaseRequisitionService.purchaseGet($scope,1,10);
                },
                // 选中信息
                select:function (i,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    $scope.purchaseActive = $.extend({},$scope.tablePurchaseList[i]);
                    addPurchaseRequisitionService.purchaseOrderDetail($scope,$scope.purchaseActive);
                },
                // 确定
                ensure:function () {
                    // 采购单号
                    $scope.formData.PurchaseOrderCode = $scope.purchaseActive.code;
                    $scope.formData.PurchaseOrderId = $scope.purchaseActive.id;
                    // 收货仓库
                    $scope.formData.WarehouseName = $scope.purchaseActive.warehousename;
                    $scope.formData.WarehouseId = $scope.purchaseActive.warehouseid;
                    $scope.selectWarehouse.objName = {id:$scope.formData.WarehouseId};
                    // 入库仓库
                    $scope.formData.VirtualWarehouseName = $scope.purchaseActive.virtualwarehousename;
                    $scope.formData.VirtualWarehouseId = $scope.purchaseActive.virtualwarehouseid;
                    $scope.selectVirtualWarehouse.objName = {id:$scope.formData.VirtualWarehouseId};
                    // 采购通知单明细
                    $.each($scope.purchaseDetailData, function (index,obj) {
                        $scope.tableInfoList.push(obj);
                    });
                    $scope.hideModal('purchaseModal');
                    $(pageId + " input[name='code']").removeClass('klw-input-error').addClass('klw-input-success');
                }
            };

            /*采购通知单明细模块*/
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

            //保存采购通知单
            $scope.saveOrder = function () {
                // 校验采购单号
                if($scope.formData.PurchaseOrderCode) {
                    if(validateService.validateAll(pageId,'.add-input')){
                        if($scope.tableInfoList.length!=0) {
                            $scope.tableData = [];
                            $.each($scope.tableInfoList, function (index,obj) {
                                $scope.tableData.push({
                                    "DetailId":$scope.formData.type == 'edit'?obj.detailid:"00000000-0000-0000-0000-000000000000",
                                    "PurchaseNoticeOrderId": obj.purchasenoticeorderid,
                                    "ProductId": obj.productid,
                                    "ProductCode": obj.productcode,
                                    "ProductName": obj.productname,
                                    "SkuId": obj.skuid,
                                    "SkuCode":  obj.skucode,
                                    "SkuName": obj.skuname,
                                    "PurchaseQty": obj.purchaseqty,
                                    "NoticeQty": obj.noticeqty,
                                    "StockInQty": obj.stockinqty?obj.stockinqty:0,
                                    "IsNotEqual":false,
                                    "CanNoticeQty": obj.cannoticeqty,
                                    "DefectiveQuantity": obj.defectivequantity?obj.defectivequantity:0,
                                    "NeedColor": false,
                                    "Deleted": obj.deleted,
                                    "IsNew": false,
                                    "IsUpdate": false
                                });
                            });
                            addPurchaseRequisitionService.savePurchase($scope, $scope.formData);
                        }else {
                            toolsService.alertMsg({content : '采购单明细不能为空!',time : 1000});
                        }
                    }
                } else{
                    $(pageId + " input[name='code']").addClass('klw-input-error');
                }
            };

            //返回采购通知单
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/purchaseManage/purchaseRequisitionList.html';
                $scope.option[index].name = '采购通知单';
            };

            // 显示模态框
            $scope.showModal = function (name) {
                $(pageId + ' #' + name).modal('show');
                addPurchaseRequisitionService.purchaseGet($scope,1,10);
            };
            // 隐藏模态框
            $scope.hideModal = function (name) {
                $(pageId + ' #' + name).modal('hide');
                $scope.purchaseActive = {};
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
                    addPurchaseRequisitionService.purchaseGet($scope, $scope.paginationNumConf.currentPage, $scope.paginationNumConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationNumConf.itemsPerPage;

        }]);