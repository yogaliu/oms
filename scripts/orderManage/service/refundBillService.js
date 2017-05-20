/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('refoundBillService',['ApiService','toolsService','orderManagePublicService','APP_MENU',
        function (ApiService, toolsService,orderManagePublicService,APP_MENU) {

            //配置数据
            var configData = {
                //退货通知单列定义
                columns : [
                    {name : '退款单特殊标识',tag : 'tips'},
                    {name : '状态',tag : 'status',otherInfo:APP_MENU['refundOrderStatus']},
                    {name : '锁定人',tag : 'lockedusername'},
                    {name : '退款单号',tag : 'code'},
                    {name : '标记', tag : 'tag'},
                    {name : '退款金额', tag : 'actualamount'},
                    {name : '退款类型', tag : 'refundtype'},
                    {name : '退款方式', tag : 'refundway',otherInfo :APP_MENU['refundWay']},
                    {name : '内部标签', tag : 'messagestring'},
                    {name : '退货类型', tag : 'returntype'},
                    {name : '平台交易号', tag : 'tradeid'},
                    {name : '配货单号', tag : 'dispatchcode'},
                    {name : '店铺', tag : 'storename'},
                    {name : '会员昵称', tag : 'customername'},
                    {name : '会员编号', tag : 'customercode'},
                    {name : '制单人', tag : 'createusername'},
                    {name : '制单时间', tag : 'createdate'},
                    {name : '审核人', tag : 'approveuser'},
                    {name : '审核时间', tag : 'approvedate'},
                    {name : '复核人', tag : 'audituser'},
                    {name : '复核时间', tag : 'auditdate'},
                    {name : '快递名称', tag : 'expressname'},
                    {name : '快递单号', tag : 'expressno'}
                ]
            };

            //退款单dom处理
            var refoundBillDomOperate = {
                //数据初始化
                domInit : function (scope){
                    //退货信息的表头
                    scope.refondBillHead = configData.columns;
                    //复选框选中的退款单数据
                    scope.orderListHasChosed = [];
                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.refondBillHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };
                    //分页数据初始化
                    this.pageSet(scope);
                    //批量操作配置
                    this.pullSelect(scope);
                    //高级筛选条件初始化
                    this.searchCondition(scope);

                    //制单时间（开始）
                    this.timePicker ('CreateDateBegin');
                    //制单时间（结束）
                    this.timePicker ('CreateDateEnd');
                    //审核时间（开始）
                    this.timePicker ('ApproveDateBegin');
                    //审核时间（结束）
                    this.timePicker ('ApproveDateEnd');

                    //上一页初始化
                    scope.prev = function () {
                        orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                    };
                    //下一页初始化
                    scope.next = function () {
                        orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                    };
                    //高级搜索初始化
                    scope.advancedSearchObj1 = orderManagePublicService.orderManagerPublicFunction.advanceSearch(scope);
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);
                    //初始化退款单数据
                    refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                    //店铺信息
                    refoundBillInterfaceDeal.getAllShops(scope);
                },
                //高级搜索条件初始化
                searchCondition : function (scope) {
                    //高级搜索条件(输入)
                    scope.formData = {};
                    //高级搜索条件（选择）
                    scope.formChoseData = {};
                    //店铺信息
                    scope.storeList = {};
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                    });
                },
                //批量操作配置
                pullSelect : function (scope) {
                    //批量操作配置
                    scope.batchOperate = {
                        isshow:false,
                        info:[
                            {name:'锁定',tag : 'lockRefoundBillDeall',checkType : 'lockOrderCheck',errorMessage :'订单已被锁定，不可操作！'},
                            {name : '解锁' ,tag : 'unlockRefoundBillDeall',checkType : 'unlockOrderCheck',errorMessage : '订单未锁定，或被别人锁定！'},
                            {name : '审核' ,tag : 'auditOrderDeal',checkType : 'auditOrderCheck' ,errorMessage : '单据状态不正确，不可以审核！'},
                            {name : '复核' ,tag : 'reAuditOrderDeal',checkType : 'reAuditOrderCheck',errorMessage : '单据状态不正确，不可以复核!'},
                            {name : '反审' ,tag : 'cancleApprove',checkType : 'auditReturnCheck',errorMessage : '单据状态不正确，不可以反审!'},
                            {name : '作废' ,tag : 'obsoluteOrderDeal',checkType : 'obsoluteOrderCheck',errorMessage :'单据状态不正确，不可以作废！'},
                            {name : '标记' ,list:[
                                {name : '标记正品' ,tag : 'addTagDeal'},
                                {name : '标记次品' ,tag : 'addTagDeal'}
                            ]},
                            {name : '内部标签' ,tag : 'addLabelDeal'}
                        ],
                        objName:{name:'批量操作'},
                        onChange: function(obj,index){	//点击之后的回调
                            var ids = [];
                            //获取所有选中退换货单的id
                            for(var i = 0,j = scope.refondBillBody.length;i < j;i++){
                                if(scope.refondBillBody[i]['trShow']){
                                    ids.push(scope.refondBillBody[i]['id']);
                                    //检查当前订单是否可以进行操作
                                    if(obj.checkType && !scope.operateCheck[obj.checkType](scope.refondBillBody[i])){
                                        toolsService.alertMsg(obj.errorMessage);
                                        return false;
                                    }
                                }
                            }
                            if(ids.length < 1){
                                toolsService.alertMsg('请先选择订单!');
                            }else{
                                refoundBillInterfaceDeal[obj.tag](scope,ids,obj.name);
                            }
                        }
                    };
                },
                //日期控件
                timePicker : function (id){
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
                }
            };

            //退款单中所有接口请求处理
            var refoundBillInterfaceDeal = {
                //退款单数据初始化
                getRefoundBillDeal : function (scope) {
                    refoundBillInterface.getRefoundBill(scope, function (res) {
                        if(res.success){
                            //ng-repeat执行完后的回调
                            //scope.$on("conditionCallback",function(){
                            //    //$('#expressTable').fixedHeaderTable({
                            //    //    footer: false,
                            //    //    fixedColumns: 1,
                            //    //    destroy :true
                            //    //});
                            //});
                            //全选标志取消
                            scope.checkAll = false;
                            //重新设置分页的页数
                            scope.paginationConf.totalItems = res.total;
                            //退货信息的详细信息
                            scope.refondBillBody = res.data;
                        }
                    });
                },
                //锁定退款单
                lockRefoundBillDeall : function (scope,ids) {
                    refoundBillInterface.lockRefoundBill(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('锁定成功！');
                            //锁定成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //解锁退款单
                unlockRefoundBillDeall : function (scope,ids) {
                    refoundBillInterface.unlockRefoundBill(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('解锁成功！');
                            //解锁成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //审核退款单
                auditOrderDeal : function (scope,ids){
                    refoundBillInterface.auditOrder(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('审核成功！');
                            //审核成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //复核退款单
                reAuditOrderDeal : function (scope, ids) {
                    refoundBillInterface.reAuditOrder(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('复核成功！');
                            //复核成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //作废退款单
                obsoluteOrderDeal : function (scope,ids){
                    refoundBillInterface.obsoluteOrder(scope,ids.pop(), function (res) {
                        if(res.success){
                            toolsService.alertSuccess('作废成功！');
                            //作废成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //标记退款单
                addTagDeal : function (scope,ids,tag){
                    refoundBillInterface.addTag(scope,ids,tag, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('标记成功！');
                            //标记成功，重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //添加内部标签
                addLabelDeal : function (scope,ids,message) {
                    var idObj = {};
                    //将数据装换成{"id":id}这种数据格式
                    for(var i = 0,j = ids.length;i < j;i++){
                        idObj[ids[i]] = ids[i];
                    }
                    $('.info-get-modal').modal('show');
                    //模态框配置
                    scope.modal = {
                        title : '请输入内容',
                        //模态框确认事件
                        confirm : function (content) {
                            refoundBillInterface.addLabel(scope,idObj,content, function (res) {
                                if(res.success){
                                    toolsService.alertSuccess('添加成功！');
                                    //添加内部标签成功，重新加载数据
                                    refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                                }else{
                                    toolsService.alertError(res.errorMessage);
                                }
                                scope.content = '';
                            });
                            $('.info-get-modal').modal('hide');
                        }
                    };
                },
                //获取店铺信息
                getAllShops : function (scope){
                    refoundBillInterface.getAllShops(scope, function (res) {
                        if(res.success){
                            //将店铺信息归类
                            toolsService.setDataShowType(scope,res.data,scope.storeList,5);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //反审
                cancleApprove : function (scope,ids) {
                    refoundBillInterface.cancleApprove(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('反审成功！');
                            //重新加载数据
                            refoundBillInterfaceDeal.getRefoundBillDeal(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                }
            };

            //退款单中所有接口请求
            var refoundBillInterface = {

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
                /**
                 * 获取退货单信息
                 * @param scope
                 * @param callback 回调函数
                 */
                getRefoundBill : function (scope,callback) {
                    var url = '/SalesOrder/Refund/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CustomerName",
                                "Name": "CustomerName",
                                "Value": scope.formData.CustomerName,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Mobile",
                                "Name": "Mobile",
                                "Value": scope.formData.Mobile,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ApproveUser",
                                "Name": "ApproveUser",
                                "Value": scope.formData.ApproveUser,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "AuditUser",
                                "Name": "AuditUser",
                                "Value": scope.formData.AuditUser,
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "LockedUserName",
                                "Name": "LockedUserName",
                                "Value": scope.formData.LockedUserName,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SalesOrderCode",
                                "Name": "SalesOrderCode",
                                "Value": scope.formData.SalesOrderCode,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDateBegin",
                                "Value": scope.formData.CreateDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDateEnd",
                                "Value": scope.formData.CreateDateEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ApproveDate",
                                "Name": "ApproveDateBegin",
                                "Value": scope.formData.ApproveDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ApproveDate",
                                "Name": "ApproveDateEnd",
                                "Value": scope.formData.ApproveDateEnd,
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
                                "OperateType": 6,
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
                                "Field": "RefundType",
                                "Name": "RefundType",
                                "Value": scope.formChoseData.RefundType ? scope.formChoseData.RefundType.name : undefined,
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
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsLocked",
                                "Name": "IsLocked",
                                "Value": scope.formData.IsLocked,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Children": [
                                    {
                                        "OperateType": 8,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "CustomerName",
                                        "Name": "CustomerName",
                                        "Value": scope.formData.cusTomer,
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 1,
                                        "AllowEmpty": false,
                                        "Field": "Mobile",
                                        "Name": "Mobile",
                                        "Value": scope.formData.cusTomer,
                                        "Children": []
                                    }
                                ]
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var refoundList = ApiService.postLoad(url,paramObj);
                    refoundList.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 锁定退款单
                 * @param scope
                 * @param ids 要锁定的退款id号
                 * @param callback
                 */
                lockRefoundBill : function (scope,ids,callback){
                    var url = '/SalesOrder/Refund/Lock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 解锁退款单
                 * @param scope
                 * @param ids 要解锁的退款id号
                 * @param callback
                 */
                unlockRefoundBill : function(scope,ids,callback){
                    var url = '/SalesOrder/Refund/UnLock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 审核退款单
                 * @param scope
                 * @param ids 要审核的退款单的id
                 * @param callback
                 */
                auditOrder : function(scope,ids,callback){
                    var url = '/SalesOrder/Refund/Approve';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 复核退款单
                 * @param scope
                 * @param ids 要复核的退款单的id
                 * @param callback
                 */
                reAuditOrder : function(scope,ids,callback){
                    var url = '/SalesOrder/Refund/Audit';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 作废退款单
                 * @param scope
                 * @param ids 要作废的退款单的id
                 * @param callback
                 */
                obsoluteOrder : function (scope,ids,callback){
                    var url = '/SalesOrder/Refund/Obsolete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 标记退款单
                 * @param scope
                 * @param ids 要标记的退款单的id
                 * @param tag 要标记的内容
                 * @param callback
                 */
                addTag : function (scope,ids,tag,callback){
                    var url = '/SalesOrder/Refund/AddTag';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    paramObj.tag = tag;
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加内部标签
                 * @param scope
                 * @param ids 要添加内部标签的退款单的id
                 * @param message 要添加内部标签的内容
                 * @param callback
                 */
                addLabel : function (scope,ids,message,callback){
                    var url = '/OrderMessage/BatchAddNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.ids = JSON.stringify(ids);
                    paramObj.message = message;
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 反审订单
                 * @param scope
                 * @param ids 订单id
                 * @param callback
                 */
                cancleApprove : function (scope,ids,callback) {
                    var url = '/SalesOrder/Refund/CancelApprove';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                }

            };

            return {
                refoundBillInterfaceDeal : refoundBillInterfaceDeal,
                refoundBillDomOperate : refoundBillDomOperate
            }

        }
    ]);