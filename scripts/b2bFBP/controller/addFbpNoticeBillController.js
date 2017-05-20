/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("addFbpNoticeBillController", ["$scope", "$rootScope", "addFbpNoticeBillService", "validateService", "fbpPublicService","toolsService", function ($scope, $rootScope, addFbpNoticeBillService, validateService, fbpPublicService,toolsService) {
        var indexId = "#addFbpNoticeBill";

        //进入页面需要执行的方法
        function init() {
            $('#addFbpNoticeBill').selectPlug();
            //活动商品变量
            $scope.activeContent = false;
            //初始化getPage函数
            fbpPublicService.DomOperate.calculateInde($scope)
            //初始化表单验证
            validateService.initValidate(indexId);
            //获取仓库名
            addFbpNoticeBillService.Interface.getWarehouseNameList($scope);
            //接受调入仓库数据
            $scope.inWarehouseDatas = $rootScope.params.inWarehouseDatas;
            //接受调出仓库数据
            $scope.outWarehouseDatas = $rootScope.params.outWarehouseDatas;
            //接受店铺名称数据
            $scope.storeDatas = $rootScope.params.storeDatas;
            //初始化formdata
            $scope.formData = {
                "Id": 0,
                "Deleted": "false",
                "IsNew": "false",
                "IsUpdate": "false",
                "PlanId": "",
                "PlanCode": "",
                "OutWarehouseId": "",
                "OutWarehouseName": "",
                "InWarehouseId": "",
                "InWarehouseName": "",
                "VirtualWarehouseId": "",
                "VirtualWarehouseName": "",
                "StoreId": "",
                "StoreName": "",
                "Remark":"",
                "ScheduleNo":"",
                "Details": []
            };
            //    "/B2B/B2BAllocationOut/Save"
            //    [{
            //    "Id": 0,
            //    "PlanId": 21,
            //    "PlanCode": "BAT1703294066900",
            //    "OutWarehouseId": "9c96078f-b480-429d-8583-c4f357c56811",
            //    "OutWarehouseName": "孩子王实体仓库",
            //    "InWarehouseId": "2e22949b-b2cf-4f5a-a662-678c4ad848ef",
            //    "InWarehouseName": "俪人购仓",
            //    "VirtualWarehouseId": "30fc7fb4-d25e-4f66-9a06-69a4f99aa08e",
            //    "VirtualWarehouseName": "广州孩子王专卖店",
            //    "StoreId": "525d3988-997a-46e7-bf3c-e24f49d52da3",
            //    "StoreName": "030388",
            //    "Details": [{
            //        "Id": 0,
            //        "ProductId": "34f3cf15-1bb8-48eb-9a5a-6570d382899e",
            //        "ProductCode": "VOP70970932530",
            //        "ProductName": "VOP70970932530",
            //        "ProductSkuId": "8856aa26-460d-42c7-a984-a20fcd4b9fcb",
            //        "ProductSkuCode": "VOP70970932530",
            //        "ProductSkuName": "VOP70970932530",
            //        "NoticeQty": 1,
            //        "OutQty": 0,
            //        "InQty": 0,
            //        "Price": 0.0,
            //        "Amount": 0.0,
            //        "ImportQty": 1,
            //        "CanOutQty": 0,
            //        "Deleted": false,
            //        "IsNew": false,
            //        "IsUpdate": false
            //    }],
            //    "Deleted": false,
            //    "IsNew": false,
            //    "IsUpdate": false
            //}]
        }

        init();
        addFbpNoticeBillService.DomOperate.dominit($scope);
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
                addFbpNoticeBillService.Interface.getProductList($scope);
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
                var str = '';
                $.each($scope.productListTbody, function (i, v) {
                    if (v.isdatacheck === true) {
                        var newData = {};
                        newData.Id = 0;
                        newData.ProductId = v.productid;
                        newData.ProductCode = v.productcode;
                        newData.ProductName = v.productname;
                        newData.ProductSkuCode = v.code;
                        newData.ProductSkuId = v.skuid.toLowerCase();
                        newData.ProductSkuName = v.description;
                        newData.Price = v.costprice;
                        newData.Deleted = "false";
                        newData.IsNew = "false";
                        newData.IsUpdate = "false";
                        //初始计划数量为0
                        newData.NoticeQty = 0;
                        //初始金额为
                        newData.Amount = v.costprice;
                        //拼接商品sku字符串
                        arr.push(newData)
                        //       "NoticeQty": 1,
                        //        "OutQty": 0,
                        //       "InQty": 0,
                        //      "Price": 0.0,
                        //       "Amount": 0.0,
                        //       "ImportQty": 1,
                        //       "CanOutQty": 0,
                    }
                });
                //if (arr.length) {
                //    $.each(arr, function (i, v) {
                //        //v.PlanQty = 1;
                //        //v.LockedQty = 0;
                //        //v.OutQty = 0;
                //        //v.InQty = 0;
                //        //v.Amount = 0;
                //        //v.InputQty = 1;
                //        //v.OutCanAllocationQty = 0;
                //        //v.CanNoticeQty = 0;
                //    });
                //引用类型 只用处理这一个arr就行
                //}

                //[{
                //    "Id": 0,
                //    "Deleted": "false",
                //    "IsNew": "false",
                //    "IsUpdate": "false",
                //    "PlanId": 21,
                //    "PlanCode": "",
                //    "OutWarehouseId": "45bd4410-9a12-4578-8585-42622bf5a601",
                //    "OutWarehouseName": "01店铺01的实体仓",
                //    "InWarehouseId": "e36ec49d-4f17-4aed-92ce-6c9fc31b1a17",
                //    "InWarehouseName": "京东闪购仓",
                //    "VirtualWarehouseId": "",
                //    "VirtualWarehouseName": "",
                //    "StoreId": "ebe67c82-5d67-456a-9420-57ed744c9f2e",
                //    "StoreName": "baobaobest旗舰店",
                //    "Details": [{
                //        "Id": 0,
                //        "ProductId": "6fdf5168-4588-4feb-9ca8-140c7f33c6f8",
                //        "ProductCode": "cocoli003",
                //        "ProductName": "cocoli003",
                //        "ProductSkuCode": "cocoli003002",
                //        "ProductSkuId": "97adcbf1-8a25-49a6-bef7-b3e4d2151d61",
                //        "ProductSkuName": "cocoli003002",
                //        "Price": 0,
                //        "Deleted": "false",
                //        "IsNew": "false",
                //        "IsUpdate": "false",
                //        "NoticeQty": 0,
                //        "Amount": 0,
                //        "$$hashKey": "object:5426",
                //        "CanOutQty": 0,
                //        "ImportQty": 1
                //    }, {
                //        "Id": 0,
                //        "ProductId": "0149771f-fe44-49e8-b8b0-1e0693f95586",
                //        "ProductCode": "cocoli002",
                //        "ProductName": "cocoli002",
                //        "ProductSkuCode": "cocoli002002",
                //        "ProductSkuId": "4e6e408a-b34f-4bde-bce6-a9015a211d80",
                //        "ProductSkuName": "cocoli002002",
                //        "Price": 0,
                //        "Deleted": "false",
                //        "IsNew": "false",
                //        "IsUpdate": "false",
                //        "NoticeQty": 0,
                //        "Amount": 0,
                //        "$$hashKey": "object:5427",
                //        "CanOutQty": 0,
                //        "ImportQty": 1
                //    }]
                //}]

                //初始化通知数量
                $scope.NoticeQty = 0;
                //初始化金额
                var allAmount = 0;
                $.each(arr, function (i, v) {
                    allAmount += +v.Amount;
                });
                $scope.Amount = allAmount;
                $scope.formData.Details = $scope.productSelectList = arr;
                //获取调用仓库的Id
                var newArr = [];
                $.each(arr, function (i, v) {
                    newArr.push(v.ProductSkuId);
                });
                $scope.productsSkuId = newArr.join(",");
                //调用获取库存的接口
                addFbpNoticeBillService.Interface.getProductQty($scope);
            },
            //删除商品
            deleteProduct: function (list, $event) {
                $event.stopPropagation();
                $scope.productSelectList.removeByValue(list);
                //更改小计里面的值
                var PlanQtyNums = 0;
                var allAmount = 0;
                $.each($scope.productSelectList, function (i, v) {
                    PlanQtyNums += v.PlanQty - 0;
                    allAmount += v.Amount - 0;
                });
                $scope.PlanQtyNums = PlanQtyNums;
                $scope.Amount = allAmount;
            },
            //加值
            addAmount: function (list, $event) {
                if ($event.target.cellIndex != 5) return;
                list.NoticeQty = +$event.target.innerHTML;
                list.Amount = +$event.target.innerHTML * list.Price;
                var NoticeQty = 0;
                var allAmount = 0;
                $.each($scope.productSelectList, function (i, v) {
                    NoticeQty += v.NoticeQty - 0;
                    allAmount += v.Amount - 0;
                });
                $scope.NoticeQty = NoticeQty;
                $scope.Amount = allAmount;
            },
            //保存商品
            save: function () {
                if (validateService.validateAll(indexId, ".basic-message")) {
                    //判断是否所有所需数量都不为0
                    var flag=true;
                    if($scope.formData.Details.length==0){
                        toolsService.alertError("请选择商品")
                        return;
                    }
                    $.each($scope.formData.Details,function(i,v){
                        if(!v.NoticeQty){
                            flag=false;
                            return
                        }
                    });
                    if(!flag){
                        toolsService.alertError("数量不能为0");
                        return
                    }
                    //保存数据
                    addFbpNoticeBillService.Interface.saveFbpPlanBill($scope);
                }
            },
            cancel: function () {
                validateService.clearValidateClass(indexId, ".basic-message")
            }
        };



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
            var index = $(indexId).closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/b2bFBP/fbpPlanBill.html';
            $scope.option[index].name = 'B2B计划单';
        };

        //活动商品
        $scope.addProduct = function (content) {
            $scope.isActiveShow(content);
            addFbpNoticeBillService.Interface.getProductList($scope);
        };
        //点击出现右边详情页
        $scope.getProductInfo = function (list) {
            addFbpNoticeBillService.Interface.getProductInfoList($scope, list)
        };
        $rootScope.activePage = "b2bBFP";
    }]);