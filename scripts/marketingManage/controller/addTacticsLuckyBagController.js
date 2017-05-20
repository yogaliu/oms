/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("addTacticsLuckyBagController", ["$scope", "$rootScope", "addTacticsLuckyBagService", "APP_MENU","validateService","toolsService",
        function ($scope, $rootScope, addTacticsLuckyBagService, APP_MENU,validateService,toolsService) {

            //已删除的原有商品
            var deletedMessageList = [];
            //当前页面id
            var indexID = '#addTacticsLuckyBag';

            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //初始化表单验证
                validateService.initValidate(indexID);

                //表单字段
                $scope.modify1 = {
                    "tableList": {
                        "name": '',
                        "begindate": '',
                        "id": '',
                        //记录日期
                        "createdate": '',
                        //策略类型　1: 买就送 2: 满就送 3: 福袋
                        "activitystrategytype": 3,
                        "enddate": '',
                        //是否叠加
                        "issuperposition": false,
                        "createuser": '',
                        //排序
                        "seq": -1,
                        "alertmobile": '',
                        //活动范围 0: 所有款, 1: 包含活动商品 2: 排除活动商品
                        "activityproductrange": '',
                        //赠送类型 0: 仅送赠品, 1: 仅指定快递, 2: 指定赠品+快递
                        "activitysendtype": '',
                        //策略类型 0: 买款送, 1:买款满金额送, 2: 满件送, 3: 满金额送, 4: 满件满金额送
                        "strategytype": '',
                        //赠送款数
                        "sendproductqty": 1,
                        //发货快递
                        "expressid": '',
                        //匹配时间类型 1: 付款时间, 2: 平台制单时间
                        "datetype": '',
                        'note':''
                    },
                    "condition": {
                        "buyqtybegin": '',
                        "buyqtyend": '',
                        "buyamtbegin": '',
                        "buyamtend": '',
                        //是否翻倍赠送
                        "isdoublesend": '',
                        //翻倍类型 1: 按赠送款数, 2：按赠品赠送数量
                        "doubletype": '',
                        //件数递增条件
                        "buymoreqtydouble": '',
                        //最多送多少倍
                        "maxsend": '',
                        //来源类型, 0:所有 1: PC, 2: 移动
                        "orderfrom": '',
                        //匹配地区　匹配订单省ID
                        "orderprovince": '',
                        //预售订单送
                        "ispresellsend": '',
                        //货到付款送
                        "iscodordersend": '',
                        //匹配尺码
                        "ismatchSize": '',
                        //是否预付款订单送
                        "isprepaysend": ''
                    },
                    "stores": [],
                    "sendProducts": []
                };
                $scope.modify = $.extend(true, {}, $scope.modify1);

                $scope.tableList1=[];

                //修改福袋页面
                if ($scope.params.type == 'modify') {
                    $scope.modify.tableList= $scope.params.tableList;
                    addTacticsLuckyBagService.ActivityStrategyConditionGet($scope);
                    //查询是否有赠送商品
                    addTacticsLuckyBagService.ActivityStrategySendProductGet($scope);
                }

                //下拉框组件
                selectFun();

                //店铺多选弹出框
                storeFun();

                message();

                //表单提交
                $scope.addBuySubmit = function () {


                    if($scope.tableList1 || $scope.tableList1.length>0){
                        $scope.modify.sendProducts = $scope.tableList1.concat(deletedMessageList);
                    }else{
                        $scope.modify.sendProducts =[];
                    }
                    $scope.modify.sendProducts = [
                        {
                            "Id": "41b0f5bd-4808-47d5-a44e-e4bc05ca9c1b",
                            "CreateDate": "2017-04-15 00:18:16",
                            "StrategyId": "85297475-d55b-47ec-ab77-0b3c821a6ec6",
                            "LuckyCode": "S116C17001423A6",
                            "ProductId": "0b8641d9-c25d-4057-a3a1-3d87f8d999ec",
                            "ProductCode": "S116C13185",
                            "ProductName": "S116C13185",
                            "SkuId": "82b99e62-7f98-4c27-9359-05f6d9ec52d7",
                            "SkuCode": "S116C13185105A5",
                            "SkuDescription": "酒红色 M",
                            "Quantity": 1,
                            "PlanSendQty": 1,
                            "AlreadySendQty": 0,
                            "Seq": 0,
                            "AlertQuantity": 0,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": true
                        }
                    ];

                    //判断$scope.modify.details中存的全是已删除的商品，如果是则isDeleted为true，则不能进行保存操作
                    var isDeleted = false;
                    $.each($scope.modify.sendProducts, function (i, obj) {
                        if (!obj.deleted) {
                            isDeleted = true;
                            return false;
                        }
                    });

                    //店铺必填
                    if ($scope.modify.stores.length == 0) {
                        toolsService.alertMsg("请选择活动店铺");
                        return false;
                    }

                    //活动时间必填
                    if(!$scope.modify.tableList.begindate || !$scope.modify.tableList.enddate){
                        toolsService.alertMsg("请选择活动时间");
                        return false;
                    }

                    //活动开始时间须小于结束时间
                    var begindate = $scope.modify.tableList.begindate.split('-');
                    var enddate = $scope.modify.tableList.enddate.split('-');
                    if (Number(begindate[0]) > Number(enddate[0])) {
                        toolsService.alertMsg("活动开始时间须小于结束时间!");
                        return false;
                    }
                    if (Number(begindate[0]) == Number(enddate[0]) && Number(begindate[1]) > Number(enddate[1])) {
                        toolsService.alertMsg("活动开始时间须小于结束时间!");
                        return false;
                    }
                    if (Number(begindate[0]) == Number(enddate[0]) && Number(begindate[1]) == Number(enddate[1]) && Number(begindate[2]) > Number(enddate[2])) {
                        toolsService.alertMsg("活动开始时间须小于结束时间!");
                        return false;
                    }

                    if($scope.modify.sendProducts.length == 0 || !isDeleted){
                        toolsService.alertMsg("请导入福袋商品");
                        return false;
                    }

                    if(validateService.validateAll(indexID,'.basic-message') && $scope.modify.sendProducts.length > 0 && isDeleted){
                        addTacticsLuckyBagService.ActivityStrategySave($scope);
                    }
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $(indexID).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/presentTactics.html';
                    $scope.option[index].name = '赠品策略';
                    $scope.addBuy = $.extend(true, {}, $scope.addBuy1);
                };


                //店铺名称
                addTacticsLuckyBagService.StoreGet($scope);


            }

            init();

            function message(){
                //福袋商品变量
                $scope.bagContent = false;
                $scope.bagBtn = true;

                //列表配置
                $scope.theadList1 = [
                    {name: "序号", tag: 'seq'},
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skudescription'},
                    {name: "赠送数量", tag: 'quantity'},
                    {name: "计划赠送数量", tag: 'plansendqty'},
                    {name: "预警数量", tag: 'alertquantity'},
                    {name: "已赠送数量", tag: 'alreadysendqty'}
                ];

                //福袋商品信息模块函数
                $scope.isBagShow = function (content) {
                    //取消
                    if (content == false) {
                        $scope.bagContent = false;
                        if ($scope.tableList == undefined) {
                            $scope.bagBtn = true;
                        }
                    } else {
                        $scope.bagContent = content;
                        $scope.bagBtn = false;
                    }
                };

                //删除
                $scope.deleteMessage = function (_index) {
                    //如果是原有商品，将deleted改为true，并追加到deletedMessageList
                    if ($scope.tableList1[_index].id != 0) {
                        $scope.tableList1[_index].deleted = true;
                        deletedMessageList.push($scope.tableList1[_index]);
                    }
                    $scope.tableList1.removeByValue($scope.tableList1[_index]);

                    if ($scope.tableList1 == undefined || $scope.tableList1.length == 0) {
                        $scope.bagBtn = true;
                    }
                };
            }

            //多选店铺弹出框
            function storeFun() {
                //店铺
                $scope.storeName = '请选择活动店铺';
                //已选店铺列表
                $scope.selectStoreList = [];

                //显示店铺多选弹框
                $scope.showShopModal = function () {
                    $(indexID + " #shopModal").modal('show');
                };
                /**
                 * 选择单个店铺
                 */
                $scope.selectOneStore = function (e, i) {
                    var obj = $(e.target);
                    if (obj.closest('.tr').find('.klwk-check-x').length > 0) {
                        $scope.selectStoreList.removeByValue($scope.storeList[i]);
                    } else {
                        $scope.selectStoreList.push($scope.storeList[i]);
                    }
                };

                /**
                 * 删除单个店铺
                 */
                $scope.deleteOneStore = function (i) {
                    $scope.selectStoreList.removeByValue($scope.selectStoreList[i]);
                };
                /**
                 * 是否存在于已选店铺列表中
                 */
                $scope.isInSelectStoreList = function (item) {
                    if ($scope.selectStoreList.contains(item) < 0) {
                        return false;
                    } else {
                        return true;
                    }
                };
                /**
                 * 选择店铺 确认
                 */
                $scope.showStores = function () {
                    if ($scope.selectStoreList.length > 0) {
                        $scope.storeName = "";
                        $.each($scope.selectStoreList, function (index, obj) {
                            $scope.storeName += obj.name + ';';
                        })
                    } else {
                        $scope.storeName = "请选择活动店铺";
                    }
                    $(indexID + " #shopModal").modal('hide');

                    //存店铺id
                    $.each($scope.selectStoreList, function (index, obj) {
                        $scope.modify.stores.push({
                            "StoreId": obj.id
                        });
                    });
                };
            }

            //下拉框组件
            function selectFun(){
                //下拉选框插件 匹配时间选择
                $scope.selectDateType = {
                    isshow: false,
                    validate:true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingMatchTime, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.datetype},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.datetype = obj.id;
                    }
                };
            }

            //配置时间控件
            $(indexID + ' .dateTime').datetimepicker({
                format: 'yyyy-mm-dd',
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
        }]);