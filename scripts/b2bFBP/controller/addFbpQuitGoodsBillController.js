/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp").controller("addFbpQuitGoodsBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "fbpPublicService", "validateService", "addFbpQuitGoodsBillService", "toolsService", function ($scope, $rootScope, $state, WAP_CONFIG, fbpPublicService, validateService, addFbpQuitGoodsBillService, toolsService) {
    var indexId = "#addFbpQuitGoodsBill";
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
        addFbpQuitGoodsBillService.Interface.getWarehouseNameList($scope);
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
            "PlatformCode": "",
            "TotalCases": 1,
            "TotalQtys": "",
            "InWarehouseId": "",
            "InWarehouseName": "",
            "WarehouseId": "",
            "WarehouseName": "",
            "Note": "",
            "ScheduleNo": "",
            "ReturnSignType": 0, //默认是新建
            "Deleted": false,
            "IsNew": false,
            "IsUpdate": false,
            "Details": [],
        };

        //初始化到下拉配置
        $scope.searchConfig = {
            //退供仓库
            inWarehouse: {
                isshow: false,
                info: $scope.inWarehouseDatas,
                validate: true,
                onChange: function (obj, index) {	//点击之后的回调
                    //调入仓库Id
                    $scope.formData.InWarehouseId = obj.id;
                    //调入仓库名称
                    $scope.formData.InWarehouseName = obj.name;
                },

            },
            //签收仓库
            outWarehouse: {
                isshow: false,
                info: $scope.outWarehouseDatas,
                validate: true,
                onChange: function (obj, index) {	//点击之后的回调
                    //调入仓库Id
                    $scope.formData.WarehouseId = obj.id;
                    //调入仓库名称
                    $scope.formData.WarehouseName = obj.name;
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

        //如果是修改页进入
        //    if($rootScope.params.list){
        //        $scope.formData.ScheduleNo=$rootScope.params.list.scheduleno;
        //        $scope.searchConfig.outWarehouse.objName={id: $rootScope.params.list.outwarehouseid};
        //        $scope.searchConfig.storename.objName={id: $rootScope.params.list.storeid};
        //    }
    }


    init();
    addFbpQuitGoodsBillService.DomOperate.dominit($scope);
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
            addFbpQuitGoodsBillService.Interface.getProductList($scope);
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
                    newData.Id = 0;
                    newData.ProductId = v.productid;
                    newData.ProductCode = v.productcode;
                    newData.ProductName = v.productname;
                    newData.SkuCode = v.code;
                    newData.SkuId = v.skuid.toLowerCase();
                    newData.ProductSkuName = v.description;
                    newData.Price = v.costprice;
                    newData.Deleted = "false";
                    newData.IsNew = "false";
                    newData.IsUpdate = "false";
                    //初始数量为1
                    newData.ReturnQty = 1;
                    //初始金额为
                    newData.Amount = v.costprice;
                    //拼接放到数组中
                    arr.push(newData);
                }
                //"Id": 0,
                //    "ProductId": "c3309300-878f-4d49-a151-b7e10d8ab58e",
                //    "ProductCode": "E5Q11W1540",
                //    "ProductName": "ES1540",
                //    "SkuId": "fffa4fcc-1811-4ad5-b664-f27300413738",
                //    "SkuCode": "E5Q11W1540-D03204",
                //    "SkuName": "深蓝色-D03 XL-204",
                //    "ReturnQty": 1,
                //    "InQty": 0,
                //    "Price": 0,
                //    "Amount": 0,
                //    "OutOfStockQty": 1,
                //    "Deleted": false,
                //    "IsNew": false,
                //    "IsUpdate": false

            });
            $scope.formData.Details = $scope.productSelectList = arr;
            //调用计算总值
            getFormDatas();

        },
        //删除商品
        deleteProduct: function (list, $event) {
            $event.stopPropagation();
            $scope.productSelectList.removeByValue(list);
            //更改小计里面的值
            getFormDatas();
        },
        //加值
        addAmount: function (list, $event, $index) {
            if ($index == 5) {
                list.ReturnQty = +$event.target.innerHTML;
            };
            if ($index == 6) {
                list.Price = +$event.target.innerHTML;
            }
            list.Amount = list.ReturnQty * list.Price;
            //调用计算
            getFormDatas();
        },
        //保存商品
        save: function () {
            if (validateService.validateAll(indexId, ".basic-message")) {
                //判断是否所有所需数量都不为0
                if ($scope.formData.Details.length == 0) {
                    toolsService.alertError("请选择商品")
                    return;
                }
                //保存数据
                addFbpQuitGoodsBillService.Interface.saveFbpPlanBill($scope);
            }
        },
        cancel: function () {
            validateService.clearValidateClass(indexId, ".basic-message")
        }
    };
    function getFormDatas() {
        var allQty = 0;
        var allAmount = 0;
        $.each($scope.productSelectList, function (i, v) {
            allQty += v.ReturnQty - 0;
            allAmount += v.Amount - 0;
        });
        $scope.formData.TotalQtys = allQty;
        $scope.formData.TotalAmount = allAmount;
    }

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
        addFbpQuitGoodsBillService.Interface.getProductList($scope);
    };
    //点击出现右边详情页
    $scope.getProductInfo = function (list) {
        addFbpQuitGoodsBillService.Interface.getProductInfoList($scope, list)
    };
    $rootScope.activePage = "b2bBFP";
}]);