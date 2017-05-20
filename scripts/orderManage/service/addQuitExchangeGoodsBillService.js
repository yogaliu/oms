/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('addQuitExchangeGoodsBillService',['ApiService','toolsService','orderManagePublicService','APP_MENU','validateService',
        function (ApiService,toolsService,orderManagePublicService,APP_MENU,validateService) {

            //配置数据
            var configData = {
                //退货通知单列定义
                orderListColumns : [
                    {name: "订单特殊标识", tag: 'tips'},
                    {name: "锁定人", tag: 'lockedusername'},
                    {name: "订单编号", tag: 'code'},
                    {name: "平台订单号", tag: 'tradeid'},
                    {name: "状态", tag: 'status','otherInfo':APP_MENU.orderStatus},
                    {name: "平台状态", tag: 'platformstatus','otherInfo':APP_MENU.orderPlantformStatus},
                    {name: "付款状态", tag: 'paystatus','otherInfo':APP_MENU.orderPaymentStatus},
                    {name: "预售类型", tag: 'presaletype',otherInfo:APP_MENU.preSellType},
                    {name: "预售日期", tag: 'preshipmentdate'},
                    {name: "留单日期", tag: 'customershipdate'},
                    {name: "配货状态", tag: 'dispatchtypestatus', 'otherInfo' : APP_MENU.preDistributionStatus},
                    {name: "发货状态", tag: 'deliverytypestatus','otherInfo':APP_MENU.preDelivery},
                    {name: "退款状态", tag: 'refundstatus','otherInfo':APP_MENU.preRefundType},
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
                    {name: "分销订单号", tag: 'distributiontradedd'},
                    {name: "支付日期", tag: 'paydate'},
                    {name: "制单日期", tag: 'createdate'},
                    {name: "交易日期", tag: 'platfromdate'},
                    {name: "发货时间", tag: 'deliverydate'},
                    {name: "订单类型", tag: 'transtype',otherInfo:APP_MENU.preOrderType},
                    {name: "订单来源", tag: 'sourcetype',otherInfo:APP_MENU.preOrderSource},
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

                //订单详细列表
                orderDetailsColumn : [
                    {name: "状态", tag: "status",otherInfo:APP_MENU.preDistributionInfoState},
                    {name: "是否缺货", tag: 'isoutofstock'},
                    {name: "商品编码", tag: 'productcode'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "退款", tag: 'isrefunded'},
                    {name: "标记名称", tag: 'tagname'},
                    {name: "作废", tag: 'isobsolete'},
                    {name: "商品类型", tag: 'producttype'},
                    {name: "预售日期", tag: 'preshipmentdate'},
                    //{name: "订购数量", tag: 'num'},
                    {name: "原始单价", tag: 'priceoriginal'},
                    {name: "销售单价", tag: 'priceselling'},
                    {name: "促销单价", tag: 'pricepromotional'},
                    {name: "销售金额", tag: 'amount'},
                    {name: "结算金额", tag: 'amountactual'}
                ],

                //商品列表
                productColumn : [
                    {name : '',tag : ''},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '市场价',tag : 'firstprice'},
                    {name : '重量',tag : 'weight'},
                    {name : '备注',tag : 'note'}
                ],
                //商品明细
                productDetailsColumn : [
                    {name : '仓库名',tag : 'warehousename'},
                    {name : '库存数',tag : 'quantity'},
                    {name : '可用数',tag : 'canUseQuantity'},
                    {name : '可销数',tag : 'canSaleQuantity'}
                ],
                //套装列表
                suitColumn : [
                    {name : '不可拆分',tag : 'issplit'},
                    {name : '套装代码',tag : 'code'},
                    {name : '套装名称',tag : 'description'},
                    {name : '套装分类',tag : 'categoryname'},
                    {name : '套装规格',tag : 'productsize'},
                    {name : '礼盒',tag : 'isgift'},
                    {name : '重量',tag : 'weight'},
                    {name : '销售价',tag : 'firstprice'},
                    {name : '备注',tag : 'note'}
                ],
                //退入商品列表
                productInColumn : [
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '退货数量',tag : 'quantity',canEdit : true},
                    {name : '应退金额',tag : 'actualamount'},
                    {name : '实退金额',tag : 'refundamount',canEdit : true}
                ],
                //换出商品列表
                productOutColumn : [
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '换货数量',tag : 'quantity',canEdit : true},
                    {name : '实际单价',tag : 'actualamount'}
                ]
            };

            //新增退换货单dom处理
            var addQorEGoodsDomOperate = {
                //页面初始化
                domInit : function (scope) {
                    //表单初始化验证
                    validateService.initValidate('#addQuitExchangeGoodsBill');
                    //退入商品变量
                    scope.activeContent = false;
                    //换出商品变量
                    scope.activeContent = false;
                    //分页设置
                    this.pageSet(scope);
                    //换出商品分页配置
                    scope.productOutPage = {};
                    //退入商品分页配置
                    scope.productInPage = {};
                    //退入商品中添加套装明细
                    scope.suitInPage = {};
                    //换出商品中添加套装明细
                    scope.suitOutPage = {};
                    //商品信息（换出商品）
                    this.productOutPageSet(scope.productOutPage,scope);
                    //商品信息（退入商品）
                    this.productInPageSet(scope.productInPage,scope);
                    //套装信息（退入商品）
                    this.suitInPageSet(scope.suitInPage,scope);
                    //套装信息（换入商品）
                    this.suitOutPageSet(scope.suitOutPage,scope);
                    //存储已经选中的订单明细
                    scope.orderListHasChosed = [];
                    //存储已经选中的订单
                    scope.orderChosed = {};
                    //已经选中的商品明细
                    scope.orderListDetailsHasChosed  = [];
                    //已经选中的商品明细（退入商品）
                    scope.orderList1DetailsHasChosed  = [];
                    scope.orderInListDetailsHasChosed  = [];
                    //套装列
                    scope.suitColumn = configData.suitColumn;
                    //套装数据
                    scope.suitData = [];
                    //选中的将要转入换货单的商品
                    scope.intoSwapOutProduct = [];

                    scope.productDetailsColumn = configData.productDetailsColumn;

                    //商品列表列配置
                    scope.productColumn = configData.productColumn;

                    //退入商品列信息配置
                    scope.productInColumn = configData.productInColumn;
                    //换出商品列信息配置
                    scope.productOutColumn = configData.productOutColumn;
                    //被删除的退入商品信息（修改时使用）
                    scope.deleteDetails = [];
                    //被删除的换出商品信息（修改时使用）
                    scope.deleteOutDetails = [];
                    //获取所有信息，并向后台提交的数据
                    scope.formDataChosed = {
                        //新增商品信息
                        products : [],
                        //换出商品
                        swapOutProduct : [],
                        //退入商品
                        swapInProduct : []
                    };
                    //当前选中或填写的信息，暂时保存
                    scope.tmpData = {
                        //支付明细
                        products : {},
                        //收货信息
                        swapOutProduct : {},
                        swapOut1Product : {},
                        //商品明细(退入商品)
                        productsInDetails : [],
                        //商品明细（换出商品）
                        productsOutDetails : [],
                        //套装信息
                        suitData : []
                    };

                    //下拉框配置
                    this.selectConfig(scope);

                    //搜索订单的条件
                    scope.formData = {};

                    //订单列初始化
                    scope.orderListColumn = configData.orderListColumns;
                    scope.orderListData = [];

                    //订单明细
                    scope.orderDetails = [];
                    scope.orderDetailsColumn = configData.orderDetailsColumn;

                    //是否是修改退款单
                    if(scope.refundOrderid){
                        addQorEGoodsInterfaceDeal.getReturnBillById(scope,scope.refundOrderid);
                    }


                    //店铺信息初始化
                    addQorEGoodsInterfaceDeal.getAllShopsDeal(scope);
                    //仓库信息初始化
                    addQorEGoodsInterfaceDeal.getAllWareHouseDeal(scope);
                    //快递信息初始化
                    addQorEGoodsInterfaceDeal.getAllExpressInfoDeal(scope);
                    //获取退货类型
                    addQorEGoodsInterfaceDeal.getBasciInfoDeal(scope);
                },
                //下拉框配置
                selectConfig : function (scope) {
                    //下拉框数据配置
                    scope.pullSelect = {
                        //退入仓库下拉配置
                        inWarehouse : {
                            isshow:false,
                            info:[],
                            validate : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.WarehouseInId = obj.id;
                                scope.WarehouseInCode = obj.code;
                                scope.WarehouseInName = obj.name;
                            }
                        },
                        //换出仓库下拉配置
                        outWarehouse : {
                            isshow:false,
                            info:[],
                            validate : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.WarehouseOutId = obj.id;
                                scope.WarehouseOutCode =  obj.code;
                                scope.WarehouseOutName = obj.name;
                            }
                        },
                        //店铺下拉菜单
                        store : {
                            objName : {},
                            isshow:false,
                            info:[],
                            validate : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.StoreId = obj.id;
                                scope.StoreName = obj.name;
                            }
                        },
                        //退回快递下拉列表
                        express : {
                            isshow:false,
                            info:[],
                            onChange: function(obj,index){	//点击之后的回调
                                scope.ExpressName = obj.name;
                            }
                        },
                        //退货类型
                        returnGoodsType:{
                            isshow:false,
                            info:[],
                            validate : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.returnGoodsType = obj.id;
                                scope.returnGoodsName = obj.name;
                            }
                        },
                        //退货方式
                        RefundWay:{
                            isshow:false,
                            info:addQorEGoodsDomOperate.changeStyle(APP_MENU.returnMethod),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.RefundWay = obj.id;
                            }
                        },
                        //退款方式
                        returnType : {
                            isshow:false,
                            info:addQorEGoodsDomOperate.changeStyle(APP_MENU.refundWay),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.RefundWay = obj.id;
                            }
                        }
                    };

                },
                //将枚举类型的变量转化为下拉菜单可用的类型
                changeStyle : function (obj){
                    var tmpData = [];
                    var data ={};
                    for(var item in obj){
                        data['id'] = item;
                        data['name'] = obj[item];
                        tmpData.push(data);
                        data = {};
                    }
                    return tmpData;
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        addQorEGoodsInterfaceDeal.QueryOrderLists(scope, function () {});
                    });
                },
                //换出商品分页配置
                productOutPageSet : function (pageSetting,scope){
                    orderManagePublicService.orderManagerPublicFunction.pageSet(pageSetting, function () {
                        addQorEGoodsInterfaceDeal.getProductOutDeal(scope);
                    });
                },
                //退入商品分页
                productInPageSet : function (pageSetting,scope) {
                    orderManagePublicService.orderManagerPublicFunction.pageSet(pageSetting, function () {
                        addQorEGoodsInterfaceDeal.getProductInDeal(scope);
                    });
                },
                //新增套装明细分页（退入商品）
                suitInPageSet : function (pageSetting,scope) {
                    orderManagePublicService.orderManagerPublicFunction.pageSet(pageSetting, function () {
                        addQorEGoodsInterfaceDeal.getInSuitDeal(scope);
                    });
                },
                //新增套装明细分页（换出商品）
                suitOutPageSet : function (pageSetting,scope) {
                    orderManagePublicService.orderManagerPublicFunction.pageSet(pageSetting, function () {
                        addQorEGoodsInterfaceDeal.getOutSuitDeal(scope);
                    });
                }
            };


            //接口调用处理
            var addQorEGoodsInterfaceDeal = {

                //获取订单列表
                QueryOrderLists : function (scope,callback) {
                    addQorEGoodsInterface.getOrderList(scope, function (res) {
                        if(res.success){
                            scope.paginationConf.totalItems = res.total;
                            scope.orderListData = res.data;
                            //有订单信息，默认获取第一条的订单明细
                            if(res.data.length > 0 ){
                                addQorEGoodsInterfaceDeal.getOrderDetailsDeal(scope,res.data[0].orderid);
                            }
                            callback();
                        }else{
                            toolsService.alertError('订单列表获取出错');
                        }
                    });
                },

                //获取订单明细
                getOrderDetailsDeal : function (scope,orderId){
                    addQorEGoodsInterface.getOrderByOrderid(scope,orderId ,function (res) {
                        if(res.success){
                            //去掉全选标志
                            scope.orderDetailscheckAll = false;
                            //订单商品明细
                            scope.orderDetails = res.data.details ?  res.data.details : [];
                            //订单信息
                            scope.orderInfo = res.data;
                            //每条商品明细的应退金额、规格id字段修改
                            for(var i = 0,j = scope.orderDetails.length;i < j;i++){
                                scope.orderDetails[i].retailprice = scope.orderDetails[i].amountactual;
                                scope.orderDetails[i].skuid = scope.orderDetails[i].productskuid;
                                scope.orderDetails[i].retailprice = scope.orderDetails[i].amountactual;
                                scope.orderDetails[i].refundamount = scope.orderDetails[i].amountactual;
                                scope.orderDetails[i].actualamount = scope.orderDetails[i].amountactual;
                            }
                        }else{
                            toolsService.alertError('订单信息获取出错！');
                        }
                    });
                },

                //根据搜索条件获取订单列表
                getOrderByConditionDeal : function (scope,formData){
                    addQorEGoodsInterface.getOrderByCondition(scope,formData, function (res) {
                        if(res.success){
                            scope.orderListData = res.data;
                            scope.paginationConf.totalItems = res.total;
                            for(var item in scope.orderDetails){
                                delete scope.orderDetails[item];
                            }
                        }else{
                            alert('订单列表获取出错');
                        }
                    });
                },

                //获取商品信息（换出商品）
                getProductOutDeal : function (scope){
                    addQorEGoodsInterface.getProductInfo(scope,scope.productOutPage,scope.productOutCode, function (res) {
                        if(res.success){
                            scope.productOutPage.paginationConf.totalItems = res.total;
                            scope.tmpData.swapOutProduct = res.data; //如果有商品信息，默认获取第一条商品的商品明细
                            if(res.data.length > 0){ //要获取商品明细的商品信息
                                scope.outProductSkuid = res.data[0].skuid;
                                addQorEGoodsInterfaceDeal.getProductOutDetails(scope,res.data[0].code);
                            }
                        }else{
                            toolsService.alertError('商品信息获取失败！');
                        }
                    });
                },
                //获取商品信息（退入商品）
                getProductInDeal : function (scope) {
                    addQorEGoodsInterface.getProductInfo(scope,scope.productInPage,scope.productInCode, function (res) {
                        if(res.success){
                            //全选标志去除
                            scope.productInCheckAll = false;
                            //设置总页数
                            scope.productInPage.paginationConf.totalItems = res.total;
                            scope.tmpData.swapOut1Product = res.data;
                            //如果有商品信息，默认获取第一条商品的商品明细
                            if(res.data.length > 0){
                                //要获取商品明细的商品信息
                                scope.inProductSkuid = res.data[0].skuid;
                                addQorEGoodsInterfaceDeal.getProductInDetails(scope,res.data[0].code);
                            }
                        }else{
                            toolsService.alertError('商品信息获取失败！');
                        }
                    });
                },
                //根据商品获取商品明细（退入商品）
                getProductInDetails : function (scope,val) {
                    addQorEGoodsInterface.getProductDetails(scope,val,function (res) {
                        if(res.success){
                            //将商品明细添加仓库名信息
                            for(var i = 0,j = res.data.length;i < j;i++){
                                res.data[i].warehousename = scope.wareHouseInfo[res.data[i].warehouseid] ? scope.wareHouseInfo[res.data[i].warehouseid].name : '';
                            }
                            scope.tmpData.productsInDetails = res.data;
                        }else{
                            toolsService.alertError('商品明细获取失败！');
                        }
                    });
                },
                //根据商品获取商品明细（换出商品）
                getProductOutDetails : function (scope,val) {
                    addQorEGoodsInterface.getProductDetails(scope,val,function (res) {
                        if(res.success){
                            //将商品明细添加仓库名信息
                            for(var i = 0,j = res.data.length;i < j;i++){
                                res.data[i].warehousename = scope.wareHouseInfo[res.data[i].warehouseid] ? scope.wareHouseInfo[res.data[i].warehouseid].name : '';
                            }
                            scope.tmpData.productsOutDetails = res.data;
                        }else{
                            toolsService.alertError('商品明细获取失败！');
                        }
                    });
                },
                //获取套装信息（退入商品）
                getInSuitDeal : function (scope) {
                    addQorEGoodsInterface.getSuit(scope,scope.suitInPage,scope.suitInCode, function (res) {
                        if(res.success){
                            //去除全选标志
                            scope.suitInChoseAll = false;
                            //设置总页数
                            scope.suitInPage.paginationConf.totalItems = res.total;
                            scope.tmpData.suitInData = res.data;
                        }else{
                            toolsService.alertError('套装信息获取出错');
                        }
                    });
                },
                //获取套装信息（换出商品）
                getOutSuitDeal : function (scope) {
                    addQorEGoodsInterface.getSuit(scope,scope.suitOutPage,scope.suitOutCode, function (res) {
                        if(res.success){
                            //去除全选标志
                            scope.suitOutChoseAll = false;
                            //设置总页数
                            scope.suitOutPage.paginationConf.totalItems = res.total;
                            scope.tmpData.suitOutData = res.data;
                        }else{
                            toolsService.alertError('套装信息获取出错');
                        }
                    });
                },

                ////套装信息
                //getSuitDeal : function (scope,type){
                //    addQorEGoodsInterface.getSuit(scope, function (res) {
                //        if(res.success){
                //            if(type == 'out'){
                //                scope.suitPage.paginationConf.totalItems = res.total;
                //                scope.tmpData.suitData = res.data;
                //            }else if(type == 'in'){
                //                scope.suitInPage.paginationConf.totalItems = res.total;
                //                scope.tmpData.suitInData = res.data;
                //            }
                //        }else{
                //            alert('订单列表获取出错');
                //        }
                //    });
                //},
                
                //店铺信息
                getAllShopsDeal : function (scope) {
                    addQorEGoodsInterface.getAllShops(scope, function (res) {
                        if(res.success){
                            scope.storeInfo = klwTool.arrayToJson(res.data,"id");
                            scope.pullSelect.store.info = res.data;
                            scope.pullSelect.store.objName = {name:res.data.storename,id:res.data.storeid};
                        }else{
                            alert('店铺信息获取出错');
                        }
                    });
                },

                //仓库信息
                getAllWareHouseDeal : function (scope){
                    addQorEGoodsInterface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            scope.pullSelect.inWarehouse.info = res.data;
                            scope.pullSelect.outWarehouse.info = res.data;
                            //转变数组为以id为键值的数组
                            scope.wareHouseInfo = klwTool.arrayToJson(res.data,"id");
                        }else{
                            alert('仓库出错');
                        }
                    });
                },
                //快递信息
                getAllExpressInfoDeal : function (scope){
                    addQorEGoodsInterface.getAllExpressInfo(scope, function (res) {
                        if(res.success){
                            scope.pullSelect.express.info = res.data;
                            //把快递信息按id分类
                            scope.ExpressInfo = klwTool.arrayToJson(res.data.clone(),'id');
                        }else{
                            alert('快递出错')
                        }
                    });
                },
                //添加退换货订单
                addReturnOrderDeal : function (scope,data,callback) {
                    addQorEGoodsInterface.addReturnOrder(scope,data, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('添加成功！');
                        }else{
                            toolsService.alertError('添加失败！');
                        }
                        callback();
                    });
                },
                //获取退换类型
                getBasciInfoDeal : function (scope){
                    addQorEGoodsInterface.getBasciInfo(scope, function (res) {
                        if(res.success){
                            scope.pullSelect.returnGoodsType.info = res.data;
                        }else{
                            alert('退换类型出错');
                        }
                    });
                },
                //获取订单信息
                getOrderByOrderidDeal : function(scope,orderid){
                    addQorEGoodsInterface.getOrderByOrderid(scope,orderid, function (res) {
                        if(res.success){
                            scope.order = res.data;
                            for(var i = 0,j = res.data.details.length;i < j;i++){
                                res.data.details[i].code = res.data.details[i].skucode;
                                res.data.details[i].description = res.data.details[i].skuname;
                                res.data.details[i].retailprice = res.data.details[i].amountactual;
                                res.data.details[i].refundamount = res.data.details[i].amountactual;
                            }
                            scope.formDataChosed.swapInProduct = res.data.details;
                            //设置默认退出仓库、默认换出仓库和店铺信息
                            addQorEGoodsInterfaceDeal.setDefaultWarseHouse(scope,scope.order);
                        }else{
                            toolsService.alertError('获取订单信息失败！');
                        }
                    });
                },
                //设置默认退入仓库、默认换出仓库和店铺信息
                setDefaultWarseHouse : function (scope,obj) {
                    var id,name,code;
                    //店铺信息
                    scope.pullSelect.store.setValue({id : obj.storeid,name : obj.storename});
                    scope.StoreId = obj.storeid;
                    scope.StoreName = obj.storename;
                    //默认退入仓库信息
                    if(scope.storeInfo[obj.storeid].storeSetting.defaultinwarehouseid){
                        id = scope.storeInfo[obj.storeid].storeSetting.defaultinwarehouseid;
                        name = scope.wareHouseInfo[scope.storeInfo[obj.storeid].storeSetting.defaultinwarehouseid].name;
                        code = scope.wareHouseInfo[scope.storeInfo[obj.storeid].storeSetting.defaultinwarehouseid].code;
                        scope.pullSelect.inWarehouse.setValue({
                            id :  id,
                            name : name
                        });
                        scope.WarehouseInId = id;
                        scope.WarehouseInCode = code;
                        scope.WarehouseInName = name;
                    }
                    //默认退出仓库
                    if(scope.storeInfo[obj.storeid].storeSetting.defaultoutwareshouseid){
                        id = scope.storeInfo[obj.storeid].storeSetting.defaultoutwareshouseid;
                        name = scope.wareHouseInfo[scope.storeInfo[obj.storeid].storeSetting.defaultoutwareshouseid].name;
                        code = scope.wareHouseInfo[scope.storeInfo[obj.storeid].storeSetting.defaultoutwareshouseid].code;
                        scope.pullSelect.outWarehouse.setValue({
                            id :  id,
                            name : name
                        });
                        scope.WarehouseOutId = id;
                        scope.WarehouseOutCode =  name;
                        scope.WarehouseOutName = code;
                    }
                },
                //获取套装明细(退入商品)
                getInSuitDetails : function (scope,value,list) {
                    addQorEGoodsInterface.getCombinedProductDetails(scope,value, function (res) {
                       if(res.success){
                           //字段转换（规格编码，规格名称，应退金额，实退金额）
                           for(var i = 0,j = res.data.length;i <j;i++){
                               res.data[i].code = res.data[i].skucode;
                               res.data[i].description = res.data[i].skuname;
                               res.data[i].retailprice = res.data[i].saleprice;
                           }
                           //将套装明细添加到套装信息当中
                           list.details = res.data;
                       }else{
                           toolsService.alertSuccess('获取套装明细失败！');
                       }
                    });
                },
                //获取套装明细(换出商品)
                getOutSuitDetails : function (scope,value,list) {
                    addQorEGoodsInterface.getCombinedProductDetails(scope,value, function (res) {
                        if(res.success){
                            //字段转换（规格编码，规格名称，应退金额，实退金额）
                            for(var i = 0,j = res.data.length;i <j;i++){
                                res.data[i].code = res.data[i].skucode;
                                res.data[i].description = res.data[i].skuname;
                                res.data[i].retailprice = res.data[i].saleprice;
                            }
                            //将套装明细添加到套装信息当中
                            list.details = res.data;
                        }else{
                            toolsService.alertSuccess('获取套装明细失败！');
                        }
                    });
                },
                //根据id获取退款单详情
                getReturnBillById : function(scope,id){
                    addQorEGoodsInterface.getReturnBillById(scope,id, function (res) {
                        if(res.success){
                            //退货单信息
                            scope.refundInfo = res.data;
                            //订单信息
                            scope.order = {};
                            //收货信息
                            scope.order.subOrder = {};
                            //变换对应字段
                            //店铺信息
                            scope.pullSelect.store.setValue({id : scope.refundInfo.storeid,name : scope.refundInfo.storename});
                            scope.StoreId = scope.refundInfo.storeid;
                            scope.StoreName = scope.refundInfo.storename;
                            //退货方式
                            scope.pullSelect.RefundWay.setValue({id : scope.refundInfo.returnstyle});
                            scope.RefundWay = scope.refundInfo.returnstyle;
                            //退款方式
                            scope.pullSelect.returnType.setValue({id : scope.refundInfo.refundway});
                            scope.RefundWay = scope.refundInfo.refundway;
                            //退货类型
                            scope.pullSelect.returnGoodsType.setValue({id : scope.refundInfo.returnordertypeid});
                            scope.returnGoodsType = scope.refundInfo.returnordertypeid;
                            scope.returnGoodsName = scope.refundInfo.returnordertypename;
                            //收货人
                            scope.order.subOrder.consignee = scope.refundInfo.consigneename;
                            //补差价金额
                            scope.OffsetAmount = scope.refundInfo.offsetamount;
                            //手机号码
                            scope.order.subOrder.mobile = scope.refundInfo.mobile;
                            //收货地址
                            scope.order.subOrder.address = scope.refundInfo.consigneeaddress;
                            //快递单号
                            scope.ExpressNo = scope.refundInfo.expressno;
                            //备注
                            scope.order.note = scope.refundInfo.note;
                            //订单编号
                            scope.order.code = scope.refundInfo.code;
                            //平台订单号
                            scope.order.tradeid = scope.refundInfo.tradeid;
                            //退入商品信息
                            scope.formDataChosed.swapInProduct = scope.refundInfo.details;
                            //换出商品信息
                            scope.formDataChosed.swapOutProduct = scope.refundInfo.outDetails;
                            //会员昵称
                            scope.order.customername = scope.refundInfo.membername;
                            //会员id
                            scope.order.customerid = scope.refundInfo.memberid;
                            //会员编码
                            scope.order.customercode = scope.refundInfo.membercode;
                            //修改退入商品字段
                            for(var i = 0,j = scope.formDataChosed.swapInProduct.length;i < j;i++){
                                scope.formDataChosed.swapInProduct[i].code = scope.formDataChosed.swapInProduct[i].skucode;
                                scope.formDataChosed.swapInProduct[i].description = scope.formDataChosed.swapInProduct[i].skuname;
                                scope.formDataChosed.swapInProduct[i].retailprice = scope.formDataChosed.swapInProduct[i].actualamount;
                            }
                            //修改换出商品字段
                            for(var x = 0,y = scope.formDataChosed.swapOutProduct.length;x < y;x++){
                                scope.formDataChosed.swapOutProduct[x].code = scope.formDataChosed.swapOutProduct[x].skucode;
                                scope.formDataChosed.swapOutProduct[x].description = scope.formDataChosed.swapOutProduct[x].skuname;
                                scope.formDataChosed.swapOutProduct[x].retailprice = scope.formDataChosed.swapOutProduct[x].actualamount;
                            }
                            //获取对应订单信息
                            //addQorEGoodsInterfaceDeal.getOrderByReturnBill(scope,scope.refundInfo.salesorderid);
                            //获取日志信息
                            addQorEGoodsInterfaceDeal.getLog(scope,scope.refundInfo.id);
                        }else{
                            toolsService.alertError('获取退款单信息失败！');
                        }
                    })
                },
                //根据退款单获取订单信息
                getOrderByReturnBill : function (scope,value){
                    addQorEGoodsInterface.getOrderByReturnBill(scope,value, function (res) {
                        //这里不用判断失败的情况，有时候匹配不到对应的订单
                        if(res.success){
                            scope.order = res.data;
                        }
                    });
                },
                //检测退换货单是否存在
                orderIsExist : function (scope,tradeid,sucCallback,failCallback) {
                    addQorEGoodsInterface.orderIsExist(scope,tradeid, function (res) {
                        if(res.success){
                            if(res.data){
                                toolsService.alertConfirm({
                                    "msg":"该订单已存在退换货单，是否继续？",
                                    okBtn : function(index, layero){
                                        sucCallback()
                                    },
                                    cancelBtn :  function(index, layero){
                                        failCallback();
                                    }
                                });
                            }else{
                                sucCallback()
                            }
                        }
                    });
                },
                //获取操作日志
                getLog : function (scope,id){
                    addQorEGoodsInterface.getLog(scope,id, function (res) {
                        if(res.success){
                            scope.returnGoodsLog = res.data;
                        }else{
                            toolsService.alertError('获取日志信息失败！');
                        }
                    });
                }
            };

            //接口调用
            var addQorEGoodsInterface = {

                /**
                 * 获取套装明细信息
                 * @param scope
                 * @param value 规格id
                 * @param callback
                 */
                getCombinedProductDetails : function (scope,value,callback) {
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
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取订单列表
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
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"IsObsolete",
                                "Name":"IsObsolete",
                                "Value":false,
                                "Children":[]
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
                 * 获取订单明细
                 * @param scope
                 * @param orderId 订单id
                 * @param callback
                 */
                //getOrderDetails : function (scope,orderId,callback){
                //    var url = '/SalesOrder/SalesOrder/GetSingle';
                //    var paramObj = ApiService.getBasicParamobj();
                //    paramObj.orderid = orderId;
                //    var orderDetails = ApiService.postLoad(url,paramObj);
                //    orderDetails.then(function (res) {
                //        callback(res);
                //    });
                //},

                /**
                 * 获取搜索的订单信息
                 * @param scope
                 * @param formData 要查询的数据
                 * @param callback
                 */
                getOrderByCondition : function (scope, formData, callback) {
                    var url = '/SalesOrder/SalesOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body =  {
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan": "00:00:00.203",
                        "SeletedCount": 0,
                        "Data": [],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    var data = [];
                    for(var item in formData){
                        if(item == 'Code'){
                            data.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": formData[item],
                                "Children": []
                            });
                        }else if(item == 'TradeId'){
                            data.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TradeId",
                                "Name": "TradeId",
                                "Value": formData[item],
                                "Children": []
                            });
                        }else if(item == 'CustomerName'){
                            data.push({
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CustomerName",
                                "Name": "CustomerName",
                                "Value": formData[item],
                                "Children": []
                            });
                        }else if(item  == 'DispatchCode'){
                            data.push({
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DispatchCode",
                                "Name": "DispatchCode",
                                "Value": formData[item],
                                "Children": []
                            });
                        }else if(item == 'Mobile'){
                            data.push({
                                "OperateType": 0,
                                "LogicOperateType": 1,
                                "AllowEmpty": false,
                                "Children": [
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 0,
                                        "AllowEmpty": false,
                                        "Field": "sub.Mobile",
                                        "Name": "Mobile",
                                        "Value": formData[item],
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 0,
                                        "AllowEmpty": false,
                                        "Field": "sub.Telephone",
                                        "Name": "Telephone",
                                        "Value": formData[item],
                                        "Children": []
                                    }
                                ]
                            });
                        }
                    }
                    data.push({
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsObsolete",
                        "Name": "IsObsolete",
                        "Value": false,
                        "Children": []
                    });
                    paramObj.body.Data = data;
                    paramObj.body = JSON.stringify(paramObj.body);
                    var orderDetails = ApiService.postLoad(url,paramObj);
                    orderDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品信息
                 * @param scope
                 * @param pageSetting 分页信息
                 * @param procode 商品编码
                 * @param callback
                 */
                getProductInfo : function (scope,pageSetting,procode,callback){
                    var url = '/Product/ProductSku/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":pageSetting.paginationConf.currentPage,
                        "PageSize":pageSetting.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Code",
                            "Name": "procode",
                            "Value": procode,
                            "Children": []
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.Status",
                            "Name":"skustatus",
                            "Value":1,
                            "Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.IsCombined",
                            "Name":"IsCombined",
                            "Value":"0",
                            "Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"pro.Status",
                            "Name":"prostatus",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var products = ApiService.postLoad(url,paramObj);
                    products.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品详细数据
                 * @param scope
                 * @param val 要获取的商品id
                 * @param callback
                 */
                getProductDetails : function (scope,val,callback) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Code",
                        "Name":"Code",
                        "Value":val,
                        "Children":[]
                    }]);
                    var orderDetails = ApiService.postLoad(url,paramObj);
                    orderDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取套装信息
                 * @param scope
                 * @param pageSetting 分页设置
                 * @param code 套装代码
                 * @param callback
                 */
                getSuit : function (scope,pageSetting,code,callback){
                    var url = '/Product/CombinedProduct/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":pageSetting.paginationConf.currentPage,
                        "PageSize":pageSetting.paginationConf.itemsPerPage,
                        "Timespan":"00:00:01.318",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType": 8,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Code",
                            "Name": "Code",
                            "Value": code,
                            "Children": []
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Status",
                            "Name":"Status",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var suit = ApiService.postLoad(url,paramObj);
                    suit.then(function (res) {
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
                 * 新增退换货单
                 * @param scope
                 * @param data 新增的退换货单数据
                 * @param callback
                 */
                addReturnOrder : function(scope,data,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/Insert';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(data);
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 退换货类型
                 * @param scope
                 * @param callback
                 */
                getBasciInfo : function (scope,callback) {
                    var url = '/BasicInformation/GeneralClassiFication/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "Timespan":"00:00:00.070",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"ClassiFicationType",
                            "Name":"ClassiFicationType",
                            "Value":1,"Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 通过订单id来获取订单信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getOrderByOrderid : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = orderid;
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 根据id获取退款单信息
                 * @param scope
                 * @param id 退款单id
                 * @param callback
                 */
                getReturnBillById : function (scope,id,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/GetGingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = id;
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 通过退款单获取订单的信息
                 * @param scope
                 * @param value 订单id
                 * @param callback
                 */
                getOrderByReturnBill : function (scope,value,callback) {
                    var url = '/SalesOrder/SalesOrder/GetWithDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"OrderId",
                        "Name":"OrderId",
                        "Value":value,
                        "Children":[]
                    }]);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 检测退换货单是否已经存在
                 * @param scope
                 * @param tradeid 平台订单号
                 * @param callback
                 */
                orderIsExist : function (scope,tradeid,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/OutOrderExist';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(tradeid);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取操作日志
                 * @param scope
                 * @param id 退换货单id
                 * @param callback
                 */
                getLog : function (scope,id,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/GetLogs';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                addQorEGoodsDomOperate : addQorEGoodsDomOperate,
                addQorEGoodsInterfaceDeal : addQorEGoodsInterfaceDeal
            }

        }
    ]);