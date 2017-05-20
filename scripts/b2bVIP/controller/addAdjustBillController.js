/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addAdjustBillController", ["$scope", "$rootScope", "toolsService", "addAdjustBillService", "APP_MENU", "ApiService","validateService", function ($scope, $rootScope, toolsService, addAdjustBillService, APP_MENU, ApiService,validateService) {

        //已删除的原有商品
        var deletedMessageList = [];
        //当前页面id
        var indexID = '#addAdjustBill';

        function init() {
            //接收参数
            $scope.params = $.extend(true, {}, $rootScope.params);

            //初始化表单验证
            validateService.initValidate(indexID);

            //表单字段
            $scope.modify1 = {
                "tableList": {
                    "id": 0,
                    "creatdate": '0001-01-01 00:00:00',
                    "scheduleid": '',
                    "schedulecode": '',
                    "schedulename": '',
                    "outvirtualwarehouseid": '',
                    "outvirtualwarehousename": '',
                    "adjustreasontype": '',
                    "adjusttype": 0,
                    "remark": '',
                    "storeid": '',
                    "isUploadInventory": false
                },
                "details": []
            };
            $scope.modify = $.extend(true, {}, $scope.modify1);

            $scope.tableList1=[];

            //新增页面
            $scope.statusSave = 0;

            //修改页面
            if ($scope.params.type == 'modify') {
                $scope.modify = {
                    tableList: $scope.params.tableList
                };
                $scope.statusSave = 2;

                //查询是否有商品
                addAdjustBillService.VipStockAdjustOrderDetailGet($scope, true);
            }

            //新增商品
            message();

            //下拉框组件
            selectFun();

            //分页
            pageFun();

            //档期名称
            addAdjustBillService.VipScheduleGet($scope);

            //所有仓库
            addAdjustBillService.getWarehouse($scope);

            //档期选择侧滑框
            $scope.rightSideObj = {
                searchText: '',
                schedulenameShow: function () {
                    $(indexID + ' #rightSideModal').show(500);
                },
                hideModal: function () {
                    $(indexID + ' #rightSideModal').hide(500);
                    $scope.rightSideObj.searchText = '';
                    $.each($scope.tableRightSideList, function (i, obj) {
                        obj.isHide = false;
                    });
                },
                search: function () {
                    $.each($scope.tableRightSideList, function (i, obj) {
                        if (JSON.stringify(obj).indexOf($scope.rightSideObj.searchText) != -1) {
                            obj.isHide = false;
                        } else {
                            obj.isHide = true;
                        }
                    });
                },
                select: function (obj, e) {
                    $scope.selectSchedulename = obj.schedulename;
                    $scope.selectSchedulecode = obj.schedulecode;
                    $scope.selectScheduleid = obj.id;
                    $scope.selectStoreid = obj.storeid;
                    $scope.selectOutvirtualwarehousename = obj.outvirtualwarehousename;
                    $scope.selectOutvirtualwarehouseid = obj.outvirtualwarehouseid;

                    $(e.target).closest('tbody').find('tr').removeClass('green');
                    $(e.target).closest('tr').addClass('green');
                },
                ensure: function () {
                    $scope.modify.tableList.schedulename = $scope.selectSchedulename;
                    $scope.modify.tableList.schedulecode = $scope.selectSchedulecode;
                    $scope.modify.tableList.scheduleid = $scope.selectScheduleid;
                    $scope.modify.tableList.storeid = $scope.selectStoreid;
                    $scope.modify.tableList.outvirtualwarehousename = $scope.selectOutvirtualwarehousename;
                    $scope.modify.tableList.outvirtualwarehouseid = $scope.selectOutvirtualwarehouseid;
                    $(indexID + ' #rightSideModal').hide(500);
                }
            };

            //上传库存
            $scope.isUpload = function () {
                $scope.modify.tableList.isUploadInventory = !$scope.modify.tableList.isUploadInventory;
            };


            //保存
            $scope.submit = function () {

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

                if (!$scope.modify.tableList.scheduleid) {
                    toolsService.alertMsg("请选择唯品档期");
                    return false;
                }

                if($scope.modify.details.length == 0 || !isDeleted){
                    toolsService.alertMsg("明细不能为空");
                    return false;
                }

                if(validateService.validateAll(indexID,'.basic-message') && $scope.modify.details.length > 0 && isDeleted){
                    addAdjustBillService.VipStockAdjustOrderSave($scope);
                }
            };

            //返回//取消
            $scope.returnFun = function () {
                var index = $('#addAdjustBill').closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/b2bVIP/adjustBill.html';
                $scope.option[index].name = '唯品调整单';
                $scope.modify = $.extend(true, {}, $scope.modify1);
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
                    addAdjustBillService.ProductSkuQuery($scope, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, false);
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
                {name: "唯品规格编码", tag: 'vipskucode'},
                {name: "供货价(含税)", tag: 'supplyprice'},
                {name: "调整数量", tag: 'adjustqty'},
                {name: "明细状态", tag: ''},
                {name: "上传错误信息", tag: ''}
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
                        addAdjustBillService.ProductSkuQuery($scope, 1, 10, true);
                    }
                    $scope.addMessage.activityBtn = false;
                }
            };

            //搜索
            $scope.messageSearch= function () {
                addAdjustBillService.ProductSkuQuery($scope, 1, 10, true);
            };

            //清空
            $scope.messageEmpty= function () {
                $scope.messageForm= $.extend(true,{}, $scope.messageForm1);
            };

            //表格tr点击
            $scope.activityTrClick = function (myEvent, name, code) {
                $scope.canName = name;
                $scope.canCode = code;
                //活动商品对应的仓库信息
                addAdjustBillService.InventoryVirtualGetOccupation($scope, code, true);
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
                            "id": 0,
                            "createdate": '0001-01-01 00:00:00',
                            "stockadjustorderid": 0,
                            "productcode": obj.productcode,
                            "productid": obj.productid,
                            "productname": obj.productname,
                            "skucode": obj.code,
                            "skuid": obj.skuid,
                            "skuname": obj.description,
                            "vipskucode": obj.code,
                            "adjustqty": 1,//
                            "ActualQty": 0,
                            "supplyprice": 0,//
                            "IsOutOfStock": false,
                            "ScheduleDetailId": 0,
                            "DetailStatus": 0,
                            "UploadType": 2,
                            "UploadQuantity": 0,
                            "deleted": false,
                            "IsNew": false,
                            "IsUpdate": true
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

        function selectFun() {
            //下拉选框插件 调整原因
            $scope.selectAdjustReasonType = {
                isshow: false,
                validate:true,
                info: klwTool.jsonToArray2(APP_MENU.CITadjustmentReason, 'id', 'name'),
                objName: {id: $scope.modify.tableList.adjustreasontype},
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.tableList.adjustreasontype = obj.id;
                }
            };

            //下拉选框插件 调整类型
            $scope.selectAdjustType = {
                isshow: false,
                validate:true,
                info: klwTool.jsonToArray2(APP_MENU.CITadjustmentType, 'id', 'name'),
                objName: {id: $scope.modify.tableList.adjusttype},
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.tableList.adjusttype = obj.id;
                }
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
                } else if (arr[i].skuid == o) {
                    return true;
                }
            }
            return false;
        };

    }]);