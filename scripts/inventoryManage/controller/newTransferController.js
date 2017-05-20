/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("newTransferController", ["$scope","newTransferService","$rootScope","toolsService","validateService",
        function($scope,newTransferService,$rootScope,toolsService,validateService) {
            var pageId = "#newTransfer";  // 页面Id
            function init(){
                var params = $rootScope.transferParams;  // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 商品信息列表配置
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                // 虚拟调拨单明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "调拨数量", tag: 'canquantity'},
                    {name: "可调数量", tag: 'canusequantity'},
                    {name: "计划数量", tag: 'planqty'}
                ];
                if(params.type == 'edit'){
                    console.log(params);
                    // 修改页面
                    $scope.formData = {
                        'type':'edit',
                        "id":params.data.id,
                        // 调入仓库
                        "InWarehouseId": params.data.inwarehouseid,
                        "InWarehouseName": params.data.inwarehousename,
                        // 调出仓库
                        "OutWarehouseId": params.data.outwarehouseid,
                        "OutWarehouseName": params.data.outwarehousename,
                        // 备注
                        "Remark": params.data.remark

                    };
                    // 虚拟调拨单明细
                    newTransferService.getDetail($scope);
                } else {
                    // 新增页面
                    $scope.formData = {
                        'type':'new'
                    };
                }
                // 初始化加载全部仓库
                newTransferService.warehouseGetAll($scope);
                // 调出仓库下拉框配置
                $scope.selectOutWarehouse = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.OutWarehouseId = obj.id;
                        $scope.formData.OutWarehouseName = obj.name;
                        $scope.formData.ParentId = obj.parentid;
                        // 获取调入仓库
                        newTransferService.getInWarehouse($scope);
                    }
                };
                newTransferService.getOutWarehouse($scope);
                // 调入仓库下拉框配置
                $scope.selectInWarehouse = {
                    isshow: false,
                    validate:true,
                    info:[],
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.formData.InWarehouseId = obj.id;
                        $scope.formData.InWarehouseName = obj.name;
                    }
                };
                if($scope.formData.type == 'edit') {
                    newTransferService.getInWarehouse($scope);
                }
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

            /*新增商品模块 返回数组 ($scope.tableInfoList)*/
            $scope.addProduct = {
                //初始化商品
                isInit:function () {
                    if($scope.formData.InWarehouseName != $scope.formData.OutWarehouseName) {
                        $scope.addOrder = 'addSelect';
                        newTransferService.productQuery($scope,1,10);
                    } else {
                        toolsService.alertMsg({content : '调入仓库和调出仓库不能一样！',time : 1000});
                    }
                },
                //搜索
                search: function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        newTransferService.productQuery($scope,1,10,1);
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
                    if($scope.activeItemList.length!=0) {
                        // 过滤已存在的商品
                        for(var i = 0; i < $scope.tableInfoList.length; i++) {
                            for(var j = 0; j < $scope.activeItemList.length; j++) {
                                if($scope.activeItemList[j].skuid == $scope.tableInfoList[i].skuid) {
                                    $scope.activeItemList.removeByValue($scope.activeItemList[j]);
                                }
                            }
                        }
                        $scope.addOrder = '';
                        var skuIdArr = [];  // 存储勾选商品
                        $.each($scope.activeItemList, function (index,obj) {
                            skuIdArr.push(obj.skuid);
                        });
                        // 获取可调数量
                        newTransferService.getInventoryNum($scope,skuIdArr.join(',').toLowerCase());
                    } else {
                        toolsService.alertMsg({content : '请选择要添加的商品',time : 1000});
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
                viewInventory:function (obj,e) {
                    $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                    newTransferService.getInventory($scope,obj);
                    $scope.acitveProductItem = $.extend({},obj);
                }
            };

            //返回
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/virtualTransfer.html';
                $scope.option[index].name = '虚拟调拨';
            };

            // 保存
            $scope.saveTransfer = function () {
                if(validateService.validateAll(pageId,'.add')){
                    if($scope.tableInfoList.length!=0){
                        // 新增商品调拨数量为0的商品
                        $scope.quantityArr = [];
                        $scope.tableData = [];
                        $.each($scope.tableInfoList, function (index,obj) {
                            if(obj.canquantity == 0 || obj.canquantity == undefined) {
                                $scope.quantityArr.push(obj);
                            }
                        });
                        if($scope.quantityArr.length == 0) {
                            $.each($scope.tableInfoList, function (index,obj) {
                                $scope.tableData.push({
                                    "Id": obj.id,
                                    "CreateDate": obj.createdate?obj.createdate:"0001-01-01 00:00:00",
                                    "VirtualWarehouseTransferId": $scope.formData.type == 'edit'?obj.Virtualwarehousetransferid:0,
                                    "ProductId": obj.productid,
                                    "ProductCode": obj.productcode,
                                    "ProductName": obj.productname,
                                    "ProductSkuId": obj.skuid,
                                    "ProductSkuCode": obj.productskucode,
                                    "ProductSkuName": obj.productskuname,
                                    "Quantity":obj.canquantity,
                                    "ActualQuantity": obj.actualquantity?obj.actualquantity:0,
                                    "InWarehouseCanQuantity": obj.inWarehousecanquantity?obj.inWarehousecanquantity:0,
                                    "OutWarehouseCanQuantity": obj.outwarehousecanquantity?obj.outwarehousecanquantity:0,
                                    "PlanQuantity": obj.planqty,
                                    "CanQuantity": obj.canusequantity,
                                    "Deleted": obj.deleted,
                                    "IsNew": false,
                                    "IsUpdate": true
                                });
                            });
                            newTransferService.save($scope,$scope.formData);
                        } else {
                            $scope.showModal('errorModal');
                        }
                    } else {
                        toolsService.alertMsg({content : '调拨单明细不能为空!',time : 1000});
                    }
                }
            };

            // 显示模态框
            $scope.showModal = function (name) {
                $('#' + name).modal('show');
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
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    newTransferService.productQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;

        }]);