/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("addPresellPlanController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "addPresellPlanService", "APP_COLORS",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, addPresellPlanService, APP_COLORS) {

            //当前页面id
            var indexID = '#addPresellPlan';
            //已删除的原有商品
            var deletedMessageList = [];

            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //表单字段
                $scope.modify1 = {
                    tableList: {
                        id: '0',
                        creatdate: '0001-01-01 00:00:00',
                        begindate: '',
                        enddate: '',
                        note: '',
                        //留单时间
                        deliverydate: '',
                        //自动上架
                        islisting: false,
                        //动态预售
                        isdynamic: false,
                        totalpresellquantity: 0,
                        totalsalesqty: 0
                    },
                    details: [],
                    stores: []
                };
                $scope.modify = $.extend(true, {}, $scope.modify1);

                var begindate=new Date().format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                var enddate=new Date().getAfterDate(7)[6].format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                $scope.modify.tableList.begindate=begindate;
                $scope.modify.tableList.enddate=enddate;

                $scope.tableList1=[];

                //修改页面//复制页面
                if ($scope.params.type == 'modify') {
                    $scope.modify = {
                        tableList: $scope.params.tableList
                    };
                    if ($scope.modify.tableList.deliverydate) {
                        $scope.leaveBill = true;
                    }
                    //获取商品
                    addPresellPlanService.PreSellPlanDetailGet($scope, true);
                }
                


                //留单
                $scope.leaveBill = false;
                $scope.isAutoFun = function (content) {
                    switch (content) {
                        case '1':
                            $scope.modify.tableList.islisting = !$scope.modify.tableList.islisting;
                            break;
                        case '2':
                            $scope.modify.tableList.isdynamic = !$scope.modify.tableList.isdynamic;
                            break;
                        case '3':
                            if ($scope.modify.tableList.deliverydate) {
                                $scope.modify.tableList.deliverydate = '';
                            }
                            $scope.leaveBill = !$scope.leaveBill;
                            break;
                    }
                };
                
                //分页
                pageFun();

                //店铺
                storeFun();

                //商品模块
                message();

                //查询店铺
                addPresellPlanService.StoreGet($scope);

                //查询所有仓库
                addPresellPlanService.getWarehouse($scope);

                //导入模板
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

                //表单提交
                $scope.addBuySubmit = function () {
                    if($scope.tableList1){
                        $scope.modify.details = $scope.tableList1.concat(deletedMessageList);
                    }else{
                        $scope.modify.details=[];
                    }

                    //判断$scope.modify.details中存的全是已删除的商品，如果是则isDeleted为true，则不能进行保存操作
                    var isDeleted = false;
                    $.each($scope.modify.details, function (i, obj) {
                        if (!obj.deleted) {
                            isDeleted = true;
                            return false;
                        }
                    });

                    if($scope.modify.stores && $scope.modify.stores.length == 0){
                        toolsService.alertMsg("请选择店铺");
                        return false;
                    }

                    //预售开始时间须小于预售时间
                    var begindate2 = $scope.modify.tableList.begindate.split('-');
                    var enddate2 = $scope.modify.tableList.enddate.split('-');
                    if (Number(begindate2[0]) > Number(enddate2[0])) {
                        toolsService.alertMsg("预售开始时间须小于预售时间!");
                        return false;
                    }
                    if (Number(begindate2[0]) == Number(enddate2[0]) && Number(begindate2[1]) > Number(enddate2[1])) {
                        toolsService.alertMsg("预售开始时间须小于预售时间!");
                        return false;
                    }
                    if (Number(begindate2[0]) == Number(enddate2[0]) && Number(begindate2[1]) == Number(enddate2[1]) && Number(begindate2[2]) > Number(enddate2[2])) {
                        toolsService.alertMsg("预售开始时间须小于预售时间!");
                        return false;
                    }

                    if($scope.modify.details.length == 0 || !isDeleted){
                        toolsService.alertMsg("明细不能为空");
                        return false;
                    }

                    addPresellPlanService.PreSellPlanSave($scope);
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $(indexID).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/presellPlan.html';
                    $scope.option[index].name = '预售计划';
                };

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };


            }

            init();

            //分页插件
            function pageFun() {

                //计算每页的数据索引
                $scope.getPageIndex = function (currentPage, itemsPerPage) {
                    //超出页码范围 return
                    if (currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1)) return;

                    $scope.first = itemsPerPage * (currentPage - 1) + 1;
                    if (Math.ceil($scope.paginationConf.totalItems / itemsPerPage) === currentPage) {
                        $scope.last = $scope.paginationConf.totalItems;
                    } else {
                        $scope.last = currentPage * itemsPerPage;
                    }
                };
                
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
                        addPresellPlanService.ProductSkuQuery($scope, 1, $scope.paginationConf.itemsPerPage, 0, false);
                    }
                };

                $scope.first = 1;
                $scope.last = $scope.paginationConf.itemsPerPage;

                //外部上一页
                $scope.prev = function () {
                    $scope.paginationConf.currentPage--;
                    $scope.paginationConf.type = 0;
                    $scope.paginationConf.extClick = true;
                    $scope.getPageIndex($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
                };

                //外部下一页
                $scope.next = function () {
                    $scope.paginationConf.currentPage++;
                    $scope.paginationConf.type = 1;
                    $scope.paginationConf.extClick = true;
                    $scope.getPageIndex($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);

                };
            }

            //店铺组件
            function storeFun() {
                //编辑店铺比例
                $scope.rateModify = function (e) {
                    var input = $(e.target).closest('.leftTr').find('.input-modify');
                    input.removeProp('disabled');
                    input.trigger('focus');
                    input.siblings('i').css('display', 'none');
                    input.blur(function () {
                        input.siblings('i').css('display', 'inline-block');
                    })
                };
                //编辑店铺比例blur
                $scope.rateBlur = function (e, i) {
                    //将000，或者0001数字格式化
                    var value = $(e.target).closest('.input-modify').val().replace(/\b(0+)/gi, "");
                    if (value === '') {
                        $scope.storeList[i].rate = 0;
                        $(e.target).closest('.input-modify').val(0);
                    } else {
                        $scope.storeList[i].rate = value;
                        $(e.target).closest('.input-modify').val(value);
                    }

                    //判断是否是已选择的店铺
                    var selIndex = contains2($scope.storeList[i].storeid, $scope.selectStoreList);
                    if (typeof(selIndex) == 'number') {
                        $scope.selectStoreList[selIndex].rate = $scope.storeList[i].rate;
                    }

                };
                //店铺
                $scope.storeDivName = '请选择活动店铺';
                //已选店铺列表
                $scope.selectStoreList = [];

                //显示店铺多选弹框
                $scope.showShopModal = function () {
                    $(indexID + " #shopModal").modal('show');

                    $.each($scope.storeList, function (i, obj) {
                        obj.isHide = false;
                    });
                    $scope.storeSearchObj.storeSearch='';
                };

                //店铺搜索
                $scope.storeSearchObj={
                    storeSearch:'',
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
                        removeByValue2($scope.storeList[i].storeid, $scope.selectStoreList);
                    } else {
                        $scope.storeList[i].rate = obj.closest('.tr').find('.input-modify').val();
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
                    if (contains2(item.storeid, $scope.selectStoreList) === false) {
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
                        $scope.storeDivName = "";
                        $.each($scope.selectStoreList, function (index, obj) {
                            $scope.storeDivName += obj.storename + ';';
                        })
                    } else {
                        $scope.storeDivName = "请选择活动店铺";
                    }
                    $("#addPresellPlan #shopModal").modal('hide');

                    //存店铺id
                    $scope.modify.stores = [];
                    $.each($scope.selectStoreList, function (index, obj) {
                        $scope.modify.stores.push(obj);
                    });
                };
            }

            //商品模块
            function message() {
                //活动商品变量
                $scope.activeContent = false;

                //商品部分obj
                $scope.addMessage = {
                    activityBtn: true
                };

                //搜索表单
                $scope.messageForm1 = {
                    goodsNum: '',
                    goodsName: '',
                    skuNum: '',
                    skuName: ''
                };
                $scope.messageForm = $.extend(true, {}, $scope.messageForm1);

                //商品列表配置
                $scope.addActivityMessageThead = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];

                //仓库列表配置
                $scope.addActivityMessageThead2 = [
                    {name: "仓库名称", tag: 'warename'},
                    {name: "库存数", tag: 'quantity'},
                    {name: "可用数", tag: 'canUseQuantity'},
                    {name: "可销数", tag: 'canSaleQuantity'}
                ];

                //商品信息详情列表配置
                $scope.theadList1 = [
                    {name: "铺货异常", tag: 'iserr'},
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "预售数量", tag: 'presellquantity'},
                    {name: "在途数量", tag: 'onthewayquantity'},
                    {name: "颜色备注", tag: 'colorstatus'}
                ];

                //商品信息模块显示隐藏
                $scope.isActiveShow = function (content) {
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
                            addPresellPlanService.ProductSkuQuery($scope, 1, 10, true);
                        }
                        $scope.addMessage.activityBtn = false;
                    }
                };

                //搜索
                $scope.messageSearch = function () {
                    addActivityApplyService.ProductSkuQuery($scope, 1, 10, true);
                };

                //清空
                $scope.messageEmpty = function () {
                    $scope.messageForm = $.extend(true, {}, $scope.messageForm1);
                };

                //表格tr点击
                $scope.activityTrClick = function (myEvent, name, code) {
                    $scope.canName = name;
                    $scope.canCode = code;
                    //活动商品对应的仓库信息
                    addPresellPlanService.InventoryVirtualGetOccupation($scope, code, true);
                    $(myEvent.target).closest('tr').addClass('green').siblings('tr').removeClass('green');
                };

                //表格内的勾选框
                $scope.tableSel = function (myEvent, $index) {
                    $scope.addActivityMessage[$index].isSel = !$scope.addActivityMessage[$index].isSel;
                    $scope.addActivityMessage[$index].quantity = 1;
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
                        $scope.addMessage.activityBtn = true;
                    }
                };

                //表格修改失去焦点赋值
                $scope.inputBlur = function (i, content,value) {
                    $scope.tableList1[i][content]=Number(value);
                };
                
                //商品添加确定按钮
                $scope.messageSuccess = function (myEvent) {
                    //已选择商品
                    var selectMessageList = [];

                    //追加已勾选的商品
                    $.each($scope.addActivityMessage, function (i, obj) {
                        if (obj.isSel) {
                            var a = {
                                "id": "00000000-0000-0000-0000-000000000000",
                                "createdate": '0001-01-01 00:00:00',
                                "presellplanid": "00000000-0000-0000-0000-000000000000",
                                "onthewayquantity": 0,
                                "presellquantity": 1,
                                "skucode": obj.code,
                                "skuid": obj.skuid,
                                "skuname": obj.description,
                                "productcode": obj.productcode,
                                "productid": obj.productid,
                                "productname": obj.productname,
                                "status": 0,
                                "colorstatus": 0,
                                "salesQty": 0,
                                "cansalesqty": 1,
                                "iserr": false,
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            };
                            selectMessageList.push(a);
                        }
                    });

                    // 过滤已存在的商品
                    if($scope.tableList1){
                        for (var i = 0; i < $scope.tableList1.length; i++) {
                            for (var j = 0; j < selectMessageList.length; j++) {
                                if (selectMessageList[j].skuid.toLowerCase() == $scope.tableList1[i].skuid.toLowerCase()) {
                                    selectMessageList.removeByValue(selectMessageList[j]);
                                }
                            }
                        }
                        $scope.tableList1 = $scope.tableList1.concat(selectMessageList);
                    }else{
                        $scope.tableList1=selectMessageList;
                    }
                    $scope.isActiveShow(false, '', myEvent);
                    $(myEvent.target).closest('.jxmessage').find('.icon-sel-zhengque').removeClass('icon-sel-zhengque');
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
                    else if (arr[i].storeid && arr[i].storeid.toLowerCase() == o.toLowerCase()) {
                        return i;
                    }
                }
                return false;
            };

            /**
             * 从数组中删除指定值元素
             * @param val 指定元素的值
             */
            var removeByValue2 = function (val, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].storeid && (arr[i].storeid.toLowerCase() == val.toLowerCase())) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }

        }
    ])
;