/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("addActivityApplyController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "addActivityApplyService", "APP_MENU","validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, addActivityApplyService, APP_MENU,validateService ) {

            //当前页面id
            var indexID = '#addActivityApply';

            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //初始化表单验证
                validateService.initValidate(indexID);
                
                //表单字段
                $scope.modify1 = {
                    "tableList": {
                        "id": '',
                        "createdate": '',
                        "begindate": '',
                        "enddate": '',
                        "subject": '',
                        "remark": '',
                        "content": '',
                        //报名状态
                        "registrationstatus": '',
                        "activitytypename": '',
                        "exports": '',
                        "activitytypeid": '',
                        "storeid": '',
                        "storename": '',
                        "isdisabled": false,
                        "warehouseinid": '',
                        "warehouseinparentid": '',
                        "warehouseinname": '',
                        "warehouseoutid": '',
                        "warehouseoutname": '',
                        //按调拨数量上传
                        "islockedquantity": false,
                        "salesqty": ''
                    },
                    "details": [],
                    "deleteddetails": []
                };
                $scope.modify = $.extend(true, {}, $scope.modify1);

                $scope.tableList1 = [];

                //按调拨数量上传
                $scope.locked = {
                    islockedquantityShow: false,
                    islockedFun: function () {
                        $scope.modify.tableList.islockedquantity=!$scope.modify.tableList.islockedquantity;
                    }
                };

                //修改页面
                if ($scope.params.type == 'modify') {
                    $scope.modify.tableList=$scope.params.tableList;
                    //查询是否有活动商品
                    addActivityApplyService.ActivityRegisterDetailGet($scope);

                    if($scope.modify.tableList.islockedquantity){
                        $scope.locked.islockedquantityShow=true;
                    }
                }

                selectInit();

                message();

                pageFun();


                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };

                //店铺
                addActivityApplyService.StoreGet($scope);

                //所有仓库
                addActivityApplyService.getWarehouse($scope);

                //活动类型
                addActivityApplyService.GeneralClassiFicationGet($scope);

                //调入仓库
                addActivityApplyService.WarehouseQuery($scope);

                //表单提交
                $scope.addBuySubmit = function () {

                    $scope.modify.details = $scope.tableList1;

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


                    if($scope.modify.details.length == 0){
                        toolsService.alertMsg("明细不能为空");
                        return false;
                    }

                    if(validateService.validateAll(indexID,'.basic-message') && $scope.modify.details.length > 0){
                        addActivityApplyService.ActivityRegisterSave($scope);
                    }
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $(indexID).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/activityApply.html';
                    $scope.option[index].name = '活动报名';
                };


            }

            init();

            function selectInit() {

                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.storename = obj.name;
                        $scope.modify.tableList.storeid = obj.id;
                    }
                };
                //下拉选框插件 活动类型
                $scope.selectActivitytype = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.activitytypename = obj.name;
                        $scope.modify.tableList.activitytypeid = obj.id;
                    }
                };

                //下拉选框插件 调入仓库
                $scope.selectWarehousein = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.warehouseinname = obj.name;
                        $scope.modify.tableList.warehouseinid = obj.id;
                        $scope.modify.tableList.warehouseinparentid = obj.parentid;
                        addActivityApplyService.WarehouseGet($scope);

                        $scope.modify.tableList.warehouseoutname = '';
                        $scope.modify.tableList.warehouseoutid = '';
                        $scope.selectWarehouseout.setValue({id: $scope.modify.tableList.warehouseoutid});
                        $scope.locked.islockedquantityShow = false;
                    }
                };

                //下拉选框插件 调出仓库
                $scope.selectWarehouseout = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.modify.tableList.warehouseoutname = obj.name;
                        $scope.modify.tableList.warehouseoutid = obj.id;
                        $scope.locked.islockedquantityShow = true;
                        $scope.modify.tableList.islockedquantity = true;
                    }
                };

            }

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
                        addActivityApplyService.ProductSkuQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, false);
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

            //新增商品模块
            function message() {
                //活动商品变量
                $scope.activeContent = false;

                //商品部分obj
                $scope.addMessage = {
                    activityBtn: true
                };

                //搜索表单
                $scope.messageForm1={
                    goodsNum:'',
                    goodsName:'',
                    skuNum:'',
                    skuName:''
                };
                $scope.messageForm= $.extend(true,{}, $scope.messageForm1);

                //列表配置1
                $scope.addActivityMessageThead = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];

                //列表配置2
                $scope.addActivityMessageThead2 = [
                    {name: "仓库名称", tag: 'warename'},
                    {name: "库存数", tag: 'quantity'},
                    {name: "可用数", tag: 'canUseQuantity'},
                    {name: "可销数", tag: 'canSaleQuantity'}
                ];

                //商品信息详情列表配置
                $scope.theadList1 = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "数量", tag: 'quantity'},
                    {name: "销售单价", tag: 'price'},
                    {name: "金额", tag: 'amount'},
                    {name: "活动状态", tag: 'registrationstatus'},
                    {name: "信息", tag: 'message'}
                ];

                //商品信息模块显示隐藏
                $scope.isActiveShow = function (content) {
                    if (content == false) {
                        $scope.activeContent = false;
                        if ($scope.tableList1 == undefined || $scope.tableList1.length == 0) {
                            $scope.addMessage.activityBtn = true;
                        }
                        $scope.messageForm= $.extend(true,{}, $scope.messageForm1);
                    } else {
                        $scope.activeContent = content;
                        if($(indexID+' .addMerchandiseDetails').hasClass('ng-hide') && $scope.activeContent=='addActive'){
                            //查询活动商品
                            addActivityApplyService.ProductSkuQuery($scope, 1, 10, true);
                        }
                        $scope.addMessage.activityBtn = false;
                    }
                };

                //表格tr点击
                $scope.activityTrClick = function (myEvent, name, code) {
                    $scope.canName = name;
                    $scope.canCode = code;
                    //活动商品对应的仓库信息
                    addActivityApplyService.InventoryVirtualGetOccupation($scope, code, true);
                    $(myEvent.target).closest('tr').addClass('green').siblings('tr').removeClass('green');
                };

                //搜索
                $scope.messageSearch= function () {
                    addActivityApplyService.ProductSkuQuery($scope, 1, 10, true);
                };

                //清空
                $scope.messageEmpty= function () {
                    $scope.messageForm= $.extend(true,{}, $scope.messageForm1);
                };

                //表格内的勾选框
                $scope.tableSel = function (myEvent, $index) {
                    $scope.addActivityMessage[$index].isSel = !$scope.addActivityMessage[$index].isSel;
                    $scope.addActivityMessage[$index].quantity = 1;
                };

                //删除 //该接口的删除是将删除的原有数据存放在deleteddetails，而不是将deleted改为true
                $scope.deleteMessage = function (_index) {
                    //如果是原有商品，将deleted改为true，并追加到deletedMessageList
                    if ($scope.tableList1[_index].id != '00000000-0000-0000-0000-000000000000') {
                        $scope.modify.deleteddetails.push($scope.tableList1[_index]);
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
                                "stockadjustorderid": 0,
                                "productcode": obj.productcode,
                                "productid": obj.productid,
                                "productname": obj.productname,
                                "skucode": obj.code,
                                "skuid": obj.skuid,
                                "skuname": obj.description,
                                "quantity": 0,
                                "lockedquantity": 0,
                                "price": 0,
                                "amount": 0,
                                "isprocessing": 0,
                                "salesqty": 0,
                                "updatestatus": false,
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            };

                            selectMessageList.push(a);
                        }
                    });

                    // 过滤已存在的商品
                    if($scope.tableList1 && $scope.tableList1.length>0){
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

        }
    ])
;