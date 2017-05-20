/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('allocationNoticeBillService',['ApiService','toolsService','orderManagePublicService','APP_MENU','validateService',
        function (ApiService,toolsService,orderManagePublicService,APP_MENU,validateService) {

            //配置数据
            var configData = {
                //配货通知单列定义
                columns : [
                    {name : '订单特殊表示',tag : 'tips'},
                    {name : '配货单号',tag : 'code'},
                    {name : '配货时间',tag : 'pushdate'},
                    {name : '状态',tag : 'status',otherInfo : APP_MENU['preDistributionState']},
                    {name : '店铺名称',tag : 'storename'},
                    {name : '会员昵称' ,tag : 'membername'},
                    {name : '收货人' , tag : 'consignee'},
                    {name : '手机号码' ,tag : 'mobile'},
                    {name : '仓库名称' ,tag : 'warehousename'},
                    {name : '电话' ,tag : 'telephone'},
                    {name : '邮编' ,tag : 'zip'},
                    {name : '地址' ,tag : 'address'},
                    {name : '国家',tag : 'countryname'},
                    {name : '省',tag :'province'},
                    {name : '市',tag : 'city'},
                    {name : '区',tag : 'county'},
                    {name : '建议快递名称',tag : 'suggestexpressname'},
                    {name : '建议快递单号',tag : 'suggestexpressno'},
                    {name :'实际快递名称',tag : 'actualexpressname'},
                    {name : '快递单号',tag : 'actualexpressno'},
                    {name : '体积' ,tag : 'volume'},
                    {name : '重量',tag : 'weight'},
                    {name : '支付金额',tag : 'actualpay'},
                    {name : '应付金额' ,tag : 'receivableamounts'},
                    {name : '支付日期',tag : 'paytime'},
                    {name : '发货日期',tag : 'pushdate'}
                ]
            };

            //dom操作
            var noticeBillDomOperate = {
                domInit : function (scope) {
                    //表单初始化验证
                    validateService.initValidate('#addOrder');
                    //下拉框初始化
                    $('#allocationNoticeBill').selectPlug();
                    //配货通知单列配置
                    scope.invoiceListThead = configData.columns;

                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.invoiceListThead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };
                    //手工发货信息
                    scope.manual = {};
                    //已经选中的订单
                    scope.orderListHasChosed = [];
                    //选中订单的各个字段的合法性
                    scope.orderListValidity = {};

                    //配货日期（开始）
                    this.timePicker('CreateDateBegin');
                    //配货日期（结束）
                    this.timePicker('CreateDateEnd');
                    //发货日期（开始）
                    this.timePicker('DeliveryDateBegin');
                    //发货日期（结束）
                    this.timePicker('DeliveryDateEnd');

                    //高级搜索条件初始化
                    //scope.orderStatus = {};
                    scope.storeList = {};
                    scope.wareHouseList = {};

                    //下拉菜单配置
                    this.pullSelect(scope);

                    //高级搜索条件 (输入)
                    scope.formData = {};
                    //高级搜索条件 (选择)
                    scope.formChoseData = {};

                    scope.timeText = '展开';

                    //分页配置
                    this.pageSet(scope);
                    //上一页初始化
                    scope.prev = function () {
                        orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                    };
                    //下一页初始化
                    scope.next = function () {
                        orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                    };

                    //获取配货通知单信息
                    InterfaceDeal.getRequisition(scope);
                    //店铺信息
                    InterfaceDeal.getAllShops(scope);
                    //仓库信息
                    InterfaceDeal.getAllWareHouse(scope);
                    //快递信息
                    InterfaceDeal.getAllExpressInfo(scope);
                },
                //分页配置
                pageSet : function (scope){
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope,function(){
                        InterfaceDeal.getRequisition(scope);
                    });
                },
                //下拉框配置
                pullSelect : function (scope) {
                    //下拉菜单信息配置
                    scope.menuInfo = {
                        //批量操作
                        batch : {
                            isshow:false,
                            info:[
                                {name:'取消配货',tag : 'batchCancle'}
                            ],
                            name:'批量操作',
                            onChange: function(obj,index){	//点击之后的回调
                                var list = [];
                                //获取已选中的订单
                                for(var i = 0,j = scope.invoiceListTbody.length;i < j;i++){
                                    if(scope.invoiceListTbody[i].trShow){
                                        list.push(scope.invoiceListTbody[i]);

                                        //判断是否符合取消配货的标准(只有已生成或已通知状态的配货通知单才能取消！)
                                        if(scope.invoiceListTbody[i].status != 0 && scope.invoiceListTbody[i].status != 2){
                                            toolsService.alertError('只有已生成或已通知状态的配货通知单才能取消！');
                                            return false;
                                        }

                                    }
                                }
                                if(list.length < 1){
                                    toolsService.alertMsg('请先选择订单');
                                    return false;
                                }else{
                                    //模态框配置
                                    scope.modal = {
                                        title : '请输入取消原因',
                                        confirm : function (content) {
                                            $('.info-get-modal').modal('hide');
                                            InterfaceDeal.orderBatchCancel(scope,list,content);
                                            scope.content = '';
                                        }
                                    };
                                    $('.info-get-modal').modal('show');
                                }
                            }
                        }
                    };
                    //快递选择
                    scope.expressPull = {
                        isshow:false,
                        info:[],
                        validate:true,
                        onChange: function(obj,index){	//点击之后的回调
                            scope.manual.expressid = obj.id;
                        }
                    };
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
                }
            };

            //操作方法
            var noticeBillFunction = {
                //重置订单的是否合法的状态
                resetCheckLegal : function (obj) {
                    for(var item in obj){
                        obj[item] = false;
                    }
                },
                //判断数据是否合法
                checkOrderListValidity : function (scope,obj,label) {
                    this.resetCheckLegal(label);
                    for(var i = 0,j = obj.length;i < j;i++){
                        //是否可以取消配货
                        label['notAllowBatchCancle'] = label['notAllowBatchCancle'] || (obj[i]['status'] != 0 && obj[i]['status'] != 2);
                    }
                },
                //取消配货
                batchCancle : function (scope,obj,type){
                    if(type['notAllowBatchCancle']){
                        toolsService.alertMsg('该状态不可取消配货');
                        return false;
                    }
                    //订单的id
                    var ids = this.getOrderId(obj,'id');
                    //取消配货接口调用
                    orderManagePublicService.orderManagerPublicInterface.orderBatchCancel(scope,ids,function(){
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['status'] = 3;
                        }
                    });
                },
                //获取订单id
                getOrderId : function (obj,type){
                    var ids = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        ids.push(obj[i][type]);
                    }
                    return ids;
                }
            };

            //接口数据处理
            var InterfaceDeal = {
                //获取配货通知单数据
                getRequisition : function (scope) {
                    Interface.getRequisition(scope, function (res) {
                        if(res.success){
                            //全选状态取消
                            scope.checkAll = false;
                            scope.invoiceListTbody = res.data;
                            //重新设置分页的页数
                            scope.paginationConf.totalItems = res.total;
                            scope.$on("conditionCallback",function(){
                                $('#invoicesList').DataTable( {
                                    scrollY: 440,
                                    scrollX:true,
                                    paging: false,
                                    searching: false,
                                    info : false,
                                    destory : true
                                } );
                            });
                        }else{
                            toolsService.alertMsg('获取配货通知单数据失败');
                        }
                    })
                },
                //店铺信息
                getAllShops : function (scope){
                    Interface.getAllShops(scope, function (res) {
                        if(res.success){
                            //店铺数据分类
                            toolsService.setDataShowType(scope,res.data,scope.storeList,5);
                        }else{
                            toolsService.alertMsg('获取店铺数据失败！');
                        }
                    })
                },
                //仓库信息
                getAllWareHouse : function (scope) {
                    Interface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            //仓库数据分类
                            toolsService.setDataShowType(scope,res.data,scope.wareHouseList,5);
                        }else{
                            toolsService.alertMsg('获取仓库数据失败！');
                        }
                    })
                },
                //取消配货
                orderBatchCancel : function (scope,list,reason) {
                    var ids = noticeBillFunction.getOrderId(list,'id');
                    Interface.orderBatchCancel(scope,ids,reason, function (res) {
                        if(res.success){
                            //刷新页面
                            InterfaceDeal.getRequisition(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    })
                },
                //重新推送
                updataOrderStatus : function (scope) {
                    Interface.updataOrderStatus(scope, function (res) {
                        if(res.success){
                            //刷新页面
                            InterfaceDeal.getRequisition(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    })
                },
                //获取所有快递信息
                getAllExpressInfo : function (scope) {
                    Interface.getAllExpressInfo(scope, function (res) {
                        if(res.success){
                            //刷新页面
                            scope.expressPull.info = res.data;
                            scope.expressListInfo = klwTool.arrayToJson(res.data,'id');
                            InterfaceDeal.getRequisition(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    })
                },
                //获取配货通知单商品详情
                getProductDetails : function (scope,id,code,warehousecode){
                    Interface.getProductDetails(scope,id, function (res) {
                        if(res.success){
                            var details = [];
                            var warehouseexpresscode = scope.expressListInfo[scope.manual.expressid].warehouseexpresscode;
                            for(var i = 0,j = res.data.length;i < j;i++){
                                details.push({
                                    "Id": "00000000-0000-0000-0000-000000000000",
                                    "DeliveryCompletedId": "00000000-0000-0000-0000-000000000000",
                                    "CreateDate": "0001-01-01 00:00:00",
                                    "Ordeno": res.data[i].dispatchordercode,
                                    "Sku": res.data[i].productskucode,
                                    "Qty": res.data[i].quantity,
                                    "LineStatus": 3,
                                    "Deleted": false,
                                    "IsNew": false,
                                    "IsUpdate": false
                                });
                            }
                            InterfaceDeal.manualDelivery(scope,code,warehousecode,details,id,warehouseexpresscode);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    })
                },
                //手工配货
                manualDelivery : function (scope,code,warehousecode,details,id,warehouseexpresscode) {
                    Interface.manualDelivery(scope,scope.manual.expressno,code,scope.manual.weight,warehousecode,details,id,warehouseexpresscode, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('保存成功！');
                            //刷新页面
                            InterfaceDeal.getRequisition(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                        //模态框隐藏
                        $('.manual-delal-modal').modal('hide');
                        //重置输入框内容
                        scope.content = '';
                    })
                }
            };

            //配货通知单接口
            var Interface = {
                /**
                 * 获取所有快递信息
                 * @param scope $scope对象
                 * @param callback 获取后台信息后的回调函数
                 */
                getAllExpressInfo : function (scope,callback) {
                    var url = '/BasicInformation/Express/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = [];
                    var express = ApiService.postCache(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 重新推送
                 * @param scope
                 * @param callback
                 */
                updataOrderStatus : function (scope,callback) {
                    var url = '/SalesOrder/Dispatch/UpdateDispatchOrderStatus';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([]);
                    var orderStatus = ApiService.postLoad(url,paramObj);
                    orderStatus.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 取消配货
                 * @param scope
                 * @param ids 订单id
                 * @param reson 取消原因
                 * @param callback
                 */
                orderBatchCancel : function (scope,ids,reson,callback) {
                    var url = '/SalesOrder/Dispatch/BatchCancel';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.dispatchOrderIds = JSON.stringify(ids);
                    paramObj.reson = reson;
                    var batchCancel = ApiService.postLoad(url,paramObj);
                    batchCancel.then(function (res) {
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
                 * 获取配货通知单信息
                 * @param scope
                 * @param callback 数据获取后的回调函数
                 */
                getRequisition : function (scope,callback) {
                    var url = '/SalesOrder/Dispatch/Get';
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
                                "Field": "SalesOrderCode",
                                "Name": "SalesOrderCode",
                                "Value": scope.orderCode,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsWMSCannel",
                                "Name": "IsWMSCannel",
                                "Value": scope.formData.IsWMSCannel,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsMerger",
                                "Name": "IsMerger",
                                "Value": scope.formData.IsMerger,
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
                                "Field": "DeliveryDate",
                                "Name": "DeliveryDateBegin",
                                "Value": scope.formData.DeliveryDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DeliveryDate",
                                "Name": "DeliveryDateEnd",
                                "Value": scope.formData.DeliveryDateEnd,
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
                                "Field": "DetailStatus",
                                "Name": "DetailStatus",
                                "Value": scope.formChoseData.DetailStatus ? scope.formChoseData.DetailStatus.value : undefined,
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
                                "Field": "WarehouseId",
                                "Name": "WarehouseId",
                                "Value": scope.formChoseData.WarehouseId ? scope.formChoseData.WarehouseId.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ProductCode",
                                "Name": "ProductCode",
                                "Value": scope.formData.ProductCode,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var requisition = ApiService.postLoad(url,paramObj);
                    requisition.then(function (res) {
                        callback(res);
                    });

                },
                //导出配货通知单
                orderListExport : function(scope){
                    orderManagePublicService.orderManagerPublicInterface.orderListExport();
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

                /**
                 * 获取配货通知单详细信息
                 * @param scope
                 * @param id 配货通知单id
                 * @param callback
                 */
                getProductDetails : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/GetDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"DispatchOrderId",
                        "Name":"DispatchOrderId",
                        "Value":id,
                        "Children":[]
                    }]);
                    var details = ApiService.post(url,paramObj);
                    details.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 手工发货
                 * @param scope
                 * @param exprno 快递编号
                 * @param orderId 订单id
                 * @param weight 快递重量
                 * @param warehousecode 仓库编码
                 * @param details 订单明细
                 * @param id 配货通知单id
                 * @param warehouseexpresscode 仓库编码
                 * @param callback
                 */
                manualDelivery : function (scope,exprno,orderId,weight,warehousecode,details,id,warehouseexpresscode,callback) {
                    var url = '/SalesOrder/Dispatch/ManualDelivery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "Exprno": exprno,
                        "Id": "00000000-0000-0000-0000-000000000000",
                        "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                        "Ordeno": orderId,
                        "Whcode": warehousecode,
                        "Cacode": warehouseexpresscode,
                        "Weight": weight,
                        "DeliveryDate": new Date().format('yyyy-MM-dd H:m:s'),
                        "Invoice": false,
                        "Status": 3,
                        "DispatchOrderId": id,
                        "Details": details,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var shopList = ApiService.post(url,paramObj);
                    shopList.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                InterfaceDeal : InterfaceDeal,
                noticeBillDomOperate : noticeBillDomOperate,
                noticeBillFunction : noticeBillFunction
            }

    }]);