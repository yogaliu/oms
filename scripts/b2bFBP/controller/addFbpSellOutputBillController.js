/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("addFbpSellOutputBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "fbpPublicService", "validateService", "addFbpSellOutputBillService","toolsService",
        function ($scope, $rootScope, $state, WAP_CONFIG, fbpPublicService, validateService, addFbpSellOutputBillService,toolsService ) {
            var indexId = "#addFbpSellOutputBill";

            //var pageMap = {};
            //$scope.goPage = function (name) {
            //    $state.go(pageMap[name]);
            //};
            //进入页面需要执行的方法
            function init() {
                //加载下拉框
                $('#addFbpSellOutputBill').selectPlug();
                //活动商品变量
                $scope.activeContent = false;
                //初始化getPage函数
                fbpPublicService.DomOperate.calculateInde($scope)
                //初始化表单验证
                validateService.initValidate(indexId);
                //获取仓库名
                addFbpSellOutputBillService.Interface.getWarehouseNameList($scope);
                //接受调入仓库数据
                $scope.inWarehouseDatas = $rootScope.params.inWarehouseDatas;
                //接受调出仓库数据
                $scope.outWarehouseDatas = $rootScope.params.outWarehouseDatas;
                //接受店铺名称数据
                $scope.storeDatas = $rootScope.params.storeDatas;

                //初始化formData
                $scope.formData = {
                    "Id": 0,
                    "StoreId": "",
                    "StoreName": "",
                    "PayDate": "",
                    "TotalQty": 0,
                    "TotalAmount": 0,
                    "OutWarehouseId": "",
                    "OutWarehouseName": "",
                    "Remark": "",
                    "ScheduleNo": "",
                    "OrderType": 0,//默认订单是新建
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false,
                    "Details": [],
                    //"Details": [{
                    //    "DetailId": 0,
                    //    "ProductId": "af7d992b-5f13-4442-b1ee-14c5a601b50f",
                    //    "ProductCode": "M3C213194",
                    //    "ProductName": "M3C213194",
                    //    "SkuId": "fffeb8f3-a109-4adf-81f9-6d1b2343c4f5",
                    //    "SkuCode": "M3C213194-E16106",
                    //    "SkuName": "褐红色-E16 15码-106",
                    //    "Qty": 1,
                    //    "SellingPrice": 0.0,
                    //    "Amount": 0.0,
                    //    "Deleted": false,
                    //    "IsNew": false,
                    //    "IsUpdate": false
                    //}],
                };

                //初始化到下拉配置
                $scope.searchConfig = {
                    //出货仓库
                    outWarehouse: {
                        isshow: false,
                        info: $scope.outWarehouseDatas,
                        validate: true,
                        onChange: function (obj, index) {	//点击之后的回调
                            //调入仓库Id
                            $scope.formData.OutWarehouseId = obj.id;
                            //调入仓库名称
                            $scope.formData.OutWarehouseName = obj.name;
                        },

                    },
                    storename: {
                        isshow: false,
                        info: $scope.storeDatas,
                        validate: true,
                        onChange: function (obj, index) {	//点击之后的回调
                            //商店id
                            $scope.formData.StoreId = obj.id;
                            //商店名称
                            $scope.formData.StoreName = obj.name;
                        },
                    }
                };
                //配置时间控件
                $(indexId + ' .dateTime').datetimepicker({
                    format: 'yyyy-mm-dd H:i:s',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn: 1,
                    language: 'zh-CN'
                });
                // 点击触发时间控件
                $scope.showDatetimePick = function (myevent) {
                    $(myevent.target).datetimepicker('show');
                };

                //如果是修改页进入
                if($rootScope.params.list){
                    $scope.formData.ScheduleNo=$rootScope.params.list.scheduleno;
                    $scope.searchConfig.outWarehouse.objName={id: $rootScope.params.list.outwarehouseid};
                    $scope.searchConfig.storename.objName={id: $rootScope.params.list.storeid};
                    $scope.formData.PayDate=$rootScope.params.list.createdate
                }

            }
            init();
            addFbpSellOutputBillService.DomOperate.dominit($scope);
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
                    //查询商品
                    addFbpSellOutputBillService.Interface.getProductList($scope);
                }
            };
            //活动商品信息模块函数
            $scope.isActiveShow = function (content) {
                $scope[content] = true;
            };
            $scope.isActiveHide = function (content) {
                $scope[content] = false;
            };
            $scope.domOperate = {
                selectItem: function (i, name, $event) {
                    $event.stopPropagation();
                    $scope[name][i].isdatacheck = !$scope[name][i].isdatacheck;
                    $scope.isalldatacheck = true;
                    $.each($scope[name], function (index, obj) {
                        if (!obj.isdatacheck) {
                            $scope.isalldatacheck = false;
                        }
                    });
                },
                //复选框改变所有数据的isdatacheck属性
                selectAll: function (name) {
                    if ($scope.isalldatacheck) {
                        $.each($scope[name], function (index, obj) {
                            obj.isdatacheck = false;
                            $scope.isalldatacheck = false;
                        })
                    } else {
                        $.each($scope[name], function (index, obj) {
                            obj.isdatacheck = true;
                            $scope.isalldatacheck = true;
                        })
                    }
                },
                //确定选择商品
                selectReady: function () {
                    //详情页消失
                    $scope.isActiveHide("addActive");
                    var arr = [];
                    $.each($scope.productListTbody, function (i, v) {
                        if (v.isdatacheck === true) {
                            var newData = {};
                            newData.DetailId = 0;
                            newData.ProductId = v.productid;
                            newData.ProductCode = v.productcode;
                            newData.ProductName = v.productname;
                            newData.ProductSkuCode = v.code;
                            newData.ProductSkuId = v.skuid.toLowerCase();
                            newData.ProductSkuName = v.description;
                            newData.SellingPrice = v.costprice;
                            newData.Deleted = "false";
                            newData.IsNew = "false";
                            newData.IsUpdate = "false";
                            //初始数量为1
                            newData.Qty = 1;
                            //初始金额为
                            newData.Amount = v.costprice;
                            //拼接放到数组中
                            arr.push(newData)
                        }
                    });
                    $scope.formData.Details = $scope.productSelectList = arr;
                    //调用计算总值
                    getFormDatas();

                    //var newArr = [];
                    //$.each(arr, function (i, v) {
                    //    newArr.push(v.ProductSkuId);
                    //});
                    //$scope.productsSkuId = newArr.join(",");
                    //调用获取库存的接口
                    //addFbpSellOutputBillService.Interface.getProductQty($scope);
                },
                //删除商品
                deleteProduct: function (list, $event) {
                    $event.stopPropagation();
                    $scope.productSelectList.removeByValue(list);
                    //更改小计里面的值
                    getFormDatas();
                },
                //加值
                addAmount: function (list, $event,$index) {
                    if($index==4){
                        list.Qty = +$event.target.innerHTML;

                    };
                    if($index==5){
                        list.SellingPrice = +$event.target.innerHTML;
                    }
                    list.Amount = list.Qty * list.SellingPrice;
                    //调用计算
                    getFormDatas();
                },
                //保存商品
                save: function () {
                    if (validateService.validateAll(indexId, ".basic-message")) {
                        //判断是否所有所需数量都不为0
                        if($scope.formData.Details.length==0){
                            toolsService.alertError("请选择商品")
                            return;
                        }
                        //保存数据
                        addFbpSellOutputBillService.Interface.saveFbpPlanBill($scope);
                    }
                },
                cancel: function () {
                    validateService.clearValidateClass(indexId, ".basic-message")
                }

            };
            function getFormDatas(){
                var allQty = 0;
                var allAmount = 0;
                $.each($scope.productSelectList, function (i, v) {
                    allQty += v.Qty - 0;
                    allAmount += v.Amount - 0;
                });
                $scope.formData.TotalQty = allQty;
                $scope.formData.TotalAmount = allAmount;
            }


            ////活动商品信息模块函数
            //$scope.isActiveShow = function (content) {
            //    if (content == false) {
            //        $scope.activeContent = false;
            //    } else {
            //        $scope.activeContent = content;
            //    }
            //};
            //方法
            $scope.basicInfoShow = function (str) {
                $scope[str] = !$scope[str]
            };
            //返回
            $scope.goBack = function () {
                var url = '../template/b2bFBP/fbpSellOutputBill.html';
                var title = '销售出货单';
                $scope.addTab(title,url);
            };
            //活动商品
            $scope.addProduct = function (content) {
                $scope.isActiveShow(content);
                addFbpSellOutputBillService.Interface.getProductList($scope);
            };
            //点击出现右边详情页
            $scope.getProductInfo = function (list) {
                addFbpSellOutputBillService.Interface.getProductInfoList($scope, list)
            };
            $rootScope.activePage = "b2bBFP";

        }]);