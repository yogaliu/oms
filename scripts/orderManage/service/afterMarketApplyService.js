/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('afterMarketApplyService',['ApiService','toolsService','orderManagePublicService','APP_MENU',
        function(ApiService,toolsService,orderManagePublicService,APP_MENU){
            //配置数据
            var configData = {
                //异常订单列定义
                columns : [
                    {name : '售后特殊标识',tag : 'tips'},
                    {name : '退款单号',tag : 'refundcode'},
                    {name : '店铺名称',tag : 'storename'},
                    {name : '订单标记',tag : 'tagname'},
                    {name : '会员昵称', tag : 'buyernick'},
                    {name : '平台订单号', tag : 'tradeid'},
                    {name : '需要退货', tag : 'hasgoodreturn',otherInfo : {0:'否',1:'是'}},
                    {name : '退款类型', tag : 'refundtype',otherInfo : APP_MENU['refundType']},
                    {name : '订单状态', tag : 'tradestatus',otherInfo : APP_MENU['platformState']},
                    {name : '货物状态', tag : 'goodstatus',otherInfo : APP_MENU['refundGoodsStatus']},
                    {name : '退款状态', tag : 'status',otherInfo : APP_MENU['refundStatus']},
                    {name : '退款版本', tag : 'refundversion'},
                    {name : '退款时间', tag : 'created'},
                    {name : '修改时间', tag : 'lastdate'},
                    {name : '退款申请金额', tag : 'refundfee'},
                    {name : '退款申请原因', tag : 'reason'},
                    {name : '退款说明', tag : 'descname'},
                    {name : '标题', tag : 'title'},
                    {name : '购买商品数量', tag : 'quantity'},
                    {name : '物流公司', tag : 'expressname'},
                    {name : '商品编码', tag : 'productcode'},
                    {name : '商品名称', tag : 'productname'},
                    {name : '规格编码', tag : 'skucode'}
                ]
            };

            //dom操作
            var afterMarketApplyDomOperate = {
                domInit : function (scope) {
                    //下拉框初始化
                    $('#afterMarketApply').selectPlug();
                    //初始化分页
                    this.pageSet(scope);
                    //高级搜索初始化
                    scope.advancedSearchObj1 = orderManagePublicService.orderManagerPublicFunction.advanceSearch(scope);
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);

                    //复选框默认不勾选
                    scope.labelSel = false;

                    //获取售后申请的列设置
                    scope.afterHead = configData.columns;

                    //复选框勾选与取消勾选
                    scope.isLabelSel = function (myEvent) {
                        toolsService.isLabelSel(scope, myEvent);
                    };

                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.afterHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };

                    //高级搜索筛选条件（单选）
                    scope.formChoseData = {};
                    //高级搜索筛选条件（填写）
                    scope.formData = {};

                    //高级搜索条件
                    scope.storeList = {};
                    scope.TradeStatus = {};
                    scope.Status = {};

                    //初始化批量操作配置
                    this.batchOperateConfig(scope);

                    //退款时间（开始）
                    this.timePicker('SearchBegin');
                    //退款时间（结束）
                    this.timePicker('SearchEnd');
                    //修改时间（开始）
                    this.timePicker('SearchLastBegin');
                    //修改时间（结束）
                    this.timePicker('SearchLastEnd');

                    //初始化售后列表
                    afterMarketInterface.getAllAfterMarketApplications(scope);
                    //获取店铺信息
                    afterMarketInterface.getAllShops(scope);
                },
                //日期控件
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
                //分页配置
                pageSet : function (scope){
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope,function(){
                        afterMarketInterface.getAllAfterMarketApplications(scope);
                    });
                },
                //批量操作配置
                batchOperateConfig : function (scope) {
                    /*下拉菜单*/
                    scope.batchOperate ={
                        isshow:false,
                        info:[
                            {name:'标记',list:[
                                {name:'正品退货',tag:'standardReturnedGoods'},
                                {name:'次品退货',tag:'imperfectionReturnedGoods'}
                            ]}
                        ],
                        name:'批量操作',
                        onChange: function(obj,index){	//点击之后的回调
                            var ids = [];
                            //获取已选中的订单的id
                            for(var i = 0,j = scope.afterMarketBody.length;i < j;i++){
                                if(scope.afterMarketBody[i].trShow){
                                    ids.push(scope.afterMarketBody[i].id);
                                }
                            }
                            //判断是否已经选中订单
                            if(ids.length < 1){
                                toolsService.alertMsg('请先选择订单！');
                            }else{
                                afterMarketInterface.afterMarkAddLabel(scope,obj.name,ids);
                            }
                        }
                    }
                }
            };

            //售后申请接口处理
            var afterMarketInterface = {
                /**
                 * 获取所有售后申请
                 * @param scope
                 * @param callback 回调函数
                 */
                getAllAfterMarketApplications : function (scope,callback) {
                    Interface.getAllAfterMarketApplications(scope, function (res) {
                        if(res.success){
                            //清空全选
                            scope.checkAll = false;
                            //获取售后申请的详细数据
                            scope.afterMarketBody = res.data;
                            //设置总页数
                            scope.paginationConf.totalItems =res.total;
                            scope.$on("conditionCallback",function(){
                                $('#afterMarketTable').DataTable( {
                                    scrollY: 400,
                                    scrollX:true,
                                    paging: false,
                                    searching: false,
                                    info : false,
                                    destroy: true
                                } );
                            });
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },

                /**
                 * 添加标识
                 * @param scope
                 * @param name 标识名
                 * @param ids 要添加订单的id
                 */
                afterMarkAddLabel : function (scope,name,ids) {
                    Interface.afterMarkAddLabel(scope,name,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('添加成功！');
                            //刷新界面
                            afterMarketInterface.getAllAfterMarketApplications(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //获取店铺信息
                getAllShops : function (scope){
                    Interface.getAllShops(scope,function (res) {
                        if(res.success){
                            //将后台返回的数据存储到storeList对象中
                            toolsService.setDataShowType(scope,res.data,scope.storeList,5);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                }
            };

            //接口数据
            var Interface = {

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
                 * 获取所有售后申请
                 * @param scope
                 * @param callback 回调函数
                 */
                getAllAfterMarketApplications : function (scope,callback) {
                    var url = '/SalesOrder/ApplyRefundOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 2,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Created",
                                "Name": "SearchBegin",
                                "Value": scope.formData.SearchBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 4,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Created",
                                "Name": "SearchEnd",
                                "Value": scope.formData.SearchEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 2,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "LastDate",
                                "Name": "SearchLastBegin",
                                "Value": scope.formData.SearchLastBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 4,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "LastDate",
                                "Name": "SearchLastEnd",
                                "Value": scope.formData.SearchLastEnd,
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
                                "Field": "TradeStatus",
                                "Name": "TradeStatus",
                                "Value": scope.formChoseData.TradeStatus ? scope.formChoseData.TradeStatus.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "RefundType",
                                "Name": "RefundType",
                                "Value": scope.formChoseData.RefundType ? scope.formChoseData.RefundType.value : undefined,
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
                                "Field": "TagName",
                                "Name": "TagName",
                                "Value": scope.formChoseData.TagName ? scope.formChoseData.TagName.name : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "RefundCode",
                                "Name": "RefundCode",
                                "Value": scope.formData.RefundCode,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TradeId",
                                "Name": "TradeId",
                                "Value": scope.formData.TradeId,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ExpressNumber",
                                "Name": "ExpressNumber",
                                "Value": scope.formData.ExpressNumber,
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
                                "Field": "IsRefund",
                                "Name": "IsRefund",
                                "Value": scope.formData.IsRefund,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "BuyerNick",
                                "Name": "BuyerNick",
                                "Value": scope.formData.BuyerNick,
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
                                "Field": "RefundCode",
                                "Name": "RefundCode",
                                "Value": scope.formData.RefundCode,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var applications = ApiService.postLoad(url,paramObj);
                    applications.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加标记
                 * @param scope
                 * @param labelName 标记名称
                 * @param ids 订单id
                 * @param callback
                 */
                afterMarkAddLabel : function (scope,labelName,ids,callback) {
                    var url = '/SalesOrder/ApplyRefundOrder/AddTag';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['tagname'] = labelName;
                    paramObj['orderids'] = JSON.stringify(ids);
                    var label = ApiService.postLoad(url,paramObj);
                    label.then(function (res) {
                        callback(res);
                    });
                }
            };


            return  {
                afterMarketInterface : afterMarketInterface,
                afterMarketApplyDomOperate : afterMarketApplyDomOperate
            }
        }
    ]);