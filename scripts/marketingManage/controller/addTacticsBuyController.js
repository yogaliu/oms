/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("addTacticsBuyController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "addTacticsBuyService", "APP_MENU", "validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, addTacticsBuyService, APP_MENU, validateService) {

            //当前页面id
            var indexID = '#addTacticsBuy';
            //已删除的原有活动商品
            var deletedMessageList = [];
            //已删除的原有赠品商品
            var deletedMessageList2 = [];

            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //初始化表单验证
                validateService.initValidate(indexID);

                //表单字段
                $scope.modify1 = {
                    tableList: {
                        "begindate": '',
                        "id": '00000000-0000-0000-0000-000000000000',
                        //记录日期
                        "createdate": '0001-01-01 00:00:00',
                        "name": '',
                        //策略类型　1: 买就送 2: 满就送 3: 福袋
                        "activitystrategytype": '',
                        "enddate": '',
                        //是否叠加
                        "issuperposition": true,

                        "createuser": '',

                        //排序
                        "seq": 0,
                        "alertmobile": '',
                        //活动范围
                        "activityproductrange": '',
                        //赠送类型
                        "activitysendtype": '',
                        //策略类型
                        "strategytype": '',
                        //赠送款数
                        "sendproductqty": 1,
                        //发货快递
                        "expressid": '',
                        //匹配时间类型 1: 付款时间, 2: 平台制单时间
                        "datetype": ''
                    },
                    condition: {
                        "buyqtybegin": '',
                        "buyqtyend": '',
                        "buyamtbegin": '',
                        "buyamtend": '',
                        //是否翻倍赠送
                        "isdoublesend": false,
                        //翻倍类型 1: 按赠送款数, 2：按赠品赠送数量
                        "doubletype": '',
                        //件数递增条件
                        "buymoreqtydouble": '',
                        "buymoreamtdouble": '',
                        //最多送多少倍
                        "maxsend": '',
                        //来源类型, 0:所有 1: PC, 2: 移动
                        "orderfrom": 0,
                        //匹配地区　匹配订单省ID
                        "orderprovince": '',
                        //预售订单送
                        "ispresellsend": '',
                        //货到付款送
                        "iscodordersend": '',
                        //匹配尺码
                        "ismatchsize": '',
                        //是否预付款订单送
                        "isprepaysend": ''
                    },
                    stores: [],
                    products: [],
                    sendProducts: []
                };
                $scope.modify = $.extend(true, {}, $scope.modify1);

                $scope.tableList1 = [];
                $scope.tableList2 = [];


                //判断是哪种类型
                //买就送
                if ($scope.params.type == 'addBuy') {
                    $scope.modify.tableList.activitystrategytype = 1;
                }
                //满就送
                else if ($scope.params.type == 'addFull') {
                    $scope.modify.tableList.activitystrategytype = 2;
                }
                //修改
                else if ($scope.params.type = 'modify') {
                    $scope.modify.tableList = $.extend(true, {}, $scope.params.tableList);

                    addTacticsBuyService.ActivityStrategyConditionGet($scope);
                    //查询是否有赠送商品
                    addTacticsBuyService.ActivityStrategySendProductGet($scope);
                    //查询是否有活动商品
                    addTacticsBuyService.ActivityStrategyProductGet($scope);
                }

                //店铺名称
                addTacticsBuyService.StoreGet($scope);
                //所有店铺
                addTacticsBuyService.getWarehouse($scope);
                //快递名称
                addTacticsBuyService.ExpressQuery($scope);
                //区域
                addTacticsBuyService.RegionQuery($scope);

                //分页
                pageFun1();
                pageFun2();
                pageFun3();

                //新增商品模块
                message();

                //下拉框组件
                selectInit();

                //店铺多选组件
                storeFun();

                //匹配地区多选组件
                addressFun();

                $scope.leadObj = {
                    //下载模板
                    downFile: function (fileName) {
                        var elemIF = document.createElement("iframe");
                        elemIF.src = "http://klwk-online.oss-cn-beijing.aliyuncs.com/update/oms2.0/importTemplate/" + fileName + ".xlsx";
                        elemIF.style.display = "none";
                        document.body.appendChild(elemIF);
                    },
                    //导入模板
                    leadXlsx: function (myEvent) {
                        //allTypeUpload('.imageInformation', '.addImage');
                        $(myEvent.target).closest('.leadTemplate').find('.fileElem').click();
                    },

                    //导入确定
                    leadConfirm: function () {

                    }

                };
                $('#file1').on('change', function (e) {
                    //var file=$(e.target).closest('.leadTemplate').find('.fileElem');
                    //var input=$(e.target).closest('.leadObj');
                    //var name = file.currentTarget.files[0].name;
                    var name = e.currentTarget.files[0].name;

                    $(this).siblings('.leadObj').val(name);
                    //$.ajaxFileUpload
                    //(
                    //    {
                    //        url: '/upload.aspx', //用于文件上传的服务器端请求地址
                    //        secureuri: false, //是否需要安全协议，一般设置为false
                    //        fileElementId: 'file1', //文件上传域的ID
                    //        dataType: 'json', //返回值类型 一般设置为json
                    //        success: function (data, status)  //服务器成功响应处理函数
                    //        {
                    //
                    //        },
                    //        error: function (data, status, e)//服务器响应失败处理函数
                    //        {
                    //            alert(e);
                    //        }
                    //    }
                    //);
                    //return false;
                });

                //三种类型的复选框
                $scope.isThreeSel = function (myEvent, type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        switch (type) {
                            case '1':
                                $scope.modify.condition.ispresellsend = selType;
                                break;
                            case '2':
                                $scope.modify.condition.iscodordersend = selType;
                                break;
                            case '3':
                                $scope.modify.condition.ismatchsize = selType;
                                break;
                            case '4':
                                $scope.modify.condition.isprepaysend = selType;
                                break;
                        }
                    });
                };

                //表单内容显示隐藏
                $scope.buyForm = {
                    //同时参与其他活动
                    sort: false,
                    //翻倍赠送
                    doubleSend: false,
                    buyFormFun: function (content) {
                        switch (content) {
                            case 'sort':
                                $scope.modify.tableList.issuperposition = !$scope.modify.tableList.issuperposition;
                                $scope.modify.tableList.seq = 1;
                                break;
                            case 'doubleSend':
                                $scope.modify.condition.isdoublesend = !$scope.modify.condition.isdoublesend;
                                break;
                        }
                    }
                };

                //表单提交
                $scope.addBuySubmit = function () {

                    //存活动商品
                    if ($scope.tableList1) {
                        $scope.modify.products = $scope.tableList1.concat(deletedMessageList);
                    } else {
                        $scope.modify.products = [];
                    }

                    //存赠送商品
                    if ($scope.tableList2) {
                        $scope.modify.sendProducts = $scope.tableList2.concat(deletedMessageList2);
                    } else {
                        $scope.modify.sendProducts = [];
                    }

                    //判断$scope.products中存的全是已删除的商品，如果是则isDeleted为true，则不能进行保存操作
                    var isDeleted1 = false;
                    $.each($scope.modify.products, function (i, obj) {
                        if (!obj.deleted) {
                            isDeleted1 = true;
                            return false;
                        }
                    });

                    //判断$scope.sendProducts中存的全是已删除的商品，如果是则isDeleted为true，则不能进行保存操作
                    var isDeleted2 = false;
                    $.each($scope.modify.sendProducts, function (i, obj) {
                        if (!obj.deleted) {
                            isDeleted2 = true;
                            return false;
                        }
                    });

                    //店铺必填
                    if ($scope.modify.stores.length == 0) {
                        toolsService.alertMsg("请选择活动店铺");
                        return false;
                    }

                    //如果策略类型为   前两项不必填
                    if ($scope.modify.tableList.strategytype == '4') {
                        $(indexID + " .buyqtybegin").removeClass('validate').attr('name', '');
                        $(indexID + " .buyqtyend").removeClass('validate').attr('name', '');
                    }

                    //如果策略类型为  后两项不必填
                    if ($scope.modify.tableList.strategytype == '1' || $scope.modify.tableList.strategytype == '3') {
                        $(indexID + " .buyamtbegin").removeClass('validate').attr('name', '');
                        $(indexID + " .buyamtend").removeClass('validate').attr('name', '');
                    }


                    //如果赠送类型为仅指定快递，快递为必填
                    if ($scope.modify.tableList.activitysendtype == 1) {
                        $scope.selectExpress.validate = false;
                    }

                    //赠送商品必填
                    if ($scope.modify.tableList.activitysendtype != 2) {

                        if ($scope.modify.sendProducts.length == 0 || !isDeleted2) {
                            toolsService.alertMsg("请选择赠送商品");
                            return false;
                        }
                    }

                    //活动时间必填
                    if (!$scope.modify.tableList.begindate || !$scope.modify.tableList.enddate) {
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


                    //活动商品必填
                    if ($scope.modify.products.length == 0 || !isDeleted1) {
                        toolsService.alertMsg("请选择活动商品");
                        return false;
                    }


                    //起始数量须小于结束数量
                    if ($scope.modify.condition.buyqtybegin && $scope.modify.condition.buyqtyend && $scope.modify.condition.buyqtybegin - $scope.modify.condition.buyqtyend >= 0) {
                        toolsService.alertMsg("起始数量须小于结束数量!");
                        return false;
                    }

                    //起始金额须小于结束金额
                    if ($scope.modify.condition.buyamtbegin && $scope.modify.condition.buyamtend && ($scope.modify.condition.buyamtbegin - $scope.modify.condition.buyamtend >= 0)) {
                        toolsService.alertMsg("起始金额须小于结束金额!");
                        return false;
                    }


                    //如果不是翻倍赠送
                    if (!$scope.modify.condition.isdoublesend) {
                        $scope.selectDoubleType.validate = false;
                        if ($scope.modify.tableList.strategytype == '4') {
                            $(indexID + " .buymoreqtydouble").removeClass('validate').attr('name', '');
                            $(indexID + " .maxsend").removeClass('validate').attr('name', '');
                        }

                        if ($scope.modify.tableList.strategytype == '1' || $scope.modify.tableList.strategytype == '3') {
                            $(indexID + " .buymoreamtdouble").removeClass('validate').attr('name', '');
                            $(indexID + " .maxsend").removeClass('validate').attr('name', '');
                        }
                    }

                    if (validateService.validateAll(indexID, '.basic-message')) {
                        addTacticsBuyService.ActivityStrategySave($scope);
                    }
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $('#addTacticsBuy').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/presentTactics.html';
                    $scope.option[index].name = '赠品策略';
                    $scope.modify = $.extend(true, {}, $scope.modify1);
                };

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };
            }

            init();

            //分页插件1
            function pageFun1() {

                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf1.totalItems / itemsPerPage + 1)) return;

                    $scope.first1 = itemsPerPage * (currentPage - 1) + 1;
                    if (Math.ceil($scope.paginationConf1.totalItems / itemsPerPage) === currentPage) {
                        $scope.last1 = $scope.paginationConf1.totalItems;
                    } else {
                        $scope.last1 = currentPage * itemsPerPage;
                    }
                };
                //分页配置
                $scope.paginationConf1 = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function () {	//操作之后的回调
                        //查询活动商品
                        addTacticsBuyService.ProductSkuQuery($scope, $scope.paginationConf1.currentPage, $scope.paginationConf1.itemsPerPage, false, 'activity');
                    }
                };


                $scope.first1 = 1;
                $scope.last1 = $scope.paginationConf1.itemsPerPage;

                //外部上一页
                $scope.prev = function () {
                    $scope.paginationConf1.currentPage--;
                    $scope.paginationConf1.type = 0;
                    $scope.paginationConf1.extClick = true;
                    $scope.getPageIndex($scope.paginationConf1.currentPage, $scope.paginationConf1.itemsPerPage);
                };

                //外部下一页
                $scope.next = function () {
                    $scope.paginationConf1.currentPage++;
                    $scope.paginationConf1.type = 1;
                    $scope.paginationConf1.extClick = true;
                    $scope.getPageIndex($scope.paginationConf1.currentPage, $scope.paginationConf1.itemsPerPage);

                };
            }

            //分页插件2
            function pageFun2() {

                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf2.totalItems / itemsPerPage + 1)) return;

                    $scope.first = itemsPerPage * (currentPage - 1) + 1;
                    if (Math.ceil($scope.paginationConf2.totalItems / itemsPerPage) === currentPage) {
                        $scope.last2 = $scope.paginationConf2.totalItems;
                    } else {
                        $scope.last2 = currentPage * itemsPerPage;
                    }
                };
                //分页配置
                $scope.paginationConf2 = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function () {	//操作之后的回调
                        //查询套装商品
                        addTacticsBuyService.CombinedProductQuery($scope, $scope.paginationConf2.currentPage, $scope.paginationConf2.itemsPerPage, false);
                    }
                };


                $scope.first2 = 1;
                $scope.last2 = $scope.paginationConf2.itemsPerPage;

                //外部上一页
                $scope.prev = function () {
                    $scope.paginationConf2.currentPage--;
                    $scope.paginationConf2.type = 0;
                    $scope.paginationConf2.extClick = true;
                    $scope.getPageIndex($scope.paginationConf2.currentPage, $scope.paginationConf2.itemsPerPage);
                };

                //外部下一页
                $scope.next = function () {
                    $scope.paginationConf2.currentPage++;
                    $scope.paginationConf2.type = 1;
                    $scope.paginationConf2.extClick = true;
                    $scope.getPageIndex($scope.paginationConf.currentPage, $scope.paginationConf2.itemsPerPage);

                };
            }

            //分页插件3
            function pageFun3() {

                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf3.totalItems / itemsPerPage + 1)) return;

                    $scope.first3 = itemsPerPage * (currentPage - 1) + 1;
                    if (Math.ceil($scope.paginationConf3.totalItems / itemsPerPage) === currentPage) {
                        $scope.last3 = $scope.paginationConf3.totalItems;
                    } else {
                        $scope.last3 = currentPage * itemsPerPage;
                    }
                };
                //分页配置
                $scope.paginationConf3 = {
                    currentPage: 1,   //初始化默认显示第几页
                    totalItems: 0,  //总记录条数
                    itemsPerPage: 10,  //每页显示多少条
                    pagesLength: 5, //分页长度
                    perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                    extClick: false, //当为外部点击翻页时为true
                    type: 0,  // 上一页0  下一页1
                    getPageIndex: $scope.getPageIndex,
                    onChange: function () {	//操作之后的回调
                        //查询活动商品
                        addTacticsBuyService.ProductSkuQuery($scope, $scope.paginationConf3.currentPage, $scope.paginationConf3.itemsPerPage, false, 'send');
                    }
                };


                $scope.first3 = 1;
                $scope.last3 = $scope.paginationConf3.itemsPerPage;

                //外部上一页
                $scope.prev = function () {
                    $scope.paginationConf3.currentPage--;
                    $scope.paginationConf3.type = 0;
                    $scope.paginationConf3.extClick = true;
                    $scope.getPageIndex($scope.paginationConf3.currentPage, $scope.paginationConf3.itemsPerPage);
                };

                //外部下一页
                $scope.next = function () {
                    $scope.paginationConf3.currentPage++;
                    $scope.paginationConf3.type = 1;
                    $scope.paginationConf3.extClick = true;
                    $scope.getPageIndex($scope.paginationConf3.currentPage, $scope.paginationConf3.itemsPerPage);

                };
            }

            //新增商品模块
            function message() {
                //活动商品变量
                $scope.activeContent = false;
                //赠送商品变量
                $scope.sendContent = false;

                //商品部分obj
                $scope.addMessage = {
                    sendBtn: true,
                    activityBtn: true
                };

                //搜索表单商品
                $scope.messageForm1 = {
                    goodsNum: '',
                    goodsName: '',
                    skuNum: '',
                    skuName: ''
                };
                //搜索表单套装
                $scope.taoForm1 = {
                    taoNum: '',
                    taoName: '',
                    skuNum: ''
                };
                //活动商品搜索
                $scope.messageForm = $.extend(true, {}, $scope.messageForm1);
                //活动套装搜索
                $scope.messageForm2 = $.extend(true, {}, $scope.taoForm1);
                //赠送商品搜索
                $scope.messageForm3 = $.extend(true, {}, $scope.messageForm1);

                //商品列表配置1
                $scope.addActivityMessageThead = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];

                //商品列表配置2
                $scope.addActivityMessageThead2 = [
                    {name: "仓库名称", tag: 'warename'},
                    {name: "库存数", tag: 'quantity'},
                    {name: "可用数", tag: 'canUseQuantity'},
                    {name: "可销数", tag: 'canSaleQuantity'}
                ];

                //套装商品列表配置
                $scope.addCombinedMessageThead = [
                    {name: "不可拆分", tag: 'issplit'},
                    {name: "套装代码", tag: 'productname'},
                    {name: "套装名称", tag: 'description'},
                    {name: "套装分类", tag: 'description'},
                    {name: "套装规格", tag: 'firstprice'},
                    {name: "礼盒", tag: 'isgift'},
                    {name: "重量", tag: 'weight'},
                    {name: "销售价", tag: 'wholesaleprice'},
                    {name: "备注", tag: 'note'}
                ];

                //活动商品信息详情列表配置
                $scope.theadList1 = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "套装商品", tag: 'iscombproduct'},
                    {name: "购买数量", tag: 'quantity'}
                ];

                //赠送商品信息详情列表配置
                $scope.theadList2 = [
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

                //活动商品信息模块函数
                $scope.isActiveShow = function (content) {
                    //取消按钮
                    if (content == false) {
                        $scope.activeContent = false;
                        if ($scope.tableList1 == undefined || $scope.tableList1.length == 0) {
                            $scope.addMessage.activityBtn = true;
                        }
                        $scope.messageForm = $.extend(true, {}, $scope.messageForm1);
                    } else {
                        $scope.activeContent = content;
                        if ($(indexID + ' .addMerchandiseDetails').hasClass('ng-hide') && $scope.activeContent == 'addActive') {
                            //查询活动商品
                            addTacticsBuyService.ProductSkuQuery($scope, 1, 10, true, 'activity');
                        } else if ($(indexID + ' .addSuitDetails').hasClass('ng-hide') && $scope.activeContent == 'addTao') {
                            //查询套装商品
                            addTacticsBuyService.CombinedProductQuery($scope, 1, 10, true);
                        }
                        $scope.addMessage.activityBtn = false;
                    }
                };

                //赠送商品信息模块函数
                $scope.isSendShow = function (content, myEvent) {
                    //取消
                    if (content == false) {
                        $scope.sendContent = false;
                        if ($scope.tableList2 == undefined || $scope.tableList2.length == 0) {
                            $scope.addMessage.sendBtn = true;
                        }
                        $scope.messageForm = $.extend(true, {}, $scope.messageForm1);
                    } else {
                        $scope.sendContent = content;
                        if ($(indexID + ' .addSendDetails').hasClass('ng-hide') && $scope.sendContent == 'addSend') {
                            //查询赠送商品
                            addTacticsBuyService.ProductSkuQuery($scope, 1, 10, true, 'send');
                        }
                        $scope.addMessage.sendBtn = false;
                    }
                };

                //搜索
                $scope.messageSearch = function (content) {
                    if (content == 'activity') {
                        addTacticsBuyService.ProductSkuQuery($scope, 1, $scope.paginationConf1.itemsPerPage, false, 'activity');
                    } else if (content == 'tao') {
                        addTacticsBuyService.CombinedProductQuery($scope, 1, $scope.paginationConf2.itemsPerPage, false);
                    } else if (content == 'send') {
                        addTacticsBuyService.ProductSkuQuery($scope, 1, $scope.paginationConf2.itemsPerPage, false, 'send');
                    }

                };

                //清空
                $scope.messageEmpty = function (content) {

                    if (content == 'activity') {
                        $scope.messageForm = $.extend(true, {}, $scope.messageForm1);
                    } else if (content == 'tao') {
                        $scope.messageForm2 = $.extend(true, {}, $scope.taoForm1);
                    } else if (content == 'send') {
                        $scope.messageForm3 = $.extend(true, {}, $scope.messageForm1);
                    }
                };

                //表格tr点击
                $scope.activityTrClick = function (myEvent, name, code, content) {
                    if (content == 'activity') {
                        $scope.canName1 = name;
                        $scope.canCode1 = code;
                    } else {
                        $scope.canName2 = name;
                        $scope.canCode2 = code;
                    }

                    //活动商品对应的仓库信息
                    addTacticsBuyService.InventoryVirtualGetOccupation($scope, code, true);
                    $(myEvent.target).closest('tr').addClass('green').siblings('tr').removeClass('green');
                };

                //表格内的勾选框
                $scope.tableSel = function (myEvent, $index, content) {
                    if (content == 'activity') {
                        $scope.addActivityMessage[$index].isSel = !$scope.addActivityMessage[$index].isSel;
                        $scope.addActivityMessage[$index].quantity = 1;
                    } else if (content == 'combined') {
                        $scope.addCombinedMessage[$index].isSel = !$scope.addCombinedMessage[$index].isSel;
                        $scope.addCombinedMessage[$index].quantity = 1;
                    } else if (content == 'send') {
                        $scope.addSendMessage[$index].isSel = !$scope.addSendMessage[$index].isSel;
                        $scope.addSendMessage[$index].quantity = 1;
                    }

                };

                //商品添加确定按钮
                $scope.messageSuccess = function (myEvent, content) {
                    //已选择商品
                    var selectMessageList = [];
                    if (content == 'activity' || content == 'combined') {
                        //追加已勾选的商品
                        if (content == 'activity') {
                            $.each($scope.addActivityMessage, function (i, obj) {
                                if (obj.isSel) {
                                    var a = {
                                        "Id": "00000000-0000-0000-0000-000000000000",
                                        "CreateDate": "0001-01-01 00:00:00",
                                        "StrategyId": "00000000-0000-0000-0000-000000000000",
                                        "productcode": obj.productcode,
                                        "productid": obj.productid,
                                        "productname": obj.productname,
                                        "iscombproduct": false,
                                        "quantity": 1,
                                        "deleted": false,
                                        "IsNew": false,
                                        "IsUpdate": true
                                    };

                                    selectMessageList.push(a);
                                }
                            });
                        } else if (content == 'combined') {
                            $.each($scope.addCombinedMessage, function (i, obj) {
                                if (obj.isSel) {
                                    var a = {
                                        "Id": "00000000-0000-0000-0000-000000000000",
                                        "CreateDate": "0001-01-01 00:00:00",
                                        "StrategyId": "00000000-0000-0000-0000-000000000000",
                                        "productcode": obj.productcode,
                                        "productid": obj.productid,
                                        "productname": obj.productname,
                                        "iscombproduct": true,
                                        "quantity": 1,
                                        "deleted": false,
                                        "IsNew": false,
                                        "IsUpdate": true
                                    };

                                    selectMessageList.push(a);
                                }
                            });
                        }


                        // 过滤已存在的商品
                        if ($scope.tableList1) {
                            for (var i = 0; i < $scope.tableList1.length; i++) {
                                for (var j = 0; j < selectMessageList.length; j++) {
                                    if (selectMessageList[j].productid.toLowerCase() == $scope.tableList1[i].productid.toLowerCase()) {
                                        selectMessageList.removeByValue(selectMessageList[j]);
                                    }
                                }
                            }
                            $scope.tableList1 = $scope.tableList1.concat(selectMessageList);
                        } else {
                            $scope.tableList1 = selectMessageList;
                        }

                        $scope.isActiveShow(false, '', myEvent);
                    }
                    else if (content == "send") {
                        $.each($scope.addSendMessage, function (i, obj) {
                            if (obj.isSel) {
                                var a = {
                                    "id": "00000000-0000-0000-0000-000000000000",
                                    "createdate": "0001-01-01 00:00:00",
                                    "strategyid": "00000000-0000-0000-0000-000000000000",
                                    "productid": obj.productcode,
                                    "productcode": obj.productcode,
                                    "productname": obj.productname,
                                    "skuid": obj.skuid,
                                    "skucode": obj.code,
                                    "skudescription": obj.description,
                                    "quantity": 1,
                                    "plansendqty": 1,
                                    "alreadysendqty": 0,
                                    "seq": 0,
                                    "alertquantity": 0,
                                    "Deleted": false,
                                    "IsNew": false,
                                    "IsUpdate": true
                                };

                                selectMessageList.push(a);
                            }
                        });
                        // 过滤已存在的商品
                        if ($scope.tableList2) {
                            for (var i = 0; i < $scope.tableList2.length; i++) {
                                for (var j = 0; j < selectMessageList.length; j++) {
                                    if (selectMessageList[j].productid.toLowerCase() == $scope.tableList2[i].productid.toLowerCase()) {
                                        selectMessageList.removeByValue(selectMessageList[j]);
                                    }
                                }
                            }
                            $scope.tableList2 = $scope.tableList2.concat(selectMessageList);
                        } else {
                            $scope.tableList2 = selectMessageList;
                        }

                        $scope.isSendShow(false, '', myEvent);
                    }
                };

                //删除
                $scope.deleteMessage = function (_index, content) {
                    //如果是原有商品，将deleted改为true，并追加到deletedMessageList
                    if (content == 'activity') {
                        if ($scope.tableList1[_index].id != '00000000-0000-0000-0000-000000000000') {
                            $scope.tableList1[_index].deleted = true;
                            deletedMessageList.push($scope.tableList1[_index]);
                        }
                        $scope.tableList1.removeByValue($scope.tableList1[_index]);

                        if ($scope.tableList1 == undefined || $scope.tableList1.length == 0) {
                            $scope.addMessage.activityBtn = true;
                        }
                    } else if (content == 'send') {
                        if ($scope.tableList2[_index].id != '00000000-0000-0000-0000-000000000000') {
                            $scope.tableList2[_index].deleted = true;
                            deletedMessageList2.push($scope.tableList2[_index]);
                        }
                        $scope.tableList2.removeByValue($scope.tableList2[_index]);

                        if ($scope.tableList2 == undefined || $scope.tableList2.length == 0) {
                            $scope.addMessage.sendBtn = true;
                        }
                    }
                };

                //表格修改 失去焦点赋值
                $scope.inputBlur = function (i, key, value, content) {
                    if (content == "activity") {
                        $scope.tableList1[i][key] = Number(value);
                    } else {
                        $scope.tableList2[i][key] = Number(value);
                    }

                };
            }

            //下拉框组件
            function selectInit() {
                //下拉选框插件 活动范围选择
                $scope.selectActivityProductRange = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingDegreeOfLatitude, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.activityproductrange},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.activityproductrange = obj.id;
                    }
                };

                //下拉选框插件 赠送类型选择
                $scope.selectActivitySendType = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingGiftType, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.activitysendtype},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.activitysendtype = obj.id;
                    }
                };

                //下拉选框插件 匹配时间选择
                $scope.selectDateType = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingMatchTime, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.datetype},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.datetype = obj.id;
                    }
                };

                //下拉选框插件 策略类型1选择
                $scope.selectStrategyType1 = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingPolicyType1, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.strategytype},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.strategytype = obj.id;
                    }
                };
                //下拉选框插件 策略类型2选择
                $scope.selectStrategyType2 = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingPolicyType2, 'id', 'name'),
                    objName: {id: $scope.modify.tableList.strategytype},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.strategytype = obj.id;
                    }
                };

                //下拉选框插件 来源类型选择
                $scope.selectOrderFrom = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingSourceType, 'id', 'name'),
                    objName: {id: $scope.modify.condition.orderfrom},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.condition.orderfrom = obj.id;
                    }
                };

                //下拉选框插件 翻倍赠送类型选择
                $scope.selectDoubleType = {
                    isshow: false,
                    validate: true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingDoubletype, 'id', 'name'),
                    objName: {id: $scope.modify.condition.doubletype.toString()},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.condition.doubletype = obj.id;
                    }
                };

                //下拉选框插件 快递信息
                $scope.selectExpress = {
                    isshow: false,
                    info: [],
                    validate: true,
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.expressid = obj.id;
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
                    $("#addTacticsBuy #shopModal").modal('show');

                    $.each($scope.storeList, function (i, obj) {
                        obj.isHide = false;
                    });
                    $scope.storeSearchObj.storeSearch = '';
                };

                //店铺搜索
                $scope.storeSearchObj = {
                    storeSearch: '',
                    storeSearchFun: function () {
                        $.each($scope.storeList, function (i, obj) {
                            if (obj.code.indexOf($scope.storeSearchObj.storeSearch) != -1 || obj.name.indexOf($scope.storeSearchObj.storeSearch) != -1) {
                                obj.isHide = false;
                            } else {
                                obj.isHide = true;
                            }
                        });
                    }
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
                    $("#addTacticsBuy #shopModal").modal('hide');

                    //存店铺id
                    $.each($scope.selectStoreList, function (index, obj) {
                        $scope.modify.stores.push({
                            "StoreId": obj.id
                        });
                    });
                };
            }

            //多选匹配地区弹出框
            function addressFun() {
                //匹配地区
                $scope.addressName = '请选择匹配地区';
                //已选匹配地区列表
                $scope.selectAddressList = [];

                //显示匹配地区多选弹框
                $scope.showAddressModal = function () {
                    $("#addTacticsBuy #addressModal").modal('show');
                    $.each($scope.addressList, function (i, obj) {
                        obj.isHide = false;
                    });
                    $scope.addressSearchObj.addressSearch = '';
                };

                //匹配地区搜索
                $scope.addressSearchObj = {
                    addressSearch: '',
                    addressSearchFun: function () {
                        $.each($scope.addressList, function (i, obj) {
                            if (obj.code.indexOf($scope.addressSearchObj.addressSearch) != -1 || obj.name.indexOf($scope.addressSearchObj.addressSearch) != -1) {
                                obj.isHide = false;
                            } else {
                                obj.isHide = true;
                            }
                        });
                    }
                };
                /**
                 * 选择单个匹配地区
                 */
                $scope.selectOneAddress = function (e, i) {
                    var obj = $(e.target);
                    if (obj.closest('.tr').find('.klwk-check-x').length > 0) {
                        $scope.selectAddressList.removeByValue($scope.addressList[i]);
                    } else {
                        $scope.selectAddressList.push($scope.addressList[i]);
                    }
                };

                /**
                 * 删除单个匹配地区
                 */
                $scope.deleteOneAddress = function (i) {
                    $scope.selectAddressList.removeByValue($scope.selectAddressList[i]);
                };
                /**
                 * 是否存在于已选匹配地区列表中
                 */
                $scope.isInSelectAddressList = function (item) {
                    if ($scope.selectAddressList.contains(item) < 0) {
                        return false;
                    } else {
                        return true;
                    }
                };
                /**
                 * 选择匹配地区 确认
                 */
                $scope.showAddress = function () {
                    if ($scope.selectAddressList.length > 0) {
                        $scope.addressName = "";
                        $.each($scope.selectAddressList, function (index, obj) {
                            $scope.addressName += obj.name + ';';
                        })
                    } else {
                        $scope.addressName = "请选择匹配地区";
                    }
                    $("#addTacticsBuy #addressModal").modal('hide');

                    //存匹配地区id
                    var addressArr = [];
                    $.each($scope.selectAddressList, function (index, obj) {
                        addressArr.push(obj.id);
                    });
                    $scope.modify.condition.orderprovince = addressArr.join();
                };
            }

            /**
             * 判断list.code是否包含在数组arr.code内
             * @param o 需要判断的内容
             * @param arr 大的集合
             * @returns {boolean}
             */
            var contains2 = function (o, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].code == o) {
                        return true;
                    }
                }
                return false;
            };

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

        }])
;