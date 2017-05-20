/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inOrderAddController", ["$scope", "$rootScope", "inOrderAddService","ApiService","inOrderService","APP_MENU",
        function ($scope, $rootScope, inOrderAddService,ApiService,inOrderService,APP_MENU) {
            // 定义当前页面控件的ID
            var pageId = "#inOrderAdd";

            // 用户输入查询输出订单条件的对象
            var userOutOrderQueryObj = {};

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
                        //inOrderService.getStorageOrder($scope);
                        // 查询条件
                        $scope.queryCondition = {
                            "PageIndex": $scope.paginationConf.currentPage,
                            "PageSize": $scope.paginationConf.itemsPerPage
                        };
                        // 获取订单列表的数据，并且展示出来
                        inOrderAddService.getSkuList($scope);
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
                        //inOrderService.getStorageOrder($scope);
                        // 查询条件
                        $scope.queryCondition = {
                            "PageIndex": $scope.paginationOuterOrderConf.currentPage,
                            "PageSize": $scope.paginationOuterOrderConf.itemsPerPage
                        };
                        // 获取订单列表的数据，并且展示出来
                        //inOrderAddService.getSkuList($scope);
                        inOrderAddService.getOuterOrderList($scope);
                    }
                };
                //初始化第一页
                $scope.paginationOuterOrderConf.first = 1;
                //初始化最后一页
                $scope.paginationOuterOrderConf.last = $scope.paginationOuterOrderConf.itemsPerPage;
            }

            // 选择日期控件初始化
            function datePluginInit(){
                $(pageId + " .datePlugin").datetimepicker({
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

            //进入页面需要执行的方法
            function init() {
                // 选择来源单号的查询对象
                $scope.outOrderQueryObj = {};
                // 新增的SKU默认为空
                $scope.tableInfoList = [];

                $scope.formData = {
                    // 是否显示 添加商品列表  panel,默认是不显示
                    "isShowAddSkuPanel" : false
                };
                //分页
                pageSet();
                pageOutOrderSet();
                // 选择日期控件初始化
                datePluginInit();

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
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "计划数量", tag: 'PlanQty'}
                ];

                // 规格信息列表配置
                $scope.theadWarehouseList = [
                    {name: "仓库名称", tag: 'warehouseid'},
                    {name: "库存数", tag: 'quantity'},
                    {name: "可用数", tag: 'canUseQuantity'},
                    {name: "可销数", tag: 'canSaleQuantity'}
                ];

                // 出库订单
                $scope.theadOutOrderList = [
                    {name: "状态", tag: 'status'},
                    {name: "出库单号", tag: 'code'},
                    {name: "来源单号", tag: 'fromcode'},
                    {name: "出库仓库", tag: 'warehousename'},
                    {name: "出库类型", tag: 'typename'},
                    {name: "制单人", tag: 'createuser'},
                    {name: "制单时间", tag: 'createdate'},
                    {name: "审核人", tag: 'audituser'},
                    {name: "审核时间", tag: 'auditdate'},
                    {name: "备注", tag: 'note'}
                ];


                $scope.selectConfig = {
                    // 该对象用于存储用户的值
                    values : {},
                    // 判断是否缓存了所有的仓库信息
                    warehouseList : {
                        info:inOrderService.allWarehouseInfo,
                        onChange : function(obj,index){
                            inOrderAddService.getSubWarehouseListById($scope,obj.id);
                            $scope.selectConfig.values["warehouseList"] = obj;
                        }
                    },
                    // 该查询条件由 选择的实体仓库联动
                    "warehouseSubList" : {
                        info : [],
                        onChange:function(obj,index){
                            $scope.selectConfig.values["warehouseSubList"] = obj;
                        }
                    },
                    // 入库类型下拉选项
                    inWarehouseTypeList : {
                        info:inOrderService.generalClassiFication,
                        onChange:function(obj,index){
                            $scope.selectConfig.values["inWarehouseTypeList"] = obj;
                        }
                    }
                };

                // 先获取所有仓库的名称，然后才能显示SKU的规格编码 存货清单
                ApiService.listenAll(function(deffer){
                    inOrderAddService.getAllWarehouseInfo($scope,deffer);
                }).then(function(){
                    // 获取SKU 列表
                    inOrderAddService.getSkuList($scope);
                });

                // 输出订单查询条件初始化
                $scope.outOrderQueryObj = {
                    // 单据状态, 用于 单号数据的筛选
                    inventoryStatusList : {
                        info : klwTool.enumerateToArray(APP_MENU.inventoryOutboundOrder),
                        onChange:function(obj,id){
                            var inWarehouseTypeObj = {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": id,
                                "Children": []
                            };
                            userOutOrderQueryObj["inWarehouseTypeObj"] = inWarehouseTypeObj;
                        }
                    },
                    // 出库类型, 用于 单号数据的筛选
                    outWarehouseTypeList : {
                        info : [],
                        onChange:function(obj,id){
                            var outWarehouseTypeObj = {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TypeCode",
                                "Name": "TypeCode",
                                "Value": id,
                                "Children": []
                            };
                            userOutOrderQueryObj["outWarehouseTypeObj"] = outWarehouseTypeObj;
                        }
                    },
                    // 出库类型, 用于 单号数据的筛选
                    allWarehouseList : {
                        info : [],
                        onChange:function(obj,id){
                            var InWarehouseObj = {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "WarehouseId",
                                "Name": "InWarehouseId",
                                "Value": id,
                                "Children": []
                            };
                            userOutOrderQueryObj["InWarehouseObj"] = InWarehouseObj;
                        }
                    }
                }

            }
            init();

            // 显示时间控件
            $scope.showDatetimePick = function(myevent){
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

            // 根据SKU的规格编码 获取存货清单
            $scope.getInventoryVirtualBySkuid  = function(skuid){
                inOrderAddService.getInventoryVirtualBySkuid($scope,skuid);
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
                    var selectedItems = $(pageId + " .inOrderAdd_skuTableList .oms_checkbox.klwk-check-x");
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

            // 隐藏来源单号的模态框
            $scope.hideSearchOutOrderModalselectedOutOrder = function(myevent){
                $("#inOrderAdd_outOrderModal").modal('hide');
            };

            // 显示来源货单的模态框
            $scope.showSearchOutOrderModal = function(myevent){
                $("#inOrderAdd_outOrderModal").modal('show');
                inOrderAddService.getOuterOrderList($scope);
                // 出库类型
                inOrderAddService.getOutWarehouseTypeList($scope);
                // 显示所有的仓库
                inOrderAddService.getAllWarehouseList($scope);
            };

            // 选择的出库订单号
            var selectedOutOrder = "";
            // 选择一行 出库订单
            $scope.selectRowOutOrder = function(obj,myevent){
                var currentObj = $(myevent.target).closest("tr");
                // 改变选中的行的颜色
                currentObj.closest("tbody").find("tr").removeClass("table_tr_selected");
                currentObj.toggleClass("table_tr_selected");
                selectedOutOrder = obj.id;
            };


            // 显示出库订单中的SKU list
            $scope.showOutboundOrderSkulist = function(){
                if(selectedOutOrder == ""){
                    $scope.hideSearchOutOrderModalselectedOutOrder();
                }else{
                    inOrderAddService.getOutboundOrderDetailById($scope,selectedOutOrder);
                    selectedOutOrder = "";
                }
            };

            // 获取订单输出 所有的用户查询条件，并且转为 数组
            function getOutOrderUserQueryCondition(){
                var result = [];
                for(var key in userOutOrderQueryObj){
                    result.push(userOutOrderQueryObj[key]);
                }

                // 入库单号
                if($scope.outOrderQueryObj.code != "" && $scope.outOrderQueryObj.code !== undefined && $scope.outOrderQueryObj.code !== null ){
                    var tempCondition = {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "Code",
                        "Name": "Code",
                        "Value": $scope.outOrderQueryObj.code,
                        "Children": []
                    };
                    result.push(tempCondition);
                }


                // 来源单号
                if($scope.outOrderQueryObj.FromCode != "" && $scope.outOrderQueryObj.FromCode !== undefined && $scope.outOrderQueryObj.FromCode !== null ){
                    var tempCondition = {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "FromCode",
                            "Name": "FromCode",
                            "Value": $scope.outOrderQueryObj.FromCode,
                            "Children": []
                     };
                    result.push(tempCondition);
                }

                // 开始制单时间
                if($scope.outOrderQueryObj.BeginDate != "" && $scope.outOrderQueryObj.BeginDate !== undefined && $scope.outOrderQueryObj.BeginDate !== null ){
                    var tempCondition = {
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CreateDate",
                        "Name": "BeginDate",
                        "Value": $scope.outOrderQueryObj.BeginDate,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                // 结束制单时间
                if($scope.outOrderQueryObj.EndDate != "" && $scope.outOrderQueryObj.EndDate !== undefined && $scope.outOrderQueryObj.EndDate !== null ){
                    var tempCondition = {
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CreateDate",
                        "Name": "EndDate",
                        "Value": $scope.outOrderQueryObj.EndDate,
                        "Children": []
                    };
                    result.push(tempCondition);
                }

                return result;

            }

            // 根据用户输入的条件查询 输出订单
            $scope.searchOutOrder = function(){
                inOrderAddService.getOuterOrderList($scope,getOutOrderUserQueryCondition());
            };

            // 重置输出订单的查询条件
            $scope.resetSearchOutOrderQueryCondition = function(){
                $scope.outOrderQueryObj.inventoryStatusList.init();
                $scope.outOrderQueryObj.outWarehouseTypeList.init();
                $scope.outOrderQueryObj.allWarehouseList.init();
                $scope.outOrderQueryObj.code = "";
                $scope.outOrderQueryObj.productCode = "";
                $scope.outOrderQueryObj.BeginDate = "";
                $scope.outOrderQueryObj.EndDate = "";
                $scope.outOrderQueryObj.FromCode = "";
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

            // 保存添加的订单
            $scope.saveAddInOrder = function(){

                var commitObj = {
                    "Id": 0,
                    "CreateDate": "0001-01-01 00:00:00",
                    "TypeName": "调拨入库",
                    "Details": [],
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
                inOrderAddService.saveStorageOrder($scope,commitObj);

            };

        }]);