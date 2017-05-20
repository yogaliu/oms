/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("outOrderAddController", ["$scope", "$rootScope", "outOrderAddService","ApiService","outOrderService",
        function ($scope, $rootScope, outOrderAddService,ApiService,outOrderService) {
            // 定义当前页面控件的ID
            var pageId = "#outOrderAdd";
            /**
             * 分页插件
             */
            function pageSet() {
                //计算每页的数据索引
                $scope.paginationConf = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex:function (currentPage, itemsPerPage) {
                        //超出页码范围 return
                        if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1)) return;
                        $scope.first = itemsPerPage * (currentPage - 1) + 1;
                        if ($scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                            $scope.paginationConf.last = $scope.paginationConf.totalItems;
                        } else {
                            $scope.paginationConf.last = currentPage * itemsPerPage;
                        }
                    },
                    onChange: function () {	//操作之后的回调
                        //outOrderService.getStorageOrder($scope);
                        // 查询条件
                        $scope.queryCondition = {
                            "PageIndex": $scope.paginationConf.currentPage,
                            "PageSize": $scope.paginationConf.itemsPerPage
                        };
                        // 获取订单列表的数据，并且展示出来
                        outOrderAddService.getSkuList($scope);
                    }
                };
                //初始化第一页
                $scope.paginationConf.first = 1;
                //初始化最后一页
                $scope.paginationConf.last = $scope.paginationConf.itemsPerPage;
            }

            function pageOutOrderSet() {
                //计算每页的数据索引
                $scope.paginationOuterOrderConf = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex:function (currentPage, itemsPerPage) {
                        //超出页码范围 return
                        if (currentPage === 0 || currentPage == Math.ceil($scope.paginationOuterOrderConf.totalItems / itemsPerPage + 1)) return;
                        $scope.paginationOuterOrderConf.first = itemsPerPage * (currentPage - 1) + 1;
                        if ($scope.paginationOuterOrderConf.totalItems / itemsPerPage === itemsPerPage) {
                            $scope.paginationOuterOrderConf.last = $scope.paginationOuterOrderConf.totalItems;
                        } else {
                            $scope.paginationOuterOrderConf.last = currentPage * itemsPerPage;
                        }
                    },
                    onChange: function () {	//操作之后的回调
                        //outOrderService.getStorageOrder($scope);
                        // 查询条件
                        $scope.queryCondition = {
                            "PageIndex": $scope.paginationOuterOrderConf.currentPage,
                            "PageSize": $scope.paginationOuterOrderConf.itemsPerPage
                        };
                        // 获取订单列表的数据，并且展示出来
                        outOrderAddService.getStorageOrderList($scope);
                    }
                };
                //初始化第一页
                $scope.paginationOuterOrderConf.first = 1;
                //初始化最后一页
                $scope.paginationOuterOrderConf.last = $scope.paginationOuterOrderConf.itemsPerPage;
            }

            //进入页面需要执行的方法
            function init() {
                $scope.formData = {};
                // 新增的SKU默认为空
                $scope.tableInfoList = [];
                //分页
                pageSet();
                pageOutOrderSet();

                // 分页配置信息
                $scope.queryCondition = {
                   "PageIndex" : 1,
                   "PageSize" : 10
                };

                // 出库订单的分页
                $scope.queryOuterOrderCondition = {
                    "PageIndex" : 1,
                    "PageSize" : 6
                };

                // 表格的标题，这个tag是与后台返回的key 对应的
                $scope.theadInfoList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "计划数量", tag: 'PlanQty'}
                ];

                // 表格的标题，这个tag是与后台返回的key 对应的
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];

                // 规格信息列表配置
                $scope.theadWarehouseList = [
                    {name: "仓库名称", tag: 'warehouseid'},
                    {name: "库存数", tag: 'quantity'},
                    {name: "可用数", tag: 'canUseQuantity'},
                    {name: "可销数", tag: 'canSaleQuantity'}
                ];

                // 入库订单 tableOutOrderList
                $scope.theadOutOrderList = [
                    {name: "状态", tag: 'status'},
                    {name: "入库单号", tag: 'code'},
                    {name: "来源单号", tag: 'fromcode'},
                    {name: "收货仓库", tag: 'warehousename'},
                    {name: "入库仓库", tag: 'typename'},
                    {name: "出库类型", tag: 'typename'},
                    {name: "制单人", tag: 'createuser'},
                    {name: "制单时间", tag: 'createdate'},
                    {name: "审核人", tag: 'audituser'},
                    {name: "审核时间", tag: 'auditdate'},
                    {name: "备注", tag: 'note'}
                ];

                $scope.selectConfig = {
                    // 该查询条件由 选择的实体仓库联动
                    "warehouseSubList" : {
                        info : [],
                        onChange:function(obj,index){

                        }
                    }
                };


                $scope.selectConfig = {
                    // 该对象用于存储用户的值
                    values : {},

                    // 判断是否缓存了所有的仓库信息
                    warehouseList : {
                        info:outOrderService.allWarehouseInfo,
                        onChange : function(obj,index){
                            outOrderAddService.getSubWarehouseListById($scope,obj.id);
                            $scope.selectConfig.values["warehouseList"] = obj;
                        }
                    },

                    // 该查询条件由 选择的实体仓库联动
                    "warehouseSubList" : {
                        info : [],
                        onChange:function(obj,index){
                            $scope.selectConfig.values["warehouseSubList"] = obj;
                            $scope.selectConfig.values["warehouseSubList"] = obj;
                        }
                    },

                    // 入库类型下拉选项
                    inWarehouseTypeList : {
                        info:outOrderService.generalClassiFication,
                        onChange:function(obj,index){
                            $scope.selectConfig.values["inWarehouseTypeList"] = obj;
                        }
                    }
                };

                // 先获取所有仓库的名称，然后才能显示SKU的规格编码 存货清单
                ApiService.listenAll(function(deffer){
                    outOrderAddService.getAllWarehouseInfo($scope,deffer);
                }).then(function(){
                    // 获取SKU 列表
                    outOrderAddService.getSkuList($scope);
                });
            }
            init();

            // 根据SKU的规格编码 获取存货清单
            $scope.getInventoryVirtualBySkuid  = function(skuid){
                outOrderAddService.getInventoryVirtualBySkuid($scope,skuid);
            };

            // SKU 数据循环结束之后执行的方法
            $scope.tableRepeatFinished = function(){
                $(pageId).find(".skuTableTbody tr").first().click();
            };

            var userSelectedSku = [];

            // 选择SKU的列表项
            $scope.toggleSelectItem = function (myevent, index) {
                $(myevent.target).closest(".klwk-check").toggleClass("klwk-check-x");
                // 阻止事件冒泡
                myevent.stopPropagation();
            };


            /**
             * 新增商品模块
             * @ 返回数组 ($scope.tableInfoList)
             */
            $scope.addProduct = {

                // 显示添加 商品列表的  panel
                toggleShowAddSkuPanel : function(isShow){
                    if(isShow == true){
                        $scope.formData.isShowAddSkuPanel = true;
                    }else if(isShow == false){
                        $scope.formData.isShowAddSkuPanel = false;
                    }else{
                        $scope.formData.isShowAddSkuPanel = !$scope.formData.isShowAddSkuPanel;
                    }
                },

                //保存
                save:function () {
                    var selectedItems = $(pageId + " .outOrderAdd_skuTableList .oms_checkbox.klwk-check-x");
                    selectedItems.each(function(){
                        //console.log()
                        var index = $(this).attr("index");
                        $scope.tableSkuList[index]["PlanQty"] = 1;
                        userSelectedSku.push($scope.tableSkuList[index]);
                    });
                    // 新增选中的SKU内容
                    $scope.tableInfoList = $scope.tableInfoList.concat(userSelectedSku);
                    // 清空选中的内容
                    selectedItems.removeClass("klwk-check-x").addClass("klwk-check");

                    // 隐藏 添加产品列表  panel
                    this.toggleShowAddSkuPanel(false);
                },

                // 删除
                delete:function () {
                    var selectedIndex = [];
                    $(pageId + " .inOrderAdd_tableInfoListWidget .oms_checkbox.klwk-check-x").each(function(){
                        selectedIndex.push($(this).attr("index"));
                    });
                    var result = $scope.tableInfoList.divideArrayByIndexs(selectedIndex);
                    console.dir(result);
                    $scope.tableInfoList = result["unselected"];
                },

                // 取消
                cancel:function () {
                    $scope.activeItemList = [];
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                }

            };

             //隐藏来源单号的模态框
            $scope.hideSearchOutOrderModalselectedOutOrder = function(myevent){
                $("#inOrderAdd_outOrderModal").modal('hide');
            };

            // 隐藏来源单号的模态框
            $scope.showSearchInOrderModal = function(myevent){
                $("#outOrderAdd_inOrderModal").modal('show');
                // 获取入库订单列表
                outOrderAddService.getStorageOrderList($scope);
            };

            // 选择的出库订单号
            var selectedOutOrder = "";
            // 选择一行 出库订单
            $scope.selectRowOutOrder = function(obj,myevent){
                var currentObj = $(myevent.target).closest("tr");
                currentObj.closest("tbody").find("tr").removeClass("table_tr_selected");
                currentObj.toggleClass("table_tr_selected");
                //console.dir(obj);
                selectedOutOrder = obj.id;
            };

            //$scope.getOutboundOrderDetailById = function(){
            //    if(selectedOutOrder == ""){
            //        $scope.hideSearchOutOrderModalselectedOutOrder();
            //    }else{
            //
            //    }
            //}

            // 显示出库订单中的SKU list
            $scope.showOutboundOrderSkulist = function(){
                if(selectedOutOrder == ""){
                    $scope.hideSearchOutOrderModalselectedOutOrder();
                }else{
                    outOrderAddService.getStorageOrderDetailById($scope,selectedOutOrder);
                    selectedOutOrder = "";
                }
            };

            // 修改SKU 产品的数量
            $scope.userChangeCount = function(myevent){
                // 只允许用户输入数字
                var value = myevent.target.innerText;
                value = value.replace(/\D/g,'');
                myevent.target.innerText = value;

                // 列表数据的索引
                var arrayIndex = $(myevent.target).closest("tr").attr("index");
                $scope.tableInfoList[parseInt(arrayIndex)]["PlanQty"] = parseInt(myevent.target.innerText);
            };

            // 保存出库的订单
            $scope.saveAddInOrder = function(){

                var commitObj = {
                    "Id": 0,
                    "OutboundOrderId": 0,
                    "CreateDate": "0001-01-01 00:00:00",
                    "LockedQty": 0,
                    "OutQty": 0,
                    "InputQty": 0,
                    "OutCanAllocationQty": 0,
                    "CanNoticeQty": 0,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": true
                };

                if($scope.selectConfig.values["warehouseList"] === undefined){
                    alert("请选择收获仓库");
                    return false;
                }else{
                    commitObj["WarehouseId"] = $scope.selectConfig.values["warehouseList"]["id"];
                    commitObj["WarehouseName"] = $scope.selectConfig.values["warehouseList"]["name"];
                }

                if($scope.selectConfig.values["warehouseSubList"] === undefined){
                    alert("请选择入库仓库");
                    return false;
                }else{
                    commitObj["VirtualWarehouseId"] = $scope.selectConfig.values["warehouseSubList"]["id"];
                    commitObj["VirtualWarehouseName"] = $scope.selectConfig.values["warehouseSubList"]["name"];
                }

                if($scope.selectConfig.values["inWarehouseTypeList"] === undefined){
                    alert("请选择入库类型");
                    return false;
                }else{
                    commitObj["TypeCode"] = $scope.selectConfig.values["inWarehouseTypeList"]["code"];
                    commitObj["TypeName"] = $scope.selectConfig.values["inWarehouseTypeList"]["name"];
                }

                var selectedItems = $scope.tableInfoList;
                var length = selectedItems.length;
                if(length < 0){
                    alert("请先选择数据");
                    return false;
                }
                var skuObjs = [];
                for(var i = 0; i < length; i++){
                    var tempObj = {
                        "Id": 0,
                        "StorageOrderId": 0,
                        "CreateDate": "0001-01-01 00:00:00",
                        "InQty": 0,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": true
                    };
                    var currentObj = selectedItems[i];
                    tempObj["ProductId"] = currentObj["productid"];
                    tempObj["ProductCode"] = currentObj["productcode"];
                    tempObj["ProductName"] = currentObj["productname"];
                    tempObj["SkuId"] = currentObj["skuid"];
                    tempObj["SkuCode"] = currentObj["code"];
                    tempObj["SkuName"] = currentObj["description"];

                    tempObj["PlanQty"] = currentObj["PlanQty"];
                    skuObjs.push(tempObj);
                }

                commitObj.Details = skuObjs;
                console.dir(commitObj);
                outOrderAddService.saveOutboundOrder($scope,commitObj);

            };

        }]);