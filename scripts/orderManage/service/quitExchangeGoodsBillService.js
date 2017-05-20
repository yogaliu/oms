/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('quitExchangeGoodsBillService',['ApiService','toolsService','orderManagePublicService','APP_MENU',
        function (ApiService,toolsService,orderManagePublicService,APP_MENU) {
            //配置数据
            var configData = {
                //退换货单列定义
                columns : [
                    {name : '订单特殊标识',tag : 'tips'},
                    {name : '单据编号',tag : 'code'},
                    {name : '标记',tag : 'tagname'},
                    {name : '内部标签', tag : 'message'},
                    {name : '退货方式', tag : 'returnstyle',otherInfo:APP_MENU['returnMethod']},
                    {name : '退货类型', tag : 'returnordertypename'},
                    {name : '退款方式', tag : 'refundway',otherInfo : APP_MENU['refundMethod']},
                    {name : '销售订单', tag : 'salesordercode'},
                    {name : '平台订单号', tag : 'tradeid'},
                    {name : '分销订单号', tag : 'codpayment'},
                    {name : '店铺名称', tag : 'storename'},
                    {name : '状态', tag : 'status',otherInfo : APP_MENU['returnOrExchangeStatus']},
                    {name : '退入仓库', tag : 'warehouseinname'},
                    {name : '换出仓库', tag : 'warehouseoutname'},
                    {name : '会员昵称', tag : 'membername'},
                    {name : '会员编码', tag : 'membercode'},
                    {name : '退回快递', tag : 'expressname'},
                    {name : '退回运单', tag : 'expressno'},
                    {name : '退回数量', tag : 'quantity'},
                    {name : '扫描人', tag : 'scanuser'},
                    {name : '扫描日期', tag : 'scantime'},
                    {name : '制单人', tag : 'createusername'},
                    {name : '制单日期', tag : 'createdate'},
                    {name : '审核人', tag : 'approveuser'},
                    {name : '审核日期', tag : 'approvedate'},
                    {name : '复核人', tag : 'audituser'},
                    {name : '复核日期', tag : 'auditdate'},
                    {name : '通知单号', tag : 'noticecode'},
                    {name : '补差价金额', tag : 'offsetamount'},
                    {name : '手机号', tag : 'membercode'},
                    {name : '收货人', tag : 'consigneename'},
                    {name : '收货地址', tag : 'consigneeaddress'}
                ]
            };

            //退换货单dom操作
            var qOreGoodsDomOperate = {
                //初始化信息
                domInit : function (scope){

                    //列配置
                    scope.returnOrderHead = configData.columns;

                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.returnOrderHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };

                    //高级搜索配置
                    this.searchCondition(scope);

                    //已经选中的数据
                    scope.orderListHasChosed = [];
                    //tab栏切换，默认为first页面
                    scope.tab = 'first';
                    //初始化分页配置
                    this.pageSet(scope);
                    //批量操作配置
                    this.pullSelect(scope);

                    //翻到上一页
                    scope.prev = function (){
                        orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                    };
                    //翻到下一页
                    scope.next = function () {
                        orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                    };

                    //高级搜索初始化
                    scope.advancedSearchObj1 = orderManagePublicService.orderManagerPublicFunction.advanceSearch(scope);
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);

                    //复选框默认不勾选
                    scope.labelSel = false;

                    //复选框勾选与取消勾选
                    scope.isLabelSel = function (myEvent) {
                        toolsService.isLabelSel($scope, myEvent);
                    };

                    //制单时间（开始）
                    this.timePicker('CreateDate');
                    //制单时间（结束）
                    this.timePicker('EndCreateDate');
                    //审核时间（开始）
                    this.timePicker('ApproveDate');
                    //审核时间（结束）
                    this.timePicker('EndApproveDate');
                    //复核时间（开始）
                    this.timePicker('AuditDateBegin');
                    //审核时间（结束）
                    this.timePicker('AuditDateEnd');
                    //扫描时间（开始）
                    this.timePicker('ScanTimeBegin');
                    //扫描时间（结束）
                    this.timePicker('ScanTimeEnd');

                    //获取所有退换货单
                    InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                    //获取所有店铺信息
                    InterfaceDeal.getAllShopsDeal(scope);
                    //获取所有仓库信息
                    InterfaceDeal.getAllWareHouseDeal(scope);
                    //获取所有退货类型
                    InterfaceDeal.getReturnTypeDeal(scope);
                },
                //高级搜索条件配置
                searchCondition : function (scope) {
                    //高级搜索数据集合（选择）
                    scope.formChoseData = {};
                    //高级搜索数据集合（填写）
                    scope.formData = {};
                    //订单状态
                    scope.orderStatus = {};
                    //店铺信息
                    scope.storeList = {};
                    //退入仓库
                    scope.wareHouseList = {};
                    //退货类型
                    scope.ReturnType = {};
                },
                //时间控件
                timePicker : function (id) {
                    $('#'+id).datetimepicker({
                        format: 'yyyy-mm-dd H:i:s',
                        weekStart: 1,
                        autoclose: true,
                        startView: 2,
                        minView: 2,
                        forceParse: false,
                        todayBtn:1,
                        language: 'zh-CN'
                    });
                },
                //批量操作配置
                pullSelect : function (scope) {
                    //批量操作配置
                    scope.batchOperate = {
                        isshow:false,
                        info:[
                            {name:'审核',tag : 'auditReturnProductDeal',checkType : 'auditCheck',errorMessage : '单据状态不正确，不能审核！'},
                            {name : '复核' ,tag : 'reAuditReturnProductDeal',checkType : "reAuditCheck",errorMessage : '单据状态不正确，不能复核！'},
                            {name : '生成通知单' ,tag : 'createRequisition',checkType : 'createRequisitionCheck',errorMessage : '单据状态不正确，不能审核'},
                            {name : '反审' ,tag : 'returnAuditDeal',checkType : 'returnAuditCheck',errorMessage : '单据状态不正确，不能反审'},
                            {name : '作废' ,tag : 'CancellationDeal',checkType : 'CancellationCheck',errorMessage : '单据状态不正确，不能作废'},
                            {name : '标记' ,list:[
                                {name : '次品退货' ,tag : 'returnProductTagDeal'},
                                {name : '正品退货' ,tag : 'returnProductTagDeal'}
                            ]},
                            {name : '内部标签' ,tag : 'addLabelDeal'}
                        ],
                        objName:{name:'批量操作'},
                        onChange: function(obj,index){	//点击之后的回调
                            var ids = [];
                            //获取所有选中退换货单的id
                            for(var i = 0,j = scope.returnOrderBody.length;i < j;i++){
                                if(scope.returnOrderBody[i]['trShow']){
                                    ids.push(scope.returnOrderBody[i]['id']);
                                    //判断是否允许操作
                                    if(obj.checkType && !scope.operateCheck[obj.checkType](scope.returnOrderBody[i])){
                                        toolsService.alertMsg(obj.errorMessage);
                                        return false;
                                    }
                                }
                            }
                            //判断是否选中订单
                            if(ids.length < 1){
                                toolsService.alertMsg('请先选择订单！');
                            }else{
                                InterfaceDeal[obj.tag](scope,ids,obj.name);
                            }
                        }
                    };
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        InterfaceDeal.getquitOrExchangeGoodsBill(scope,
                            function (pageNum) {
                                //ng-repeat执行完后的回调
                                //scope.$on("conditionCallback",function(){
                                //    //$('#expressTable').fixedHeaderTable({
                                //    //    footer: false,
                                //    //    fixedColumns: 1,
                                //    //    destroy :true
                                //    //});
                                //});
                            });
                    });
                }

            };

            //退换货单全部接口
            var InterfaceDeal = {
                //获取所有退换货单
                getquitOrExchangeGoodsBill : function (scope) {
                    quitOrExchangeGoodsInterface.queryQuitOrExchangeGoodsBill(scope, function (res) {
                        if(res.success){
                            //清除全选标志
                            scope.checkAll = false;
                            scope.returnOrderBody = res.data;
                            //设置总页数
                            scope.paginationConf.totalItems = res.total;
                        }else{
                            toolsService.alertError('获取退换货单失败！');
                        }
                    });
                },
                //生成通知单
                createRequisition : function (scope,ids){
                    scope.modal = {
                        title : '请输入箱码',
                        confirm : function (content) {
                            //发送生成通知到哪请求
                            quitOrExchangeGoodsInterface.createRequisition(scope,content,ids, function (res) {
                                if(res.success){
                                    toolsService.alertSuccess('生成成功！');
                                    //刷新页面
                                    InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                                }else{
                                    toolsService.alertError('生成失败！');
                                }
                                $('.info-get-modal').modal('hide');
                            });
                            scope.content = '';
                        }
                    };
                    $('.info-get-modal').modal('show');
                },

                //审核退换货单
                auditReturnProductDeal : function (scope,ids) {
                    quitOrExchangeGoodsInterface.auditReturnProduct(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('审核成功！');
                            InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                        }else{
                            toolsService.alertError('审核失败！');
                        }
                    });
                },

                //复核退换货单
                reAuditReturnProductDeal : function(scope,ids){
                    quitOrExchangeGoodsInterface.reAuditReturnProduct(ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('复核成功！');
                            InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                        }else{
                            toolsService.alertError('复核失败！');
                        }
                    });
                },

                //反审退换货单
                returnAuditDeal : function(scope,ids){
                    quitOrExchangeGoodsInterface.returnAudit(ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('反审成功！');
                            InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                        }else{
                            toolsService.alertError('反审失败！');
                        }
                    });
                },

                //作废退换货单
                CancellationDeal : function (scope,ids) {
                    quitOrExchangeGoodsInterface.Cancellation(ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('作废成功！');
                            InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                        }else{
                            toolsService.alertError('作废失败！');
                        }
                    });
                },

                //添加标记
                returnProductTagDeal : function (scope,ids,tagName) {
                    quitOrExchangeGoodsInterface.returnProductTag(tagName,ids, function (res) {
                        if(res.success){
                            InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                        }else{
                            toolsService.alertError('作废失败！');
                        }
                    });
                },

                //添加内部标签
                addLabelDeal : function (scope,ids) {
                    //生成{"id":id}这种格式的数据
                    var idObj = {};
                    for(var i = 0,j = ids.length;i < j;i++){
                        idObj[ids[i]] = ids[i];
                    }
                    //配置模态框
                    scope.modal = {
                        title : '请输入内容',
                        confirm : function (content) {
                            quitOrExchangeGoodsInterface.addLabel(content,idObj, function (res) {
                                if(res.success){
                                    //刷新页面
                                    InterfaceDeal.getquitOrExchangeGoodsBill(scope);
                                }else{
                                    alert(res.errorMessage);
                                }
                            });
                            $('.info-get-modal').modal('hide');
                            scope.modal.content = '';
                        }
                    };
                    $('.info-get-modal').modal('show');
                },
                //处理店铺数据
                getAllShopsDeal : function (scope) {
                    quitOrExchangeGoodsInterface.getAllShops(scope, function (res) {
                        if(res.success){
                            //处理店铺数据格式
                            toolsService.setDataShowType(scope,res.data,scope.storeList,5);
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },
                //处理仓库数据
                getAllWareHouseDeal : function (scope) {
                    quitOrExchangeGoodsInterface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            //处理仓库数据格式
                            toolsService.setDataShowType(scope,res.data,scope.wareHouseList,5);
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },
                //获取退换货类型
                getReturnTypeDeal : function (scope) {
                    quitOrExchangeGoodsInterface.getReturnType(scope, function (res) {
                        if(res.success){
                            //处理仓库数据格式
                            toolsService.setDataShowType(scope,res.data,scope.ReturnType,5);
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                }

            };

            //退换货单接口
            var quitOrExchangeGoodsInterface = {

                /**
                 * 获取退换货类型
                 * @param scope
                 * @param callback
                 */
                getReturnType : function (scope,callback) {
                    var url = '/BasicInformation/GeneralClassiFication/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex": 1,
                        "PageSize": 50000,
                        "Timespan": "00:00:00.034",
                        "SeletedCount": 0,
                        "Data": [
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ClassiFicationType",
                                "Name": "ClassiFicationType",
                                "Value": 1,
                                "Children": []
                            }
                        ],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var type = ApiService.postCache(url,paramObj);
                    type.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取所有仓库信息
                 * @param scope $scope对象
                 * @param callback 获取仓库后的回调函数
                 */
                getAllWareHouse : function (scope,callback) {
                    var url = '/BasicInformation/Warehouse/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var wareHose = ApiService.postCache(url,paramObj);
                    wareHose.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取所有店铺的接口
                 * @param scope $scope对象
                 * @param callback 调用接口成功后的回调函数
                 */
                getAllShops : function (scope,callback) {
                    var url = '/BasicInformation/Store/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }];
                    var shopList = ApiService.postCache(url,paramObj);
                    shopList.then(function (res) {
                        callback(res);
                    });
                },
                //获取所有退换货单
                queryQuitOrExchangeGoodsBill : function (scope,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.formData.Code,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDate",
                                "Value": scope.formData.CreateDate,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "EndCreateDate",
                                "Value": scope.formData.EndCreateDate,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ApproveDate",
                                "Name": "ApproveDate",
                                "Value": scope.formData.ApproveDate,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ApproveDate",
                                "Name": "EndApproveDate",
                                "Value": scope.formData.EndApproveDate,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "AuditDate",
                                "Name": "AuditDateBegin",
                                "Value": scope.formData.AuditDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "AuditDate",
                                "Name": "AuditDateEnd",
                                "Value": scope.formData.AuditDateEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ScanTime",
                                "Name": "ScanTimeBegin",
                                "Value": scope.formData.ScanTimeBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ScanTime",
                                "Name": "ScanTimeEnd",
                                "Value": scope.formData.ScanTimeEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.formChoseData.Status ? scope.formChoseData.Status.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "StoreId",
                                "Name": "StoreId",
                                "Value": scope.formChoseData.StoreId ? scope.formChoseData.StoreId.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "WarehouseInId",
                                "Name": "WarehouseInId",
                                "Value": scope.formChoseData.WarehouseInId ? scope.formChoseData.WarehouseInId.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ReturnOrderTypeId",
                                "Name": "ReturnOrderTypeIds",
                                "Value": scope.formChoseData.ReturnOrderTypeIds ? scope.formChoseData.ReturnOrderTypeIds.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TagName",
                                "Name": "TagName",
                                "Value": scope.formChoseData.TagName ? scope.formChoseData.TagName.name : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "InProduct",
                                "Name": "InProduct",
                                "Value": scope.formData.InProduct,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "OutProduct",
                                "Name": "OutProduct",
                                "Value": scope.formData.OutProduct,
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Note",
                                "Name": "Note",
                                "Value": scope.formData.Note,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "RefundWay",
                                "Name": "RefundWay",
                                "Value": scope.formChoseData.RefundWay ? scope.formChoseData.RefundWay.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 1,
                                "AllowEmpty": false,
                                "Children": [
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "ApproveUser",
                                        "Name": "ApproveUser",
                                        "Value": scope.formData.conductor,
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "CreateUserName",
                                        "Name": "CreateUserName",
                                        "Value": scope.formData.conductor,
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "AuditUser",
                                        "Name": "AuditUser",
                                        "Value": scope.formData.conductor,
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "ScanUser",
                                        "Name": "ScanUser",
                                        "Value": scope.formData.conductor,
                                        "Children": []
                                    }
                                ]
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsObsolete",
                                "Name": "IsObsolete",
                                "Value": scope.formData.IsObsolete,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsAbnormal",
                                "Name": "IsAbnormal",
                                "Value": scope.formData.IsAbnormal,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsReturn",
                                "Name": "IsReturn",
                                "Value": scope.formData.IsReturn,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsCreateNoticed",
                                "Name": "IsCreateNoticed",
                                "Value": scope.formData.IsCreateNoticed,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var ReturnOrder = ApiService.postLoad(url,paramObj);
                    ReturnOrder.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 退换货单生成通知单
                 * @param scope
                 * @param note 箱码
                 * @param ids 要生成通知单的列表信息
                 * @param callback
                 */
                createRequisition : function (scope,note,ids,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/CreateNotice';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.packageNo = note;
                    paramObj.body = JSON.stringify(ids);
                    var requisition = ApiService.postLoad(url,paramObj);
                    requisition.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 审核退换货单
                 * @param scope
                 * @param ids 要审核的订单的id
                 * @param callback
                 */
                auditReturnProduct : function (scope,ids,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/Audit';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 复核退换货单
                 * @param ids 要审核的订单的id
                 * @param callback
                 */
                reAuditReturnProduct : function (ids,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/ReCheck';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.outorder = true;
                    paramObj.refunorder = true;
                    paramObj.orderids = JSON.stringify(ids);
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 反审核
                 * @param ids 要反审核的订单的id
                 * @param callback
                 */
                returnAudit : function (ids,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/ReAudit';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 作废退换货单
                 * @param ids 要反审核的订单的id
                 * @param callback
                 */
                Cancellation : function (ids,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/Cancellation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加标记
                 * @param tag
                 * @param ids
                 * @param callback
                 */
                returnProductTag : function (tag,ids,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/AddTag';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    paramObj.tag = tag;
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加内部标签
                 * @param message 标签内容
                 * @param ids 要添加的标签的id
                 * @param callback
                 */
                addLabel : function (message,ids,callback){
                    var url = '/OrderMessage/BatchAddNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.ids = JSON.stringify(ids);
                    paramObj.message = message;
                    var returnProduct = ApiService.postLoad(url,paramObj);
                    returnProduct.then(function (res) {
                        callback(res);
                    });
                }



            };

            return {
                quitOrExchangeGoodsInterface : quitOrExchangeGoodsInterface,
                qOreGoodsDomOperate : qOreGoodsDomOperate,
                InterfaceDeal : InterfaceDeal
            }

        }
    ]);