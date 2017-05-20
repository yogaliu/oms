/**
 * Created by cj on 2017/5/2.
 */
angular.module("klwkOmsApp")
    .controller("newMaterialController", ["$scope","newMaterialService","$rootScope","toolsService","validateService",
        function($scope,newMaterialService,$rootScope,toolsService,validateService) {
            var pageId = "#newMaterial";  // 页面Id
            function init(){
                var params = $rootScope.materialParams;  // 接收参数
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
                // 实物调拨明细列表配置
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'productskucode'},
                    {name: "规格名称", tag: 'productskuname'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "录入数量", tag: 'inputqty'},
                    {name: "可调数量", tag: 'canallocationquantity'}
                ];
                if(params.type == 'edit'){
                    // 修改页面
                    $scope.formData = {
                        "type":"edit",
                        "Id":params.data.id,
                        "Code":params.data.code,
                        // 调入仓库
                        "InWarehouseId": params.data.inwarehouseid,
                        "InWarehouseName": params.data.inwarehousename,
                        // 调出仓库
                        "OutWarehouseId": params.data.outwarehouseid,
                        "OutWarehouseName": params.data.outwarehousename,
                        // 占用仓库
                        "VirtualWarehouseId":params.data.virtualwarehouseid,
                        "VirtualWarehouseName":params.data.virtualwarehousename,
                        // 调拨类型
                        "AllocationTypeCode":params.data.allocationtypecode,
                        "AllocationTypeName":params.data.allocationtypename,
                        // 备注
                        "Remark": params.data.remark

                    };
                    // 实物调拨明细明细
                    newMaterialService.transferDetail($scope);
                } else {
                    // 新增页面
                    $scope.formData = {
                        "type":"new"
                    };
                }
                // 初始化加载所有仓库
                newMaterialService.warehouseGetAll($scope);
                // 调出仓库下拉框 配置
                $scope.selectOutWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.OutWarehouseId = obj.id;
                        $scope.formData.OutWarehouseName = obj.name;
                        $scope.formData.ParentId = obj.parentid;
                        // 获取调入仓库
                        newMaterialService.getVirtualWarehouse($scope);
                    }
                };
                // 调入仓库下拉框 配置
                $scope.selectInWarehouse = {
                    isshow: false,
                    info: [],
                    validate:true,
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.InWarehouseId = obj.id;
                        $scope.formData.InWarehouseName = obj.name;
                    }
                };
                newMaterialService.getWarehouse($scope);
                // 占用仓库下拉框 配置
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
                    newMaterialService.getVirtualWarehouse($scope);
                }
                // 调拨类型下拉框 配置
                $scope.selectType = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) {	//点击之后的回调
                        $scope.formData.AllocationTypeName = obj.name;
                        $scope.formData.AllocationTypeCode = obj.code;
                    }
                };
                newMaterialService.transferType($scope);
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
                        newMaterialService.getProduct($scope,1,10);
                    } else {
                        toolsService.alertMsg({content : '调入仓库和调出仓库不能一样！',time : 1000});
                    }
                },
                // 搜索
                search: function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        newMaterialService.getProduct($scope,1,10,1);
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
                        newMaterialService.getInventoryNum($scope,skuIdArr.join(',').toLowerCase(),'create');
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
                    newMaterialService.getProductInventory($scope,obj);
                    $scope.acitveProductItem = $.extend({},obj);
                }
            };

            //返回
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/materialTransfer.html';
                $scope.option[index].name = '实物调拨';
            };

            // 保存
            $scope.save = function () {
                if(validateService.validateAll(pageId,'.add')) {
                    $scope.tableData = [];
                    // 新增商品计划数量为0的商品
                    $scope.quantityArr = [];
                    $.each($scope.tableInfoList, function (index,obj) {
                        if(obj.planqty == 0 || obj.planqty == undefined) {
                            $scope.quantityArr.push(obj);
                        }
                    });
                    if($scope.quantityArr.length == 0) {
                        $.each($scope.tableInfoList, function (index,obj) {
                            $scope.tableData.push({
                                "Id": obj.id,
                                "ProductId": obj.productid,
                                "ProductCode": obj.productcode,
                                "ProductName": obj.productname,
                                "ProductSkuId": obj.skuid,
                                "ProductSkuCode": obj.productskucode,
                                "ProductSkuName": obj.productskuname,
                                "PlanQty": obj.planqty,
                                "LockedQty": obj.lockedqty?obj.lockedqty:0,
                                "OutQty": obj.outqty?obj.outqty:0,
                                "InQty": obj.inqty?obj.inqty:0,
                                "InputQty": obj.inputqty,
                                "OutCanAllocationQty": obj.canallocationquantity,
                                "CanNoticeQty": obj.cannoticeqty?obj.cannoticeqty:0,
                                "Deleted": obj.deleted,
                                "IsNew": false,
                                "IsUpdate": true
                            });
                        });
                        newMaterialService.save($scope,$scope.formData);
                    } else {
                        $scope.showModal('errorModal');
                    }
                }
            };

            //显示模态框
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
                totalItems: 500,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    newMaterialService.getProduct($scope,$scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationConf.itemsPerPage;

        }]);