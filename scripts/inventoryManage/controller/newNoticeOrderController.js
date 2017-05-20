/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .controller("newNoticeOrderController", ["$scope","newNoticeOrderService","$rootScope","toolsService","validateService",
        function($scope,newNoticeOrderService,$rootScope,toolsService,validateService) {
            var pageId = "#newNoticeOrder";    // 页面Id
            function init(){
                var params = $rootScope.transferNoticeParams;  // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 计划单号列表配置
                $scope.theadCodeList = [
                    {name: "出库计划单", tag: 'code'},
                    {name: "调入仓库", tag: 'inwarehousename'},
                    {name: "调出仓库", tag: 'outwarehousename'},
                    {name: "审核时间", tag: 'audituser'},
                    {name: "备注", tag: 'remark'}
                ];
                // 调拨通知单明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "通知数量", tag: 'noticeQty'},
                    {name: "导入数量", tag: 'importqty'},
                    {name: "可出库数量", tag: 'outCanAllocationQtyc'}
                ];
                if(params.type == 'edit'){
                    // 修改页面
                    $scope.formData = {
                        "type":'edit',
                        "Id":params.data.id,
                        // 计划单号
                        "AllocationPlanCode":params.data.code,
                        // 调入仓库
                        "InWarehouseId": params.data.inwarehouseid,
                        "InWarehouseName": params.data.inwarehousename,
                        // 调出仓库
                        "OutWarehouseId": params.data.outwarehouseid,
                        "OutWarehouseName": params.data.outwarehousename,
                        // 备注
                        "Remark": params.data.remark
                    };
                    // 调拨通知单明细
                    newNoticeOrderService.getTransferDetail($scope);
                } else {
                    // 新增页面
                    $scope.formData = {
                        "type":'new'
                    };
                }
                //调入仓库下拉框配置
                $scope.selectInWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.InWarehouseId = obj.id;
                        $scope.formData.InWarehouseName = obj.name;
                    }
                };
                newNoticeOrderService.getInWarehouse($scope);
                // 当前编辑项
                $scope.activeItem = {};
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
            }
            init();

            /*计划单号模块*/
            $scope.addCode = {
                // 搜索
                search: function () {
                    $.each($scope.tableCodeList, function (index,obj) {
                        if (JSON.stringify(obj).indexOf($scope.searchCode) != -1) {
                            obj.isHide = false;
                        } else {
                            obj.isHide = true;
                        }
                    });
                },
                // 选择
                select: function (i,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    $scope.activeItem = $.extend({},$scope.tableCodeList[i]);
                    newNoticeOrderService.getMaterialDetail($scope,$scope.activeItem);
                },
                // 确定
                save: function () {
                    $scope.formData = {
                        // 计划单号
                        "AllocationPlanCode":$scope.activeItem.code,
                        // 调入仓库
                        "InWarehouseId": $scope.activeItem.inwarehouseid,
                        "InWarehouseName": $scope.activeItem.inwarehousename,
                        // 调出仓库
                        "OutWarehouseId": $scope.activeItem.outwarehouseid,
                        "OutWarehouseName": $scope.activeItem.outwarehousename,
                        // 备注
                        "Remark": $scope.activeItem.remark
                    };
                    $(pageId + " input[name = 'code']").removeClass('klw-input-error').addClass('klw-input-success');
                    $scope.selectInWarehouse.setValue({id: $scope.formData.InWarehouseId});
                    $.each($scope.materialData, function (index,obj) {
                        $scope.tableInfoList.push(obj);
                    });
                    $scope.hideModal('codeModal');
                }
            };

            /*新增商品模块 返回数组 ($scope.tableInfoList)*/
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
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                }
            };

            // 显示模态框
            $scope.showModal = function (name) {
                if($scope.formData.type == 'edit') {
                    if(name == 'codeModal') {
                        return -1;
                    }
                } else if ($scope.formData.type == 'new') {
                    // 清空搜索条件
                    $scope.searchCode = '';
                    newNoticeOrderService.allocationPlan($scope);
                }
                $("#" + name).modal("show");
            };

            //隐藏模态框
            $scope.hideModal = function (name) {
                $("#" + name).modal("hide");
            };

            //返回
            $scope.goBack = function () {
                if($scope.formData.type == 'edit') {
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/inventoryManage/materialTransfer.html';
                    $scope.option[index].name = '实物调拨';
                } else if($scope.formData.type == 'new') {
                    var index = $(pageId).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/inventoryManage/transferNotice.html';
                    $scope.option[index].name = '调拨通知单';
                }
            };

            // 保存
            $scope.saveTransfer = function () {
                // 校验计划单号
                if($scope.formData.AllocationPlanCode) {
                    if(validateService.validateAll(pageId,'.add')) {
                        $scope.tableData = [];
                        // 可调数量为0的商品
                        $scope.quantityArr = [];
                        $.each($scope.tableInfoList, function (index,obj) {
                            if(obj.noticeQty == 0 || obj.noticeQty == undefined) {
                                $scope.quantityArr.push(obj);
                            }
                        });
                        if($scope.quantityArr.length == 0) {
                            $.each($scope.tableInfoList, function (index,obj) {
                                $scope.tableData.push({
                                    "Id": obj.id,
                                    "AllocationOutCode":$scope.formData.AllocationPlanCode,
                                    "ProductId": obj.productid,
                                    "ProductCode": obj.productcode,
                                    "ProductName": obj.productname,
                                    "ProductSkuId": obj.productskuid,
                                    "ProductSkuCode": obj.productskucode,
                                    "ProductSkuName": obj.productskuname,
                                    "OutQty": obj.outqty?obj.outqty:0,
                                    "InQty": obj.inqty?obj.inqty:0,
                                    "ImportQty":obj.importqty,
                                    "NoticeQty ": obj.noticeQty,
                                    "CanOutQty": obj.canoutqty,
                                    "Deleted": obj.deleted,
                                    "IsNew": false,
                                    "IsUpdate": true
                                });
                            });
                            newNoticeOrderService.save($scope,$scope.formData);
                        } else {
                            $scope.showModal('errorModal');
                        }
                    }
                } else {
                    $(pageId + " input[name='code']").addClass('klw-input-error');
                }
            };

            /*商品分页*/
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
                    newNoticeOrderService.getProduct($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;

        }]);