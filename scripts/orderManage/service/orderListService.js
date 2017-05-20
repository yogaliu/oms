/**
 * Created by zgh on 2017/4/6.
 */

angular.module('klwkOmsApp')
    .service('orderListService',['ApiService','toolsService','$state','orderManagePublicService' ,
        function (ApiService,toolsService,$state,orderManagePublicService) {

            //配置数据
            var configData = {
                //订单列表列操作
                columns : [
                    {name: "订单特殊标识", tag: 'tips'},
                    {name: "锁定人", tag: 'lockedusername'},
                    {name: "订单编号", tag: 'code'},
                    {name: "平台订单号", tag: 'tradeid'},
                    {name: "状态", tag: 'status','otherInfo':{0:'新建',10:'审核异常',11:'审核通过',20:'自动配货中',21:'自动配货异常',22:'已配货',30:'发货异常',31:'已部分发货',32:'已全部发货'}},
                    {name: "平台状态", tag: 'platformstatus','otherInfo':{0:'待审核',1:'待付预付款',2:'待发货',3:'拒单',4:'部分出库',5:'全部出库'}},
                    {name: "付款状态", tag: 'paystatus','otherInfo':{0:'未付款',2:'已付款'}},
                    {name: "预售类型", tag: 'presaletype','otherInfo':{0 : '非预售',1:'部分预售',2:'全部预售'}},
                    {name: "预售日期", tag: 'preshipmentdate'},
                    {name: "留单日期", tag: 'customershipdate'},
                    {name: "配货状态", tag: 'dispatchtypestatus', 'otherInfo' : {0:'未配货',1:'部分配货',2:'全部配货'}},
                    {name: "发货状态", tag: 'deliverytypestatus','otherInfo':{0:'未发货',1:'部分发货',2:'全部发货',3:'发货异常'}},
                    {name: "退款状态", tag: 'refundstatus','otherInfo':{0:'未定义',1:'部分退款',2:'全部退款'}},
                    {name: "内部标签", tag: 'messagestring'},
                    {name: "收货人", tag: 'consignee'},
                    {name: "省", tag: 'provincename'},
                    {name: "市", tag: 'cityname'},
                    {name: "区", tag: 'countyname'},
                    {name: "收货地址", tag: 'address'},
                    {name: "电话", tag: 'telphone'},
                    {name: "手机号码", tag: 'mobile'},
                    {name: "买家备注", tag: 'buyermemo'},
                    {name: "卖家备注", tag: 'sellermemo'},
                    {name: "订单标记", tag: 'tagname'},
                    {name: "分销订单号", tag: 'distributiontradeid'},
                    {name: "支付日期", tag: 'paydate'},
                    {name: "制单日期", tag: 'createdate'},
                    {name: "交易日期", tag: 'platfromdate'},
                    {name: "发货时间", tag: 'deliverydate'},
                    {name: "订单类型", tag: 'transtype',otherInfo:{ 1:'退货订单' ,2:'费用订单', 4:'换货订单', 5:'补发订单', 6:'补发票订单'}},
                    {name: "订单来源", tag: 'sourcetype',otherInfo:{0:'PC',1:'手机'}},
                    {name: "会员昵称", tag: 'customername'},
                    {name: "店铺名称", tag: 'storename'},
                    {name: "制单人", tag: 'createusername'},
                    {name: "推荐快递", tag: 'suggestexpressname'},
                    {name: "推荐仓库", tag: 'suggestwarehousename'},
                    {name: "发货快递", tag: 'expressname'},
                    {name: "发货仓库", tag: 'warehousename'},
                    {name: "快递单号", tag: 'expressnumber'},
                    {name: "商品总数量", tag: 'quantity'},
                    {name: "支付金额", tag: 'payamount'},
                    {name: "补差价金额", tag: 'addprice'},
                    {name: "补发原因", tag: 'addpricename'},
                    {name: "邮费", tag: 'expressfee'},
                    {name: "货到付款编号", tag: 'codno'},
                    {name: "个性化包裹说明", tag: 'bagdescriprion'},
                    {name: "已开电子发票", tag: 'hasinvoice'}
                ],
                //规格选择列信息
                productColumn : [
                    {name : '操作',tag : ''},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '市场价',tag : 'firstprice'},
                    {name : '重量',tag : 'weight'},
                    {name : '备注',tag : 'note'}
                ],
                //规格详细信息
                productDetailsColumn : [
                    {name : '仓库名称',tag :'warehouseid'},
                    {name : '库存数',tag :'quantity'},
                    {name : '可用数',tag :'canUseQuantity'},
                    {name : '可销数',tag :'canSaleQuantity'}
                ],
                //套装列配置
                suitColumn : [
                    {name : '',tag : ''},
                    {name : '不可拆分',tag : 'issplit'},
                    {name : '套装代码',tag : 'code'},
                    {name : '套装名称',tag : 'description'},
                    //{name : '套装分类',tag : ''},
                    {name : '套装规格',tag : 'productsize'},
                    {name : '礼盒',tag : 'isgift'},
                    {name : '重量',tag : 'weight'},
                    {name : '销售价',tag : 'wholesaleprice'},
                    {name : '备注',tag : 'note'}
                ]
            };

            //dom操作方法集合
            var orderListDomOperate = {
                domInit : function (scope) {
                    //下拉框初始化
                    $('#orderList').selectPlug();

                    //主列表分页设置
                    this.pageSet(scope);
                    //商品信息分页设置
                    scope.productPage = {};
                    this.productPageSet(scope.productPage,scope);

                    //当前订单属于哪一类(全部订单、未处理订单)
                    scope.orderSetting = '';

                    //套装信息分页设置
                    scope.suitPage = {};
                    this.suitPageSet(scope.suitPage,scope);

                    scope.orderListCollect = {
                        //高级搜索数据集合
                        searchHformData : {},
                        //高级搜索筛选条件集合
                        searchConditions : {},
                        //订单状态
                        orderStatus : {},
                        //店铺列表
                        storeList : {},
                        //平台列表
                        platformList : {},
                        //推荐仓库
                        commendWareHouse : {},
                        //推荐快递
                        commendExpress : {},
                        //订单标记
                        orderSign : {}
                    };

                    //订单列表列信息配置
                    scope.orderListThead = configData.columns;

                    //要添加赠品的订单
                    scope.orderAddGift = [];

                    //商品列表列配置
                    scope.productColumn = configData.productColumn;
                    //商品详细信息列表配置
                    scope.productDetailsColumn = configData.productDetailsColumn;
                    //已选中的套装信息
                    scope.suitChose = [];
                    //选中订单的各个字段的合法性
                    scope.orderListValidity = {};
                    //商品信息筛选条件
                    scope.productSearch = {};
                    //选中的商品信息
                    scope.productChosed = [];
                    //区分赠品是否为叠加的
                    scope.isGiftOver = false;
                    //区分套装是不是叠加的
                    scope.isSuitOver = false;
                    //套装信息的筛选条件
                    scope.suit = {};
                    //套装明细信息
                    scope.suitDetails = [];
                    //商品列表按钮配置
                    scope.giftConfig = {};

                    //高级搜索条件
                    scope.formChoseData = {};
                    //高级搜索条件(选择)
                    scope.formData1 = {};
                    //高级搜索条件(填写)
                    scope.formData = {};

                    //套装分类列配置信息
                    scope.suitColumn = configData.suitColumn;
                    //商品详细信息
                    scope.productDetails = [];

                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.orderListThead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };

                    //留单时间
                    this.timePicker('time-select');
                    //制单时间(开始）
                    this.timePicker('create-order-time-start');
                    //制单时间(结束）
                    this.timePicker('create-order-time-end');
                    //发货时间（开始）
                    this.timePicker('deliver-time-start');
                    //发货时间（结束）
                    this.timePicker('deliver-time-end');
                    //审核时间（开始）
                    this.timePicker('audit-time-start');
                    //审核时间（结束）
                    this.timePicker('audit-time-end');
                    //支付时间（开始）
                    this.timePicker('pay-time-start');
                    //支付时间（结束）
                    this.timePicker('pay-time-end');
                    //预计发货日期（开始）
                    this.timePicker('pre-delivery-time-start');
                    //预计发货日期（结束）
                    this.timePicker('pre-delivery-time-end');

                    //下拉菜单配置信息
                    this.pullSelectConfig(scope);


                    //订单列表设置
                    OrderListInterface.getOrderList(scope);
                    //店铺信息设置
                    OrderListInterface.getAllShops(scope);
                    //平台信息设置
                    OrderListInterface.getPlantformType(scope);
                    //仓库信息设置
                    OrderListInterface.getAllWareHouse(scope);
                    //快递信息设置
                    OrderListInterface.getAllExpressInfo(scope);
                    //订单标记信息设置
                    OrderListInterface.getAllOrderMarks(scope);
                    //获取订单标记
                    OrderListInterface.getOrderLabel(scope);
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
                //批量操作
                pullSelectConfig : function (scope) {
                    //下拉框信息配置
                    scope.selectConfig = {
                        //批量操作配置
                        batchOperate : {
                            isshow:false,
                            info:[
                                {name:'批量锁定操作',list:[
                                    {name :'锁定',tag:'lockOrder',verify : 'lockCondition',errorMessage:'存在其他人锁定的订单，不可批量操作！'},
                                    {name :'解锁',tag:'unLockOrder',verify : 'unLocakCondition',errorMessage : '订单被别人锁定，不可批量操作'},
                                    {name : '超级解锁',tag :'unLockOrder',verify : 'superLockCondition',errorMessage : '有未锁定订单，不可批量操作'}
                                ]},
                                {name:'订单标记'},
                                {name:'推荐快递'},
                                {name:'推荐仓库'},
                                {name:'批量修改',list:[
                                    {name : '留单',tag : 'orderLeave'},
                                    {name : '强制拆单',tag : 'forceSplitOrder'},
                                    {name : '手工处理',tag : 'manualOrder'},
                                    {name : '个性化包裹',tag : 'bagContent'},
                                    {name : '加急发货',tag : 'speedDelivery'},
                                    {name : '添加赠品',tag : 'getskuCodeInit' ,type : 'false',verify : 'giftCondition',errorMessage : '存在订单状态不支持批量操作'},
                                    {name : '添加赠品（叠加）',tag : 'getskuCode',type : 'true',verify : 'giftCondition',errorMessage : '存在订单状态不支持批量操作'},
                                    {name : '添加套装赠品',tag:'getSuit',type : 'false',verify : 'giftCondition',errorMessage : '存在订单状态不支持批量操作'},
                                    {name : '添加套装赠品(叠加)',tag :'getSuit',type : 'true',verify : 'giftCondition',errorMessage : '存在订单状态不支持批量操作'},
                                    {name : '删除赠品',tag : 'getSkuCodeForDel'},
                                    {name : '物流到付',tag:'expressFee',type:'true'},
                                    {name : '取消物流到付',tag : 'expressFee',type : 'false'}
                                ]},
                                {name:'重置状态',tag:'resetOrderStatus',verify : 'resetCondition',errorMessage : '存在订单状态不支持批量操作'},
                                {name:'作废',tag : 'obsoluteOrder',verify : 'obsoleteCondition' ,errorMessage : '部分订单不支持作废操作'},
                                {name : '审核',tag : 'auditOrder',verify : 'auditCondition' , errorMessage : '部分订单不支持批量操作'},
                                {name : '批量自动配货',tag : 'autoDispatch',verify : 'isSelfLock',errorMessage : '部分订单不支持批量操作'},
                                {name : '手工配货'},
                                {name : '内部标签',tag : 'addInsideLabel'},
                                {name : '匹配异常商品',tag : 'matchAbnormalOrder'}
                            ],
                            name:'批量操作',
                            onChange: function(obj,index){	//点击之后的回调
                                var body = scope.orderListTbody;
                                var orders = [];
                                for(var i = 0,j = body.length;i < j;i++){
                                    if(body[i].trShow){
                                        //验证操作可行性
                                        if(obj.verify){
                                            if(scope.domOperate[obj.verify](body[i])){
                                                scope.domOperate[obj.verify](body[i])
                                            }else{
                                                alert(obj.errorMessage);
                                                return false;
                                            }
                                        }
                                        orders.push(body[i]);
                                    }
                                }
                                if(orders.length < 1){
                                    alert('请先选择订单');
                                    return false;
                                }
                                OrderListInterface[obj.tag](scope,orders,obj);
                            }
                        }
                    };
                },

                //获取选中的订单信息
                getChoseOrder : function (scope) {
                    var obj = scope.orderListTbody;
                    var tmpData = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            tmpData.push(obj[i]);
                        }
                    }
                    return tmpData;
                },

                //商品信息分页设置
                productPageSet : function (obj,scope) {
                    orderManagePublicService.orderManagerPublicFunction.pageSetExtend(obj, function () {
                        OrderListInterface.getskuCode(scope);
                    });
                },

                //套装分类信息分页设置
                suitPageSet : function (obj,scope) {
                    orderManagePublicService.orderManagerPublicFunction.pageSetExtend(obj, function () {
                        OrderListInterface.getSuit(scope);
                    });
                },

                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        OrderListInterface.getOrderList(scope);
                    });
                },

                //获取上一页数据
                prevPage : function (scope) {
                    orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                },

                //获取下一页数据
                nextPage : function (scope) {
                    orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                },
                /**
                 * 获取高级搜索的条件
                 * @param scope $scope对象
                 * @param key 筛选的条件
                 * @param val 筛选条件的名字
                 * @param type 筛选的状态类型
                 * @param name 筛选条件的名字
                 */
                conditionSetting : function(scope,key,val,type,name){
                    orderManagePublicService.orderManagerPublicFunction.conditionSetting(scope,key,val,type,name);
                },

                /**
                 * 根据拼音首字母获取所需信息
                 * @param scope $scope对象
                 * @param letter 要筛选的首字母
                 * @param type 筛选的条件类型
                 */
                selectStoresByFirstLetter : function (scope,letter,type) {
                    orderManagePublicService.orderManagerPublicFunction.selectStoresByFirstLetter(cope,letter,type);
                }
            };

            // 接口的数据处理
            var OrderListInterface = {
                /**
                 * 获取订单列表
                 * @param scope scope对象
                 */
                getOrderList : function(scope){
                    InterFace.getOrderList(scope,function (res) {
                        if(res.success){
                            //清空全选
                            scope.checkAll = false;
                            scope.orderListTbody = res.data;
                            scope.$on("conditionCallback",function(){
                                //$("#dataListTable").dataTable().fnDestroy();
                                //var dt = $('#dataListTable').DataTable( {
                                //    scrollY: 400,
                                //    scrollX:true,
                                //    paging: false,
                                //    searching: false,
                                //    info : false,
                                //    bDestroy: true
                                //} );
                                //$('#dataListTable').fixedHeaderTable({
                                //    footer: false,
                                //    destroy :true
                                //});
                                scope.paginationConf.totalItems = res.total;
                            });
                        }else{
                            alert('订单信息获取失败！');
                        }
                    });
                },

                //获取所有店铺信息，并且将店铺数据归类展示
                getAllShops : function (scope) {
                    orderManagePublicService.orderManagerPublicInterface.getAllShops(scope, function (responseData) {
                        //将后台返回的数据存储到storeList对象中
                        toolsService.setDataShowType(scope,responseData,scope.orderListCollect.storeList,5);
                    });
                },

                //获取所有平台信息，并将数据归类展示
                getPlantformType : function (scope) {
                    orderManagePublicService.orderManagerPublicInterface.getPlantformType(scope, function (responseData) {
                        //将后台返回的数据存储到platformList对象中
                        toolsService.setDataShowType(scope,responseData,scope.orderListCollect.platformList,5);
                    });
                },

                //获取所有仓库信息，并将数据归类显示
                getAllWareHouse : function (scope) {
                    InterFace.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            //将后台返回的数据存储到commendWareHouse对象中
                            toolsService.setDataShowType(scope,res.data,scope.orderListCollect.commendWareHouse,5);
                            scope.wareHouseInfo = res.data.clone();
                            for(var i= 0,j = scope.wareHouseInfo.length;i < j;i++){
                                scope.wareHouseInfo[i]['tag'] = 'addCommendWareHouse';
                            }
                            scope.wareHouseInfo.unshift({
                                tag : 'addCommendWareHouse',
                                name : '取消推荐'
                            });
                            scope.selectConfig.batchOperate.info[3] = {name : '推荐仓库',list : scope.wareHouseInfo};
                        }else{
                            alert('获取所有仓库信息失败');
                        }
                    });
                },
                
                //获取所有快递信息，并将数据归类显示
                getAllExpressInfo : function (scope) {
                    InterFace.getAllExpressInfo(scope, function (res) {
                        if(res.success){
                            //将后台返回的数据存储到commendExpress对象中
                            toolsService.setDataShowType(scope,res.data,scope.orderListCollect.commendExpress,5);
                            scope.expressInfo = res.data.clone();
                            for(var i= 0,j = scope.expressInfo.length;i < j;i++){
                                scope.expressInfo[i]['tag'] = 'addCommendExpress';
                            }
                            scope.expressInfo.unshift({
                                tag : 'addCommendExpress',
                                name : '取消推荐'
                            });
                            scope.selectConfig.batchOperate.info[2] = {name : '推荐快递',list : scope.expressInfo};
                        }else{
                            alert('获取快递信息失败');
                        }
                    });
                },

                //获取所有订单标记信息，并将数据归类显示
                getAllOrderMarks : function (scope) {
                    orderManagePublicService.orderManagerPublicInterface.getAllOrderMarks(scope, function (responseData) {
                        //将后台返回的数据存储
                        toolsService.setDataShowType(scope,responseData,scope.orderListCollect.orderSign,5);
                        scope.orderMarks = responseData;
                    });
                },

                /**
                 * 设置从后台获取的高级搜索条件的字段数据
                 * @param scope
                 * @param data 从后台获取字段的详细数据
                 * @param dataType 字段类型
                 */
                setDataShowType : function (scope,data,dataType) {
                    orderManagePublicService.orderManagerPublicFunction.setDataShowType(scope,data,dataType);
                },

                //获取订单标记
                getOrderLabel : function(scope){
                    orderManagePublicService.orderManagerPublicInterface.getOrderLabel(scope, function (responseData) {
                        scope.orderLable = responseData;
                        for(var i= 0,j = responseData.length;i < j;i++){
                            responseData[i]['tag'] = 'addOrderLabel';
                        }
                        responseData.unshift({
                            tag : 'addOrderLabel',
                            name : '取消标记'
                        });
                        scope.selectConfig.batchOperate.info[1] = {name : '订单标记',list : responseData};
                    });
                },

                //添加内部标签
                addInsideLabel : function (scope,list,obj) {
                    var orderid = this.getOrderIdObj(list,'orderid');
                    $('.info-get-modal').modal('show');
                    //配置弹出输入提示框
                    scope.modal = {
                        title : '请输入内容',
                        confirm : function (content){
                            InterFace.addInsideLabel(scope,orderid,content, function (res) {
                                if(res.success){
                                    OrderListInterface.getOrderList(scope);
                                }else{
                                    alert('添加内部标签失败');
                                }
                            });
                            $('.info-get-modal').modal('hide');
                        }
                    };

                },
                //留单
                orderLeave  : function (scope,list,obj) {
                    $('.time-select').modal('show');
                    var orderIds = this.getOrderId(list,'orderid');
                    //配置弹出输入框
                    scope.timeSelect = {
                        title : '留单',
                        //确定留单
                        confirm : function (content){
                            InterFace.orderLeave(scope,orderIds,content, function (res) {
                                if(res.success){
                                    OrderListInterface.getOrderList(scope);
                                }else{
                                    alert('留单失败');
                                }
                            });
                            $('.time-select').modal('hide');
                        }
                    };

                },
                //手工处理
                manualOrder : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.manualOrder(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('手工处理失败');
                        }
                    });
                },
                //个性化包裹
                bagContent : function (scope,list,obj){
                    var ids = this.getOrderId(list,'orderid');
                    //配置弹出输入框
                    scope.modal = {
                        title : '个性化包裹',
                        confirm : function (content){
                            InterFace.bagContent(scope,ids,content, function (res) {
                                if(res.success){
                                    OrderListInterface.getOrderList(scope);
                                }else{
                                    alert('个性化包裹失败');
                                }
                            });
                            $('.info-get-modal').modal('hide');
                        }
                    };
                    $('.info-get-modal').modal('show');
                },
                //加急发货
                speedDelivery : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.speedDelivery(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('加急失败');
                        }
                    });
                },
                //物流到付
                expressFee : function (scope,list,obj){
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.expressFee(scope,ids,obj.type, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('物流到付设置失败');
                        }
                    });
                },
                //商品信息
                getskuCode : function (scope) {
                    InterFace.getskuCodeInit(scope,scope.productSearch, function (res) {
                        if(res.success){
                            scope.productInfo = res.data;
                            scope.productPage.paginationConf.totalItems = res.total;
                            //如果有商品信息，则默认获取第一条商品的详细信息
                            if(res.data.length>0){
                                OrderListInterface.getProductDetails(scope,res.data[0]['code']);
                            }
                        }else{
                            alert('获取商品失败');
                        }
                    });
                },
                //商品信息（添加赠品时候初始化）
                getskuCodeInit : function (scope,list,obj){
                    if(list instanceof Array){
                        scope.orderAddGift = list;
                    }else{
                        scope.orderAddGift = [list];
                    }
                    $('.product-modal').modal('show');
                    scope.isGiftOver = obj.type;
                    //配置商品信息确认事件标志
                    scope.giftConfig = 'giftAdd';
                    this.getskuCode(scope);
                },
                //商品信息（删除赠品）
                getSkuCodeForDel : function (scope,list,obj){
                    if(list instanceof Array){
                        scope.orderAddGift = list;
                    }else{
                        scope.orderAddGift = [list];
                    }
                    $('.product-modal').modal('show');
                    //配置商品信息确认事件标志
                    scope.giftConfig = 'giftDel';
                    this.getskuCode(scope);
                },
                //获取商品详细信息
                getProductDetails : function (scope,value) {
                    InterFace.getProductDetails(scope,value, function (res) {
                        if(res.success){
                            scope.productInfoDetais = res.data;
                        }else{
                            alert('商品信息获取失败');
                        }
                    });
                },
                //添加赠品
                addGift : function (scope,order,details){
                    var data = [];
                    //将套装明细封装到一个数组当中
                    for(var item in details){
                        if(details.hasOwnProperty(item)){
                            for(var i = 0,j = details[item].length;i < j;i++){
                                data.push(details[item][i]);
                            }
                        }
                    }
                    InterFace.addGift(scope,order,data, function (res) {
                        if(res.success){
                            //成功重新刷新列表
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('添加商品失败');
                        }
                        $('.product-modal').modal('hide');
                    });
                },
                //获取套装信息
                getSuit : function(scope,list,obj){
                    //判断是对象还是数组，如果是对象则表示是单个订单添加套装，如果是数组表示是批量添加套装
                    if(list instanceof Array){
                        scope.orderAddGift = list;
                    }else{
                        scope.orderAddGift = [list];
                    }
                    scope.isGiftOver = obj.type;
                    InterFace.getSuit(scope, function (res) {
                        if(res.success){
                            $('.suit-modal').modal('show');
                            scope.suitInfo = res.data;
                            scope.suitPage.paginationConf.totalItems  = res.total;
                        }else{
                            alert('添加商品失败');
                        }
                    });
                },
                //获取套装明细
                getSuitDetails : function (scope,value,id) {
                    InterFace.getSuitDetails(scope,value, function (res) {
                        if(res.success){
                            $('.suit-modal').modal('show');
                            //以套装的id来区分是哪个的明细
                            scope.suitDetails[id] = res.data;
                        }else{
                            alert('添加商品失败');
                        }
                    });
                },
                //获取商品信息
                getProductInfo : function (scope,order){
                    var value = order.orderid;
                    var paytime = order.paydate;
                    InterFace.getProductInfo(scope,value, function (res) {
                        if(res.success){
                            //获取每种商品的可销数
                            for(var i = 0,j = res.data.length;i < j;i++){
                                //店铺id这里默认给一个(因为从后台获取的都是这一个)
                                OrderListInterface.getCanSale(scope,res.data[i]['productskuid'],paytime,'1046fafa-8f0d-4525-95f7-c43dfb47014e',res.data[i]);
                            }
                            order['details'] = res.data;
                        }else{
                            alert('获取商品信息失败');
                        }
                    });
                },
                //获取商品的可销数
                getCanSale : function (scope,skuid,paytime,storeId,details) {
                    InterFace.getCanSale(scope,skuid,paytime,storeId, function (res) {
                        if(res.success){
                            details['cansalequantity'] = res.data;
                        }else{
                            alert('获取商品信息失败');
                        }
                    });
                },
                //锁定订单
                lockOrder : function (scope,list,obj){
                    var orderIds = this.getOrderId(list,'orderid');
                    InterFace.lockOrder(scope,orderIds, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('锁定成功');
                        }
                    });
                },
                //解锁订单
                unLockOrder : function (scope,list,obj) {
                    var orderIds = this.getOrderId(list,'orderid');
                    InterFace.unLockOrder(scope,orderIds, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('解锁失败');
                        }
                    });
                },
                //添加订单标记
                addOrderLabel : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    //取消订单标记
                    if(!obj.id){
                        obj.name = '';
                    }
                    InterFace.addOrderLabel(scope,obj.name,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('添加标记失败');
                        }
                    });
                },
                //修改推荐快递
                addCommendExpress : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    //取消推荐快递
                    if(!obj.id){
                        obj.id = '00000000-0000-0000-0000-000000000000';
                        obj.name = '';
                    }
                    InterFace.addCommendExpress(scope,obj.name,obj.id,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('添加标记失败');
                        }
                    });
                },
                //修改推荐仓库
                addCommendWareHouse : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    //取消推荐仓库
                    if(!obj.id){
                        obj.id = '00000000-0000-0000-0000-000000000000';
                        obj.name = '';
                    }
                    InterFace.addCommendWareHouse(scope,obj.name,obj.id,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('推荐仓库失败');
                        }
                    });
                },
                //强制拆单
                forceSplitOrder : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.forceSplitOrder(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('强制拆单失败');
                        }
                    });
                },
                //重置状态
                resetOrderStatus : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.resetOrderStatus(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('重置失败');
                        }
                    });
                },
                //作废订单
                obsoluteOrder : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.obsoluteOrder(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('作废失败');
                        }
                    });
                },
                //审核订单
                auditOrder : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.auditOrder(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('审核失败');
                        }
                    });
                },
                //自动配货
                autoDispatch : function (scope,list,obj){
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.autoDispatch(scope,ids, function (res) {
                        if(res.success){
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('审核失败');
                        }
                    });
                },
                //删除赠品
                deleteGift : function (scope,list,obj) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.deleteGift(scope,ids,obj, function (res) {
                        if(res.success){
                            alert('删除成功');
                            $('.product-modal').modal('hide');
                            OrderListInterface.getOrderList(scope);
                        }else{
                            alert('删除失败');
                        }
                    });
                },
                //获取单个订单的信息
                getOrderInfoById : function (scope,orderid,callback){
                    InterFace.getOrderInfoById(scope,orderid,callback);
                },
                //获取订单id
                getOrderId : function (list,type){
                    var orderIds = [];
                    if(list instanceof Array){
                        for(var i = 0,j = list.length;i < j;i++){
                            orderIds.push(list[i][type]);
                        }
                    }else{
                        orderIds.push(list[type]);
                    }
                    return orderIds;
                },
                //获取订单id（另一种格式）
                getOrderIdObj : function (list,type){
                    var orderIds = {};
                    if(list instanceof Array){
                        for(var i = 0,j = list.length;i < j;i++){
                            orderIds[list[i][type]] = list[i][type];
                        }
                    }else{
                        orderIds[list[type]] = list[type];
                    }
                    return orderIds;
                },
                //匹配异常商品
                matchAbnormalOrder : function (scope,list) {
                    var ids = this.getOrderId(list,'orderid');
                    InterFace.matchAbnormalOrder(scope,ids, function (res) {
                        if(res.success){
                           alert('没有异常商品');
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                }
            };

            // 调用接口
            var InterFace = {
                /**
                 * 订单列表
                 * @param scope
                 * @param callback
                 */
                getOrderList : function (scope,callback) {
                    var url = '/SalesOrder/SalesOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['body'] = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:41.452",
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsManual",
                                "Name": "IsManual",
                                "Value": scope.formData.IsManual,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsPrepay",
                                "Name": "IsPrepay",
                                "Value": scope.formData.IsPrepay,
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
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.formData.Code,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TradeId",
                                "Name": "TradeId",
                                "Value": scope.formData.TradeId,
                                "Children": []
                            },
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "PlatformType",
                            //    "Name": "PlatformType",
                            //    "Value": scope.formData1.PlatformType.value,
                            //    "Children": []
                            //},
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TransType",
                                "Name": "TransType",
                                "Value": scope.formData1.TransType ? scope.formData1.TransType.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SuggestExpressId",
                                "Name": "SuggestExpressId",
                                "Value": scope.formData1.SuggestExpressId ? scope.formData1.SuggestExpressId.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayDate",
                                "Name": "PayDateBegin",
                                "Value": scope.formData.PayDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayDate",
                                "Name": "PayDateEnd",
                                "Value": scope.formData.PayDateEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayAmount",
                                "Name": "PayAmountBegin",
                                "Value": scope.formData.PayAmountBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayAmount",
                                "Name": "PayAmountEnd",
                                "Value": scope.formData.PayAmountEnd,
                                "Children": []
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
                                "Field": "IsCod",
                                "Name": "IsCod",
                                "Value": scope.formData.IsCod,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "HasInvoice",
                                "Name": "HasInvoice",
                                "Value": scope.formData.HasInvoice,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsOutOfStock",
                                "Name": "IsOutOfStock",
                                "Value":  scope.formData.IsOutOfStock,
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
                                "Field": "ExpressFeeIsCod",
                                "Name": "ExpressFeeIsCod",
                                "Value": scope.formData.ExpressFeeIsCod,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsHold",
                                "Name": "IsHold",
                                "Value": scope.formData.IsHold,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsLock",
                                "Name": "IsLock",
                                "Value": scope.formData.IsLock,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sub.IsBlacklist",
                                "Name": "IsBlacklist",
                                "Value": scope.formData.IsBlacklist,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "RefundStatus",
                                "Name": "RefundStatus",
                                "Value": scope.formData1.RefundStatus ? scope.formData1.RefundStatus.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PreSaleType",
                                "Name": "PreSaleType",
                                "Value": scope.formData1.PreSaleType ? scope.formData1.PreSaleType.value : undefined,
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
                                "Field": "Quantity",
                                "Name": "QuantityBegin",
                                "Value": scope.formData.QuantityBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Quantity",
                                "Name": "QuantityEnd",
                                "Value": scope.formData.QuantityEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SourceType",
                                "Name": "SourceType",
                                "Value": scope.formData1.SourceType ? scope.formData1.SourceType.value : undefined,
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
                                "Field": "SuggestWarehouseId",
                                "Name": "SuggestWarehouseId",
                                "Value": scope.formData1.SuggestWarehouseId ? scope.formData1.SuggestWarehouseId.value : undefined,
                                "Children": []
                            },
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "LockedUserName",
                            //    "Name": "LockedUserName",
                            //    "Value": "锁定人呢",
                            //    "Children": []
                            //},
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "CreateUserName",
                            //    "Name": "CreateUserName",
                            //    "Value": "制单人呢",
                            //    "Children": []
                            //},
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "StoreId",
                                "Name": "StoreId",
                                "Value": scope.formData1.StoreId ? scope.formData1.StoreId.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.formData1.Status ? scope.formData1.Status.value : undefined,
                                "Children": []
                            },
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "CustomerName",
                            //    "Name": "CustomerName",
                            //    "Value": "会员昵称",
                            //    "Children": []
                            //},
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "AuditUserName",
                            //    "Name": "AuditUserName",
                            //    "Value": "审核人",
                            //    "Children": []
                            //},
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DeliveryTypeStatus",
                                "Name": "DeliveryTypeStatus",
                                "Value": scope.formData1.DeliveryTypeStatus ? scope.formData1.DeliveryTypeStatus.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DispatchTypeStatus",
                                "Name": "DispatchTypeStatus",
                                "Value": scope.formData1.DispatchTypeStatus ?scope.formData1.DispatchTypeStatus.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sub.PreShipmentDate",
                                "Name": "PreShipmentDateBegin",
                                "Value": scope.formData.PreShipmentDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sub.PreShipmentDate",
                                "Name": "PreShipmentDateEnd",
                                "Value": scope.formData.PreShipmentDateEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sub.Address",
                                "Name": "Address",
                                "Value": scope.formData.Address,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PlatformSkuId",
                                "Name": "PlatformSkuId",
                                "Value": scope.formData.PlatformSkuId,
                                "Children": []
                            },
                            {
                                "OperateType": 1,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "NotContainSkuCode",
                                "Name": "NotContainSkuCode",
                                "Value": scope.formData.NotContainSkuCode,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sub.DistributionTradeId",
                                "Name": "DistributionTradeId",
                                "Value": scope.formData.DistributionTradeId,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TagName",
                                "Name": "TagName",
                                "Value": scope.formData1.TagName ? scope.formData1.TagName.name : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DispatchCode",
                                "Name": "DispatchCode",
                                "Value": scope.formData.DispatchCode,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ExpressNumber",
                                "Name": "ExpressNumber",
                                "Value": scope.formData.ExpressNumber,
                                "Children": []
                            },
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 1,
                            //    "AllowEmpty": false,
                            //    "Children": [
                            //        {
                            //            "OperateType": 0,
                            //            "LogicOperateType": 0,
                            //            "AllowEmpty": false,
                            //            "Field": "sub.Mobile",
                            //            "Name": "Mobile",
                            //            "Value": "手机",
                            //            "Children": []
                            //        },
                            //        {
                            //            "OperateType": 0,
                            //            "LogicOperateType": 0,
                            //            "AllowEmpty": false,
                            //            "Field": "sub.Telephone",
                            //            "Name": "Telephone",
                            //            "Value": "手机",
                            //            "Children": []
                            //        }
                            //    ]
                            //},
                            //{
                            //    "OperateType": 0,
                            //    "LogicOperateType": 0,
                            //    "AllowEmpty": false,
                            //    "Field": "sub.Consignee",
                            //    "Name": "Consignee",
                            //    "Value": "收货人",
                            //    "Children": []
                            //},
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SkuCode",
                                "Name": "SkuCode",
                                "Value": scope.formData.SkuCode,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var orderlist = ApiService.postLoad(url,paramObj);
                    orderlist.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 删除赠品
                 * @param scope
                 * @param orderids 订单id
                 * @param skuids 商品规格id
                 * @param callback
                 */
                deleteGift : function (scope,orderids,skuids,callback) {
                    var url = '/SalesOrder/SalesOrder/GiftDelete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(orderids);
                    paramObj.skuids = JSON.stringify(skuids);
                    var gift = ApiService.postLoad(url,paramObj);
                    gift.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 套装明细
                 * @param scope
                 * @param value 套装id（skuid）
                 * @param callback
                 */
                getSuitDetails : function (scope,value,callback) {
                    var url = '/Product/CombinedProductDetail/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"CombinedProductId",
                        "Name":"CombinedProductId",
                        "Value":value,
                        "Children":[]
                    }]);
                    var suit = ApiService.postLoad(url,paramObj);
                    suit.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 自动配货
                 * @param scope
                 * @param ids 要自动配货的订单
                 * @param callback
                 */
                autoDispatch : function (scope,ids,callback){
                    var url = '/SalesOrder/Dispatch/AutoDispatch';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var dispatch = ApiService.post(url,paramObj);
                    dispatch.then(function (res) {
                       callback(res);
                    });
                },

                /**
                 * 订单审核
                 * @param scope
                 * @param ids 要审核的订单
                 * @param callback
                 */
                auditOrder : function (scope,ids,callback) {
                    var url = '/SalesOrder/SalesOrder/Audit';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var audit = ApiService.post(url,paramObj);
                    audit.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 作废订单
                 * @param scope
                 * @param ids 要作废的订单号
                 * @param callback
                 */
                obsoluteOrder : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/Obsolete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var obsoluteOrder = ApiService.post(url,paramObj);
                    obsoluteOrder.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 重置状态
                 * @param scope
                 * @param ids 要重置的id
                 * @param callback
                 */
                resetOrderStatus : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ResetStatus';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var orderStatus = ApiService.post(url,paramObj);
                    orderStatus.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 强制拆单
                 * @param scope
                 * @param ids 被强制拆单的订单
                 * @param callback
                 */
                forceSplitOrder : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/MandatorySplit';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(ids);
                    var dispatch = ApiService.post(url,paramObj);
                    dispatch.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 新增推荐仓库
                 * @param scope
                 * @param wareHouse 仓库名
                 * @param wareid 仓库id
                 * @param ids 要推荐的订单号
                 * @param callback
                 */
                addCommendWareHouse : function (scope,wareHouse,wareid,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ChangedWarehouse';
                    var paramObj =ApiService.getBasicParamobj();
                    paramObj['orderids'] = JSON.stringify(ids);
                    paramObj['wareid'] = wareid;
                    paramObj['warename'] = wareHouse;
                    var commendWareHouse = ApiService.post(url,paramObj);
                    commendWareHouse.then(function (res) {
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
                 * 添加推荐快递
                 * @param scope
                 * @param express 推荐快递名称
                 * @param expid 推荐快递id
                 * @param ids 要添加的订单id
                 * @param callback
                 */
                addCommendExpress : function(scope,express,expid,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ChangedExpress';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['orderids'] = JSON.stringify(ids);
                    paramObj['expname'] = express;
                    paramObj['expid'] = expid;
                    var commendExpress = ApiService.post(url,paramObj);
                    commendExpress.then(function (res) {
                        callback(res);
                    });
                },
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
                 * 获取单个订单的信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getOrderInfoById : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = orderid;
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 锁定订单
                 * @param orderIds 要锁定的订单的id数组
                 * @param scope
                 * @param callback
                 */
                lockOrder : function (scope,orderIds,callback){
                    var url = '/SalesOrder/SalesOrder/Lock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderIds);
                    var lockOrder = ApiService.post(url,paramObj);
                    lockOrder.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 解锁订单
                 * @param scope
                 * @param orderIds 要解锁的订单的id数组
                 * @param callback
                 */
                unLockOrder : function (scope,orderIds,callback) {
                    var url = '/SalesOrder/SalesOrder/UnLock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderIds);
                    var unLock = ApiService.post(url,paramObj);
                    unLock.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 添加订单标记
                 * @param scope
                 * @param label 要添加的订单标记
                 * @param ids 要添加的订单的id
                 * @param callback
                 */
                addOrderLabel : function (scope,label,ids,callback){
                    var url = '/SalesOrder/SalesOrder/AddTag';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['tagname'] = label;
                    paramObj['orderids'] = JSON.stringify(ids);
                    var orderLabel = ApiService.post(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 添加内部标签
                 * @param scope
                 * @param ids 要添加内部标签的id
                 * @param message 标签内容
                 * @param callback
                 */
                addInsideLabel : function (scope,ids,message,callback) {
                    var url = '/OrderMessage/BatchAddNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.ids = JSON.stringify(ids);
                    paramObj.message = message;
                    var label = ApiService.post(url,paramObj);
                    label.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 留单
                 * @param scope
                 * @param ids 要留单的单号
                 * @param date 时间
                 * @param callback
                 */
                orderLeave : function (scope,ids,date,callback) {
                    var url = '/SalesOrder/SalesOrder/HoldOrder';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(ids);
                    paramObj.ydate = date;
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 匹配异常商品
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                matchAbnormalOrder : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/ReLoadProduct';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(orderid);
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 *手工处理
                 * @param scope
                 * @param orderids 要手工处理的订单id
                 * @param callback
                 */
                manualOrder : function (scope,orderids,callback){
                    var url = '/SalesOrder/SalesOrder/Manual';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(orderids);
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 个性化包裹
                 * @param scope
                 * @param orderids 要个性化包裹的订单
                 * @param message 个性化包裹说明
                 * @param callback
                 */
                bagContent : function (scope,orderids,message,callback){
                    var url = '/SalesOrder/SalesOrder/BagContent';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(orderids);
                    paramObj.bgcontent = message;
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 加急发货
                 * @param scope
                 * @param orderids 要加急发货的订单
                 * @param callback
                 */
                speedDelivery : function (scope,orderids,callback) {
                    var url = '/SalesOrder/SalesOrder/SpeedDelivery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderids = JSON.stringify(orderids);
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 物流到付
                 * @param scope
                 * @param orderids 要物流到付的订单
                 * @param callback
                 * @param type 标志是添加物流到付还是取消物流到付
                 */
                expressFee : function (scope,orderids,type,callback) {
                    var url = '/SalesOrder/SalesOrder/UpdateExpressFeeIsCod';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderids);
                    paramObj.expressFeeIsCod = type;
                    var order = ApiService.post(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取规格信息
                 * @param scope
                 * @param data 搜索条件
                 * @param callback
                 */
                getskuCodeInit : function (scope,data,callback) {
                    var url = '/Product/ProductSku/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex": scope.productPage.paginationConf.currentPage,
                        "PageSize": scope.productPage.paginationConf.itemsPerPage,
                        "SeletedCount": 0,
                        "Data": [
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Description",
                                "Name": "prodes",
                                "Value": data['prodes'],
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Code",
                                "Name": "procode",
                                "Value": data['procode'],
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Description",
                                "Name": "skudes",
                                "Value": data['skudes'],
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Code",
                                "Name": "skucode",
                                "Value": data['skucode'],
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Status",
                                "Name": "skustatus",
                                "Value": 1,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.IsCombined",
                                "Name": "IsCombined",
                                "Value": "0",
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Status",
                                "Name": "prostatus",
                                "Value": 1,
                                "Children": []
                            }
                        ],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品详情信息
                 * @param scope
                 * @param value 规格的id（code）
                 * @param callback
                 */
                getProductDetails : function (scope,value,callback) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Code",
                        "Name":"Code",
                        "Value":value,
                        "Children":[]
                    }]);
                    var quitGoods = ApiService.post(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 添加赠品
                 * @param scope
                 * @param order 订单信息
                 * @param details 商品信息
                 * @param callback
                 */
                addGift : function (scope,order,details,callback){
                    var url = '/SalesOrder/SalesOrder/GiftAdd';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orders = JSON.stringify(order);
                    paramObj.details = JSON.stringify(details);
                    paramObj.isadd = scope.isGiftOver;
                    var addGift = ApiService.post(url,paramObj);
                    addGift.then(function (res) {
                        callback(res);
                    });
                },
                //获取套装信息
                getSuit : function (scope,callback){
                    var url ='/Product/CombinedProduct/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.suitPage.paginationConf.currentPage,
                        "PageSize":scope.suitPage.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Status",
                            "Name":"Status",
                            "Value":1,
                            "Children":[]
                        },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Description",
                                "Name": "Description",
                                "Value": scope.suit.Description,
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.suit.Code,
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SkuCode",
                                "Name": "SkuCode",
                                "Value": scope.suit.SkuCode,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var getSuit = ApiService.post(url,paramObj);
                    getSuit.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品信息
                 * @param scope
                 * @param value 订单id
                 * @param callback
                 */
                getProductInfo : function (scope,value,callback) {
                    var url = '/SalesOrder/SalesOrder/DetailQuery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "SalesOrderId",
                            "Name": "SalesOrderId",
                            "Value": value,
                            "Children": []
                        }]);
                    var product = ApiService.post(url,paramObj);
                    product.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品的可销数
                 * @param scope
                 * @param skuid 规格id
                 * @param paytime 支付时间
                 * @param storeId 店铺id
                 * @param callback
                 */
                getCanSale : function (scope,skuid,paytime,storeId,callback){
                    var url = '/Inventory/InventoryVirtual/GetCanSales';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.skuid = skuid;
                    paramObj.paytime = paytime;
                    paramObj.storeId = storeId;
                    var product = ApiService.post(url,paramObj);
                    product.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                orderDetails : {},
                setOrderDetails : function (obj) {
                  this.orderDetails =  obj;
                },
                getOrderDetails : function (obj) {
                  return this.orderDetails;
                },
                OrderListInterface : OrderListInterface,
                orderListDomOperate : orderListDomOperate
            }

    }]
);