/**
 * Created by jx on 2017/3/18.
 */
angular.module("klwkOmsApp")
    .controller("addFbpPlanBillController", ["$scope", "$rootScope", "fbpPublicService", "addFbpPlanBillService", "validateService","toolsService", function ($scope, $rootScope, fbpPublicService, addFbpPlanBillService, validateService,toolsService) {
        var indexId = "#addFbpPlanBill";
        //进入页面需要执行的方法
        function init() {
            $('#addFbpPlanBill').selectPlug();
            //活动商品变量
            $scope.activeContent = false;
            //是否是被编辑状态
            $scope.isEdit = false;
            //全选默认为false
            $scope.isalldatacheck = false;
            //初始化getPage函数
            fbpPublicService.DomOperate.calculateInde($scope)
            //获取仓库名
            addFbpPlanBillService.Interface.getWarehouseNameList($scope)
            //初始化表单验证
            validateService.initValidate(indexId);
            //接受调入仓库数据
            $scope.inWarehouseDatas = $rootScope.params.inWarehouseDatas;
            //接受调出仓库数据
            $scope.outWarehouseDatas = $rootScope.params.outWarehouseDatas;
            //接受店铺名称数据
            $scope.storeDatas = $rootScope.params.storeDatas;

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
                "Remark": "",
                "ScheduleNo": "",
                "Details": []
            };
            //$scope.modify1 = {
            //    "tableList": {
            //        "id": 0,
            //        "creatdate": "0001-01-01 00:00:00",
            //        "status": 0,
            //        "scheduletype": 1,
            //        "schedulename": '',
            //        "warehouseid": '',
            //        "warehousename": '',
            //        "outvirtualwarehouseid": '',
            //        "outvirtualwarehousename": '',
            //        "schedulebegindate": '',
            //        "scheduleenddate": '',
            //        "goodsvalue": 0,
            //        "storeid": '',
            //        "storename": '',
            //        "isopenpickingorder": false,
            //        "isneedupload": false,
            //        "note": ''
            //    },
            //    "details": []
            //};
            //$scope.modify = $.extend(true, {}, $scope.modify1);
        }

        init();
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
                addFbpPlanBillService.Interface.getProductList($scope);
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
                        newData.PlanQty = 0;
                        //初始金额为0
                        newData.Amount = v.costprice;

                        //拼接商品sku字符串
                        arr.push(newData)
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

                //初始化计划商品数量
                $scope.PlanQtyNums = 0;
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
                $scope.productsSkuId = newArr.join(",")
                //调用获取库存的接口
                addFbpPlanBillService.Interface.getProductQty($scope);
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
                list.PlanQty = +$event.target.innerHTML;
                list.Amount = +$event.target.innerHTML * list.Price;
                var PlanQtyNums = 0;
                var allAmount = 0;
                $.each($scope.productSelectList, function (i, v) {
                    PlanQtyNums += v.PlanQty - 0;
                    allAmount += v.Amount - 0;
                });
                $scope.PlanQtyNums = PlanQtyNums;
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
                       if(!v.PlanQty){
                           flag=false;
                           return
                       }
                    });
                   if(!flag){
                       toolsService.alertError("数量不能为0");
                       return
                   }

                    //保持数据
                    addFbpPlanBillService.Interface.saveFbpPlanBill($scope);
                }
            },
            cancel: function () {
                validateService.clearValidateClass(indexId, ".basic-message");
            }
        };



        addFbpPlanBillService.DomOperate.dominit($scope);
        //方法
        $scope.basicInfoShow = function (str) {
            $scope[str] = !$scope[str]
        };
        //返回
        $scope.goBack = function () {
            var url = '../template/b2bFBP/fbpPlanBill.html';
            var title = 'B2B计划单';
            $scope.addTab(title,url);
        };

        //活动商品
        $scope.addProduct = function (content) {
            $scope.isActiveShow(content);
            addFbpPlanBillService.Interface.getProductList($scope);
        };
        //点击出现右边详情页
        $scope.getProductInfo = function (list) {
            addFbpPlanBillService.Interface.getProductInfoList($scope, list)
        };
        $rootScope.activePage = "b2bBFP";
    }]);
