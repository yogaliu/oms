/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('orderDetailService',['ApiService','toolsService','orderManagePublicService','APP_MENU','orderListService','validateService',
        function (ApiService,toolsService,orderManagePublicService,APP_MENU,orderListService,validateService) {
           //基本配置信息
            var configData = {
                //操作日志列配置
                logColumn : [
                    {name : '创建人',tag : 'createusername'},
                    {name : '时间',tag : 'createdate'},
                    {name : '内容',tag : 'note'}
                ],
                //商品明细列配置
                productDetailsColumn : [
                    {name : '操作',tag : ''},
                    {name : '特殊标识',tag : 'tips'},
                    {name : '状态',tag : 'status'},
                    {name : '商品类型',tag : 'detailtype'},
                    {name : '标记名称',tag : 'tagname'},
                    {name : '退款状态',tag : 'refundstatus'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '重量',tag : 'weight'},
                    {name : '预售日期',tag : 'preshipmentdate'},
                    {name : '销售价',tag : 'priceoriginal'},
                    {name : '可配货数',tag : 'canallocation'},
                    {name : '查看库存',tag : '<a>'},
                    {name : '实际售价',tag : 'priceselling'},
                    {name : '销售金额',tag : 'amount'},
                    {name : '结算金额',tag : 'amountactual'},
                    {name : '补发金额',tag : 'ReissueActual'}
                ],
                //平台信息列配置
                platformColumn : [
                    {name : '平台商品编码',tag : 'num_iid'},
                    {name : '平台商品名称',tag : 'title'},
                    {name : '平台数量',tag : 'num'},
                    {name : '平台规格编码',tag : 'sku_id'},
                    {name : '平台商家规格编码',tag : 'outer_sku_id'},
                    {name : '平台规格名称',tag : 'sku_properties_name'}
                ],
                //配货单信息列配置
                allocationColumn : [
                    {name : '',tag : ''},
                    {name : '操作',tag : ''},
                    {name : '合单',tag : 'ismerger'},
                    {name : '配货单号',tag : 'dispatchordercode'},
                    {name : '状态',tag : 'status'},
                    {name : '发货仓库',tag : 'warehousename'},
                    {name : '配货时间',tag : 'createdate'},
                    {name : '建议快递',tag : 'suggestexpressname'},
                    {name : '发货时间',tag : 'deliverydate'},
                    {name : '发货快递',tag : 'actualexpressname'},
                    {name : '快递单号',tag : 'actualexpressno'},
                    {name : '重量',tag : 'weight'}
                ],
                //配货明细列配置
                allocationsDetailsColumn : [
                    {name : '',tag : ''},
                    {name : '操作',tag : ''},
                    {name : '状态',tag : 'status'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'productskucode'},
                    {name : '规格名称',tag : 'productskuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '仓库编码',tag : 'warehousecode'},
                    {name : '仓库名称',tag : 'warehousename'}
                ],
                //快递明细列配置
                expressColumn : [
                    {name : '快递名称',tag : 'expressname'},
                    {name : '快递编码',tag : 'expressno'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'}
                ],
                //wms状态
                wmsColumn : [
                    {name : '操作人',tag : 'apuser'},
                    {name : '操作名称',tag : 'status'},
                    {name : '操作时间',tag : 'aptime'}
                ],
                //库存列表
                repertoryColumn : [
                    {name : '仓库名称',tag : 'warehousename'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '品牌',tag : 'brand'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '库存数',tag : 'quantity'},
                    {name : '已配货数',tag : 'dispatchedQuantity'},
                    {name : '订单占用数',tag : 'unDispatchedQuantity'},
                    {name : '调拨占用数',tag : 'allotQuantity'},
                    {name : '唯品占用数',tag : 'vipQuantity'},
                    {name : '可用数',tag : 'canUseQuantity'},
                    {name : '可销数',tag : 'canSaleQuantity'},
                    {name : '在途数',tag : 'transitTotalQuantity'}
                ],
                //订单占用明细
                orderOccupyColumn : [
                    {name : '订单编号',tag : 'code'},
                    {name : '平台订单号',tag : 'tradeId'},
                    {name : '商品名称',tag : 'productName'},
                    {name : '规格名称',tag : 'skuName'},
                    {name : '占用数量',tag : 'quantity'},
                    {name : '已配货',tag : 'dispatched'}
                ]
            };

            //dom操作
            var orderDetailDomOperate = {
                //初始化
                domInit : function (scope,orderid) {
                    //表单初始化验证
                    validateService.initValidate('#orderDetail');
                    //tab栏切换，默认为first页面
                    scope.tab = 'first';
                    //支付明细
                    scope.payDetails = [];
                    //支付方式
                    scope.payType = APP_MENU.payment;
                    //发票信息
                    scope.invoice = [];
                    //收货信息
                    scope.goodsReception = {};
                    //操作日志
                    scope.logColumn = configData.logColumn;
                    //商品明细列配置
                    scope.productDetailsColumn = configData.productDetailsColumn;
                    //商品详细信息
                    scope.productDetails = [];
                    //平台信息列表
                    scope.platformColumn = configData.platformColumn;
                    //选中的商品信息
                    scope.productChosed = [];
                    //配货信息
                    scope.allocation = [];
                    //配货单信息列配置
                    scope.allocationColumn = configData.allocationColumn;
                    //选中的配货信息
                    scope.allocationChosed = [];
                    //弹出输入提示框配置
                    scope.modal = {
                        title : '请输入取消原因',
                        confirm : ''
                    };
                    //配货信息明细
                    scope.AllocationsDetails = [];
                    //配货信息明细列配置
                    scope.allocationsDetailsColumn = configData.allocationsDetailsColumn;
                    //快递明细列配置
                    scope.expressColumn = configData.expressColumn;
                    //快递明细数据
                    scope.expressInfo = [];
                    //wms列配置
                    scope.wmsColumn  = configData.wmsColumn;
                    //wms数据
                    scope.wmsData = [];
                    //点击选中的商品信息
                    scope.productClickChose = {};

                    //批量取消退款是否可以操作标志
                    scope.productCancleRefund = false;

                    //下拉框配置
                    this.selectConfig(scope);

                    //库存列表分页配置
                    this.pageSet(scope);

                    //商品类型
                    scope.productType = APP_MENU.productType;
                    scope.preOrderType = APP_MENU.preOrderType;

                    //库存列配置
                    scope.repertoryColumn = configData.repertoryColumn;
                    //库存明细列配置
                    scope.orderOccupyColumn = configData.orderOccupyColumn;

                    //订单标记
                    orderManagePublicService.orderManagerPublicInterface.getOrderLabel(scope, function (data) {
                        scope.label = data;
                        scope.pullInfo.orderLabel.info = data;
                    });
                    //先获取订单信息后，再获取与订单相关的信息
                    ApiService.listenAll(function (deffer) {
                        //获取订单信息
                        orderDetailInterfaceDeal.getOrderInfoById(scope,orderid,deffer);
                    }).then(function (result) {
                        //获取城市id
                        orderDetailInterfaceDeal.getCountryCodeDeal(scope);
                        //获取支付明细信息
                        orderDetailInterfaceDeal.getPayDetailsDeal(scope,orderid);
                        //商品信息
                        orderDetailInterfaceDeal.getProductDeal(scope,orderid);
                        //发票信息
                        orderDetailInterfaceDeal.getInvoiceInfoDeal(scope,orderid);
                        //仓库信息
                        orderDetailInterfaceDeal.getAllWareHouse(scope);
                    });
                    //查询所有国家信息
                    orderDetailInterfaceDeal.regionCheck(scope,1,'00000000-0000-0000-0000-000000000000', function (data) {
                        //设置选择国家的下拉框
                        scope.pullInfo.country.info = data;
                    });
                },
                selectConfig : function (scope){
                    //下拉框配置
                    scope.pullInfo = {
                        //发票下拉框
                        invoice : {
                            isshow:false,
                            validate : true,
                            info:this.changeData(APP_MENU['invoiceType']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.InvoiceType = obj.id;
                            }
                        },
                        //订单标记下拉框
                        orderLabel : {
                            isshow:false,
                            info:[],
                            onChange: function(obj,index){	//点击之后的回调
                                var DetailsObj = scope.productDetails;
                                var ids = [];
                                //判断是否有商品被选中
                                for(var i =0,j = DetailsObj.length;i < j;i++){
                                    if(DetailsObj[i].trShow){
                                        ids.push(DetailsObj[i].detailid);
                                    }
                                }
                                if(ids.length < 1){
                                    toolsService.alertMsg('请先选择商品!');
                                }else{
                                    orderDetailInterfaceDeal.addTagDeal(scope,ids,scope.order.orderid,obj.name);
                                }
                                //初始化下拉框
                                scope.pullInfo.orderLabel.init();
                            }
                        },
                        //选择国家信息
                        country : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取省份信息
                                orderDetailInterfaceDeal.regionCheck(scope,2,obj.id, function (data) {
                                    scope.pullInfo.province.init();
                                    scope.pullInfo.city.init();
                                    scope.pullInfo.district.init();
                                    scope.pullInfo.province.info = data;
                                    //设置省市区信息
                                    scope.goodsReception.NationalName = obj.name;
                                    scope.goodsReception.NationalId = obj.id;
                                    scope.goodsReception.NationalCode = obj.code;
                                    scope.goodsReception.ProvinceName = '';
                                    scope.goodsReception.ProvinceId = '';
                                    scope.goodsReception.ProvinceCode = '';
                                    scope.goodsReception.CityName = '';
                                    scope.goodsReception.CityId = '';
                                    scope.goodsReception.CityCode = '';
                                    scope.goodsReception.CountyName = '';
                                    scope.goodsReception.CountyId = '';
                                    scope.goodsReception.CountyCode = '';
                                });
                            }
                        },
                        //选择省份
                        province : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取市级信息
                                orderDetailInterfaceDeal.regionCheck(scope,3,obj.id, function (data) {
                                    scope.pullInfo.city.init();
                                    scope.pullInfo.district.init();
                                    scope.pullInfo.city.info = data;
                                    //设置省市区信息
                                    scope.goodsReception.ProvinceName = obj.name;
                                    scope.goodsReception.ProvinceId = obj.id;
                                    scope.goodsReception.ProvinceCode = obj.code;
                                    scope.goodsReception.CityName = '';
                                    scope.goodsReception.CityId = '';
                                    scope.goodsReception.CityCode = '';
                                    scope.goodsReception.CountyName = '';
                                    scope.goodsReception.CountyId = '';
                                    scope.goodsReception.CountyCode = '';
                                });
                            }
                        },
                        //选择市
                        city : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取区级信息
                                orderDetailInterfaceDeal.regionCheck(scope,4,obj.id, function (data) {
                                    scope.pullInfo.district.init();
                                    scope.pullInfo.district.info = data;
                                    //设置省市区信息
                                    scope.goodsReception.CityName = obj.name;
                                    scope.goodsReception.CityId = obj.id;
                                    scope.goodsReception.CityCode = obj.code;
                                    scope.goodsReception.CountyName = '';
                                    scope.goodsReception.CountyId = '';
                                    scope.goodsReception.CountyCode = '';
                                });
                            }
                        },
                        //选择区
                        district :{
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //设置省市区信息
                                scope.goodsReception.CountyName = obj.name;
                                scope.goodsReception.CountyId = obj.id;
                                scope.goodsReception.CountyCode = obj.code;
                            }
                        }
                    };
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        orderDetailInterface.repertoryConfig(scope,scope.productInventoryChose.skucode);
                    });
                },
                //将枚举值转换为下拉框可用数据
                changeData : function (obj) {
                    var ids = [];
                    for(var item in obj){
                        ids.push({
                            id : item,
                            name : obj[item]
                        });
                    }
                    return ids;
                }
            };

            //接口数据处理
            var orderDetailInterfaceDeal = {
                //处理支付明细的数据
                getPayDetailsDeal : function (scope,orderid) {
                    orderDetailInterface.getPayDetails(scope,orderid, function (res) {
                        if(res.success){
                            scope.payDetails = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //发票信息数据
                getInvoiceInfoDeal : function (scope,orderid){
                    orderDetailInterface.getInvoiceInfo(scope,orderid, function (res) {
                        if(res.success){
                            scope.invoice = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //修改收货信息
                changeAddressDeal : function (scope){
                    orderDetailInterface.changeAddress(scope, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('修改成功！');
                            //刷新页面
                            orderDetailInterfaceDeal.getOrderInfoById(scope,scope.orderid);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                        scope.addressInputShow = false;
                    });
                },
                //保存城市的id
                getCountryCodeDeal : function (scope) {
                    orderDetailInterface.getCountryCode(scope, function (res) {
                        if(res.success){
                            scope.regionId = klwTool.arrayToJson(res.data,"code");
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //获取操作日志
                getLogDeal : function (scope,orderid){
                    orderDetailInterface.getLog(scope,orderid, function (res) {
                        if(res.success){
                            scope.logDetails = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //商品信息
                getProductDeal : function (scope,orderid){
                    orderDetailInterface.getProduct(scope,orderid, function (res) {
                        if(res.success){
                            //获取每件商品的可销数
                            for(var i = 0,j = res.data.length;i < j;i++){
                                orderDetailInterfaceDeal.getProductCanSaleDeal(scope,res.data[i].productskuid,scope.order.paydate,scope.order.storeid,res.data[i]);
                            }
                            //去除全选标志
                            scope.productCheckAll = false;
                            //作废恢复默认不可操作
                            scope.productCanObsolete = false;
                            //取消退款恢复默认不可操作
                            scope.productCancleRefund = false;
                            scope.productDetails = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //添加标记
                addTagDeal : function (scope,ids,orderid,tagname) {
                    orderDetailInterface.addTag(scope,ids,tagname, function (res) {
                        if(res.success){
                            orderDetailInterfaceDeal.getProductDeal(scope,orderid);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //作废订单
                obsoleteProductDeal : function (scope,ids,orderid){
                    orderDetailInterface.obsoleteProduct(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('作废成功！');
                            orderDetailInterfaceDeal.getProductDeal(scope,orderid);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //获取配货信息
                getAllocationsDeal : function (scope,id){
                    orderDetailInterface.getAllocations(scope,id, function (res) {
                        if(res.success){
                            //清空全选标志
                            scope.allocationChoseAll = false;
                            scope.allocation = res.data;
                            if(res.data.length > 0){
                                orderDetailInterfaceDeal.getAllocationsDetailsDeal(scope,res.data[0].id);
                                orderDetailInterfaceDeal.getExpressDeal(scope,res.data[0].id);
                                scope.productClickChose = res.data[0];
                            }
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //取消配货
                allocationCancleDeal : function (scope,id,reason,orderid) {
                    orderDetailInterface.allocationCancle(scope,id,reason, function (res) {
                        if(res.success){
                            orderDetailInterfaceDeal.getProductDeal(scope,orderid);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //配货单明细处理
                getAllocationsDetailsDeal : function (scope,id){
                    orderDetailInterface.getAllocationsDetails(scope,id, function (res) {
                        if(res.success){
                            //明细全选标志取消
                            scope.allocationDetailsChoseAll = false;
                            scope.AllocationsDetails = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //取消配货单明细
                cancleAllocationsDetailsDeal : function (scope,id,detailsid,reason){
                    orderDetailInterface.cancleAllocationsDetails(scope,id,detailsid,reason, function (res) {
                        if(res.success){
                            orderDetailInterfaceDeal.getAllocationsDetailsDeal(scope,id);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //快递明细数据处理
                getExpressDeal : function (scope,id){
                    orderDetailInterface.getExpress(scope,id, function (res) {
                        if(res.success){
                            scope.expressInfo = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //获取仓库状态
                getwmsDeal : function (scope,id){
                    orderDetailInterface.getwms(scope,id, function (res) {
                        if(res.success){
                            scope.wmsData = res.data;
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //新增发票信息
                addInvoiceDeal : function (scope,id){
                    orderDetailInterface.addInvoice(scope,id, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('新增成功！');
                            //刷新发票信息一览
                            orderDetailInterfaceDeal.getInvoiceInfoDeal(scope,id);
                            scope.invoiceDetailsShow = false;
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //删除发票明细
                deleteInvoiceDeal : function (scope,id){
                    orderDetailInterface.deleteInvoice(scope,id, function (res) {
                        if(res.success){
                            orderDetailInterfaceDeal.getInvoiceInfoDeal(scope,scope.order.orderid);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //取消退款
                cancleRefundDeal : function (scope,ids) {
                    orderDetailInterface.cancleRefund(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('取消成功！');
                            orderDetailInterfaceDeal.getProductDeal(scope,scope.order.orderid);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //锁定订单
                lockOrderDeal : function (scope,list) {
                    var ids = orderManagePublicService.orderManagerPublicFunction.getOrderId(list,'orderid');
                    orderDetailInterface.lockOrder(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('锁定成功！');
                            orderDetailInterfaceDeal.getOrderInfoById(scope,scope.orderid);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //作废订单
                obsoleteOrderDeal : function (scope,list) {
                    var ids = orderManagePublicService.orderManagerPublicFunction.getOrderId(list,'orderid');
                    orderDetailInterface.obsoleteOrder(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('作废成功！');
                            orderDetailInterfaceDeal.getOrderInfoById(scope,scope.orderid);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //重置状态
                resetOrderStatusDeal : function (scope,list){
                    var ids = orderManagePublicService.orderManagerPublicFunction.getOrderId(list,'orderid');
                    orderDetailInterface.resetOrderStatus(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('重置成功');
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //添加内部标签
                addInsideTagDeal : function (scope,list,message){
                    var tmp = {};
                    tmp[list['orderid']] = list['orderid'];
                    orderDetailInterface.addInsideTag(scope,tmp,message, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('添加成功');
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //获取商品的可销数
                getProductCanSaleDeal : function (scope,skuid,paytime,storeId,obj) {
                    orderDetailInterface.getProductCanSale(scope,skuid,paytime,storeId, function (res) {
                        if(res.success){
                            obj['canallocation'] = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },

                /**
                 * 查看库存
                 * @param scope
                 * @param value
                 * @param flag 在途数量是否加在可销数量上
                 */
                getrepertory : function (scope,value,flag){
                    orderDetailInterface.getrepertory(scope,value, function (res) {
                        if(res.success){
                            //将在途数量加到可销数量上去
                            if(flag){
                                for(var i = 0,j = res.data.length;i < j;i++){
                                    res.data[i].canSaleQuantity += res.data[i].transitTotalQuantity;
                                }
                            }
                            //循环将仓库id变成仓库名还有一些sk下的参数添加到对象上层
                            for(var x = 0,y = res.data.length; x < y;x++){
                                res.data[x].productcode = res.data[x].sku.productcode;
                                res.data[x].productname = res.data[x].sku.productname;
                                res.data[x].code = res.data[x].sku.code;
                                res.data[x].description = res.data[x].sku.description;
                                res.data[x].warehousename = !!scope.wareHouseData[res.data[x].warehouseid] ? scope.wareHouseData[res.data[x].warehouseid].name : '';
                            }
                            //如果库存信息大于0条，则默认展示第一个订单占用明细数据
                            if(res.data.length > 0){
                                orderDetailInterfaceDeal.getOrderOccupy(scope,res.data[0].warehouseid,res.data[0].skuid);
                            }
                            //库存信息
                            scope.repertoryData = res.data;
                            scope.paginationConf.totalItems = res.total;
                            $('.order-list-chose').modal('show');
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //库存信息配置
                repertoryConfig : function (scope,value) {
                    orderDetailInterface.repertoryConfig(scope, function (res) {
                        //在途数量是否加在可销数量上，默认为不可以
                        var flag = false;
                        if(res.success){
                            //库存信息
                            scope.repertoryData = res.data;
                            //在途数和可销数配置
                            if(res.data){//判断是否可以配置
                                //如果条件为假，则在途数可以显示，否则隐藏
                                if(!res.data.enableOnPassage){
                                    //删除在途数
                                    delete scope.repertoryColumn.transitTotalQuantity;
                                }
                                //如果条件为真，可销数的数量要加上在途数
                                if(res.data.calcCanSellWithOnPassage){
                                    flag = true;
                                }
                            }
                            //库存信息
                            orderDetailInterfaceDeal.getrepertory(scope,value,flag);
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //获取订单占用明细
                getOrderOccupy : function (scope,warseid,skuid) {
                    orderDetailInterface.getOrderOccupy(scope,warseid,skuid, function (res) {
                        if(res.success){
                            scope.orderOccupyData = res.data;
                        }else{
                            alert('获取订单占用明细失败');
                        }
                    });
                },
                //获取所有仓库信息
                getAllWareHouse : function (scope) {
                    orderDetailInterface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            scope.wareHouseData = klwTool.arrayToJson(res.data,'id');
                        }else{
                            alert('获取订单占用明细失败');
                        }
                    });
                },
                //获取订单信息
                getOrderInfoById : function (scope,id,deffer) {
                    orderDetailInterface.getOrderInfoById(scope,id, function (res) {
                        if(res.success){
                            deffer ? deffer.resolve() : '';
                            //操作权限检查
                            scope.operateCheck.orderStatusCheck(res.data);
                            scope.order = res.data;
                        }else{
                            deffer ? deffer.stroke() : '';
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //获取地区信息
                regionCheck : function (scope,level,value,callback) {
                    orderDetailInterface.regionCheck(scope,level,value, function (res) {
                        if(res.success){
                            callback(res.data);
                        }else{
                            toolsService.alertError('查询区域信息失败');
                        }
                    });
                },
                //订单是否存在于退换货单中
                orderIsInReturnOrExchangeBill : function (scope,code,deffer) {
                    orderDetailInterface.orderIsInReturnOrExchangeBill(scope,code, function (res) {
                        if(res.success){
                            deffer.resolve(res.data);
                        }else{
                            deffer.reject();
                        }
                    });
                },
                //订单是否存在于换货单中
                orderIsInReturnBill : function (scope,tradeid,deffer) {
                    orderDetailInterface.orderIsInReturnBill(scope,tradeid, function (res) {
                        if(res.success){
                            deffer.resolve(res.data);
                        }else{
                            deffer.reject();
                        }
                    });
                },
                //订单是否存在于换货单或退换货单中
                orderCanCreateBill : function (scope,code,tradeid,callback) {
                    ApiService.listenAll(function (deffer) {
                        orderDetailInterfaceDeal.orderIsInReturnOrExchangeBill(scope,code,deffer);
                    }, function (deffer) {
                        orderDetailInterfaceDeal.orderIsInReturnBill(scope,tradeid,deffer);
                    }).then(function (result) {
                        callback(result);
                    });
                }
            };

            //接口数据请求
            var orderDetailInterface = {
                /**
                 * 地区查询
                 * @param scope
                 * @param level 层级id
                 * @param value 区域id
                 * @param callback
                 */
                regionCheck : function (scope,level,value,callback) {
                    var url = '/BasicInformation/Region/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"RegionLevel",
                        "Value":level,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"ParentId",
                        "Value":value,
                        "Children":[]
                    }]);
                    var region = ApiService.postLoad(url,paramObj);
                    region.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取支付明细
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getPayDetails : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/PayMentQuery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"SalesOrderId",
                        "Name":"SalesOrderId",
                        "Value":orderid,
                        "Children":[]
                    }]);
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取发票信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getInvoiceInfo : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/InvoiceQuery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"SalesOrderId",
                        "Name":"SalesOrderId",
                        "Value":orderid,
                        "Children":[]
                    }]);
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },
                //获取地区与id对应关系
                getCountryCode : function (scope,callback) {
                    var url = '/BasicInformation/Region/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 修改收货信息
                 * @param scope
                 * @param callback
                 */
                changeAddress : function (scope,callback){
                    var url = '/SalesOrder/SalesOrder/SubSave';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "SubId": scope.order.subOrder.subid,
                        "ProvinceId": scope.goodsReception.ProvinceId,
                        "CityId":scope.goodsReception.CityId,
                        "CountyId": scope.goodsReception.CountyId,
                        "Address": scope.goodsReception.Address,
                        "ZipCode": scope.goodsReception.ZipCode,
                        "Contacter": scope.goodsReception.Contacter,
                        "Fax": scope.goodsReception.Fax,
                        "BuyerEmail": scope.goodsReception.BuyerEmail,
                        "CustomerShipDate": scope.goodsReception.customershipdate,
                        "ProvinceName": scope.goodsReception.ProvinceName,
                        "CityName": scope.goodsReception.CityName,
                        "CountyName": scope.goodsReception.CountyName,
                        "NationalId": scope.goodsReception.NationalId,//国家id
                        "NationalName": scope.goodsReception.NationalName,
                        "NationalCode": scope.goodsReception.NationalCode,
                        "CodPayment": scope.order.codpayment,
                        "IsPrime": scope.order.subOrder.isprime,
                        "IsBlacklist": scope.order.subOrder.isblacklist,
                        "IsMerge": scope.order.subOrder.ismerge,
                        "MergeMd5": "27CDD48503D1879B237EAC8FD9C1F43A",
                        "Consignee": scope.goodsReception.Consignee,
                        "Mobile": scope.goodsReception.Mobile,
                        "Telephone": scope.goodsReception.Telephone,
                        "ProvinceCode": scope.goodsReception.ProvinceCode,
                        "CityCode": scope.goodsReception.CityCode,
                        "CountyCode": scope.goodsReception.CountyCode,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取日志信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getLog : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrderLog/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":500,
                        "Timespan":"00:00:00.050",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"SalesOrderId",
                            "Name":"SalesOrderId",
                            "Value":orderid,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getProduct : function (scope,orderid,callback){
                    var url = '/SalesOrder/SalesOrder/DetailQuery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"SalesOrderId",
                        "Name":"SalesOrderId",
                        "Value":orderid,
                        "Children":[]}
                    ]);
                    var payDetails = ApiService.postLoad(url,paramObj);
                    payDetails.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加订单标记
                 * @param scope
                 * @param ids 订单的id
                 * @param tagname 标记名字
                 * @param callback
                 */
                addTag : function (scope,ids,tagname,callback){
                    var url = '/SalesOrder/SalesOrder/DetailAddTag';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['tagname'] = tagname;
                    paramObj['orderids'] = JSON.stringify(ids);
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 作废订单
                 * @param scope
                 * @param ids 订单id
                 * @param callback
                 */
                obsoleteProduct : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/DetailObsolete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取配货信息
                 * @param scope
                 * @param id 订单id
                 * @param callback
                 */
                getAllocations : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"SalesOrderId",
                        "Name":"SalesOrderId",
                        "Value":id,
                        "Children":[]
                    }]);
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 配货单明细
                 * @param scope
                 * @param id 配货单id
                 * @param callback
                 */
                getAllocationsDetails : function (scope,id,callback) {
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
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 取消配货
                 * @param scope
                 * @param id 配货信息id
                 * @param reason 取消原因
                 * @param callback
                 */
                allocationCancle : function (scope,id,reason,callback) {
                    var url = '/SalesOrder/Dispatch/Cancel';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.dispatchOrderId = id;
                    paramObj.reson = reason;
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 取消配货单明细
                 * @param scope
                 * @param id 配货单id
                 * @param detailsid 配货单明细id
                 * @param reason 取消明细原因
                 * @param callback
                 */
                cancleAllocationsDetails : function (scope,id,detailsid,reason,callback){
                    var url = '/SalesOrder/Dispatch/CancelDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.dispatchOrderId = id;
                    paramObj.dispatchOrderDetailId = detailsid;
                    paramObj.reson = reason;
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取快递明细
                 * @param scope
                 * @param id
                 * @param callback
                 */
                getExpress : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/GetExpressInfo';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.dispatchOrderId = id;
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * wms获取
                 * @param scope
                 * @param id
                 * @param callback
                 */
                getwms : function (scope,id,callback){
                    var url = '/SalesOrder/Dispatch/GetDeliveryLog';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 新增发票信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                addInvoice : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/InvoiceSave';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "InvoiceId":0,
                        "SalesOrderId":orderid,
                        "InvoiceType":Number(scope.InvoiceType),
                        "Title":scope.invoiceDetail.Title,
                        "Content":scope.invoiceDetail.Content,
                        "Amount":Number(scope.invoiceDetail.Amount),
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 删除发票明细
                 * @param scope
                 * @param id 订单id
                 * @param callback
                 */
                deleteInvoice : function (scope,id,callback){
                    var url = '/SalesOrder/SalesOrder/InvoiceDelete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 取消退款
                 * @param scope
                 * @param ids 商品id
                 * @param callback
                 */
                cancleRefund : function (scope,ids,callback) {
                    var url = '/SalesOrder/SalesOrder/CancelRefund';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var orderLabel = ApiService.postLoad(url,paramObj);
                    orderLabel.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 锁定订单
                 * @param scope
                 * @param orderIds 要锁定的订单的id数组
                 * @param callback
                 */
                lockOrder : function (scope,orderIds,callback){
                    var url = '/SalesOrder/SalesOrder/Lock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderIds);
                    var lockOrder = ApiService.postLoad(url,paramObj);
                    lockOrder.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 作废订单
                 * @param scope
                 * @param orderIds 要作废的订单的id
                 * @param callback
                 */
                obsoleteOrder : function (scope,orderIds,callback){
                    var url = '/SalesOrder/SalesOrder/Obsolete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderIds);
                    var lockOrder = ApiService.postLoad(url,paramObj);
                    lockOrder.then(function (res) {
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
                    var orderStatus = ApiService.postLoad(url,paramObj);
                    orderStatus.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加内部标签
                 * @param scope
                 * @param ids 要添加内部标签的订单id
                 * @param message 标签内容
                 * @param callback
                 */
                addInsideTag : function (scope,ids,message,callback){
                    var url = '/OrderMessage/BatchAddNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.ids = JSON.stringify(ids);
                    paramObj.message = JSON.stringify(message);
                    var orderStatus = ApiService.postLoad(url,paramObj);
                    orderStatus.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取可销数
                 * @param scope
                 * @param skuid 规格id
,                 * @param paytime 支付时间
                 * @param storeId 店铺id
                 * @param callback
                 */
                getProductCanSale : function (scope,skuid,paytime,storeId,callback) {
                    var url = '/Inventory/InventoryVirtual/GetCanSales';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.skuid = skuid;
                    paramObj.paytime = paytime;
                    paramObj.storeId = storeId;
                    var orderStatus = ApiService.postLoad(url,paramObj);
                    orderStatus.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 查看库存
                 * @param scope
                 * @param value 商品code
                 * @param callback
                 */
                getrepertory : function (scope,value,callback) {
                    var url = '/Inventory/InventoryVirtual/QueryInventory';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount": 0,
                        "Data": [
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": value,
                                "Children": []
                            },
                            {
                                "OperateType": 2,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Quantity",
                                "Name": "Quantity",
                                "Value": 0,
                                "Children": []
                            }
                        ],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var repertory = ApiService.postLoad(url,paramObj);
                    repertory.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 库存配置信息
                 * @param scope
                 * @param callback
                 */
                repertoryConfig : function (scope,callback) {
                    var url = '/BasicInformation/SystemConfig/GetInventoryConfig';
                    var paramObj = ApiService.getBasicParamobj();
                    var config = ApiService.postLoad(url,paramObj);
                    config.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 订单占用明细
                 * @param scope
                 * @param warseHouseId 仓库id
                 * @param skuid  规格id
                 */
                getOrderOccupy : function (scope,warseHouseId,skuid,callback) {
                    var url = '/Inventory/InventoryVirtual/QuerySalesOrderOccupation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"WarehouseId",
                        "Name":"WarehouseId",
                        "Value":warseHouseId,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"SkuId",
                        "Name":"SkuId",
                        "Value":skuid,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"IsDispatched",
                        "Name":"IsDispatched",
                        "Value":false,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Type",
                        "Name":"Type",
                        "Value":1,
                        "Children":[]
                    }]);
                    var order = ApiService.postLoad(url,paramObj);
                    order.then(function (res) {
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
                 * 获取订单信息
                 * @param scope
                 * @param id 订单id
                 * @param callback
                 */
                getOrderInfoById : function (scope,id,callback) {
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = id;
                    var order = ApiService.postLoad(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 订单是否存在于换货单中
                 * @param scope
                 * @param id 平台订单号
                 * @param callback
                 */
                orderIsInReturnBill : function (scope,id,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/OutOrderExist';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(id);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 订单是否存在于退换货单中
                 * @param scope
                 * @param id 订单编号
                 * @param callback
                 */
                orderIsInReturnOrExchangeBill : function (scope,id,callback) {
                    var url = '/SalesOrder/Return/ReturnOrder/ReturnOrderExist';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(id);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                orderDetailDomOperate : orderDetailDomOperate,
                orderDetailInterfaceDeal : orderDetailInterfaceDeal
            }
        }
    ]);